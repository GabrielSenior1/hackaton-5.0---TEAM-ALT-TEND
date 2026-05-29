/**
 * 📋 KANKU — Seller Orders Management
 * View and manage incoming orders
 */
import { getCurrentUser, getPedidosByVendedor, updatePedido } from '../firebase.js';
import { formatPrice } from '../api.js';

const estadoConfig = {
  pendiente: { label: t('seller.orders.pending'), icon: 'schedule', color: 'secondary', badgeClass: 'status-badge--pending' },
  confirmado: { label: t('seller.orders.confirmed'), icon: 'check_circle', color: 'tertiary', badgeClass: 'status-badge--active' },
  enviado: { label: t('seller.orders.shipped'), icon: 'local_shipping', color: 'primary', badgeClass: 'status-badge--exported' },
  entregado: { label: t('seller.orders.deliveredStatus'), icon: 'done_all', color: 'tertiary', badgeClass: 'status-badge--active' },
  cancelado: { label: t('seller.orders.cancelled'), icon: 'cancel', color: 'error', badgeClass: '' },
};

export function renderSellerOrders() {
  return `
    <div class="seller-content">
      <div class="container" style="padding: 32px 24px; display: flex; flex-direction: column; gap: 28px; max-width: 1100px;">

        <section style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 class="headline-lg" style="color: var(--on-background);">${t('seller.orders.title')}</h2>
            <p class="body-md" style="color: var(--on-surface-variant); margin-top: 4px;">${t('seller.orders.subtitle')}</p>
          </div>
          <button class="btn btn-secondary" style="padding: 10px 18px; font-size: 11px; border-radius: var(--radius-xl);" id="btn-refresh-orders">
            <span class="material-symbols-outlined" style="font-size: 18px;">refresh</span>
            ${t('seller.orders.refresh')}
          </button>
        </section>

        <!-- Status Filter -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="order-filter active" data-filter="all" style="padding: 8px 18px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid var(--outline-variant); background: var(--secondary-container); color: var(--on-secondary-container);">
            ${t('seller.orders.filterAll')}
          </button>
          <button class="order-filter" data-filter="pendiente" style="padding: 8px 18px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface);">
            ⏳ ${t('seller.orders.filterPending')}
          </button>
          <button class="order-filter" data-filter="confirmado" style="padding: 8px 18px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface);">
            ✅ ${t('seller.orders.filterConfirmed')}
          </button>
          <button class="order-filter" data-filter="enviado" style="padding: 8px 18px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface);">
            📦 ${t('seller.orders.filterShipped')}
          </button>
        </div>

        <!-- Orders List -->
        <div id="seller-orders-list" style="display: flex; flex-direction: column; gap: 16px;">
          <div style="text-align: center; padding: 60px 20px;">
            <div class="spinner" style="margin: 0 auto 16px;"></div>
            <p class="body-md" style="color: var(--on-surface-variant);">${t('seller.orders.loading')}</p>
          </div>
        </div>

      </div>
    </div>
  `;
}

let allOrders = [];
let orderFilter = 'all';

export async function initSellerOrders() {
  const user = getCurrentUser();
  if (!user) return;

  await loadOrders(user.uid);

  // Refresh
  document.getElementById('btn-refresh-orders')?.addEventListener('click', () => loadOrders(user.uid));

  // Filters
  document.querySelectorAll('.order-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.order-filter').forEach(b => {
        b.style.background = 'var(--surface-container)';
        b.style.color = 'var(--on-surface)';
        b.classList.remove('active');
      });
      btn.style.background = 'var(--secondary-container)';
      btn.style.color = 'var(--on-secondary-container)';
      btn.classList.add('active');
      orderFilter = btn.dataset.filter;
      renderOrdersList();
    });
  });
}

async function loadOrders(uid) {
  try {
    allOrders = await getPedidosByVendedor(uid);
    renderOrdersList();
  } catch (e) {
    console.error('Error loading orders:', e);
    const list = document.getElementById('seller-orders-list');
    if (list) list.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <span class="material-symbols-outlined" style="font-size: 48px; color: var(--error);">error</span>
        <p class="body-md" style="color: var(--error); margin-top: 8px;">${t('seller.orders.error')}</p>
      </div>
    `;
  }
}

function renderOrdersList() {
  const list = document.getElementById('seller-orders-list');
  if (!list) return;

  const filtered = orderFilter === 'all'
    ? allOrders
    : allOrders.filter(o => o.estado === orderFilter);

  if (filtered.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <span class="material-symbols-outlined" style="font-size: 56px; color: var(--outline);">inbox</span>
        <p class="body-md" style="color: var(--on-surface-variant); margin-top: 12px;">
          ${orderFilter === 'all' ? t('seller.orders.empty') : t('seller.orders.emptyFilter')}
        </p>
      </div>
    `;
    return;
  }

  list.innerHTML = filtered.map(order => {
    const config = estadoConfig[order.estado] || estadoConfig.pendiente;
    const date = order.creadoEn?.toDate?.() || new Date();
    const dateStr = date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    return `
      <div class="card" style="padding: 20px; display: flex; flex-direction: column; gap: 16px; animation: fadeInUp 0.4s ease;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="material-symbols-outlined filled" style="font-size: 24px; color: var(--${config.color});">${config.icon}</span>
            <div>
              <p style="font-weight: 700; font-size: 15px;">#${order.id.substring(0, 8).toUpperCase()}</p>
              <p style="font-size: 12px; color: var(--on-surface-variant);">${dateStr}</p>
            </div>
          </div>
          <span class="status-badge ${config.badgeClass}">${config.label}</span>
        </div>

        <!-- Order Items -->
        <div style="background: var(--surface-container-low); border-radius: var(--radius-lg); padding: 12px;">
          ${(order.items || []).map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 14px;">
              <span>${item.nombre || 'Producto'} × ${item.cantidad || 1}</span>
              <span style="font-weight: 600;">${formatPrice(item.precio || 0)}</span>
            </div>
          `).join('')}
        </div>

        <!-- Order Footer -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <p style="font-size: 12px; color: var(--on-surface-variant);">${t('seller.orders.buyer')}: <strong>${order.compradorNombre || order.compradorEmail || t('seller.orders.anonymous')}</strong></p>
          </div>
          <div style="display: flex; align-items: center; gap: 16px;">
            <span style="font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 700; color: var(--secondary);">${formatPrice(order.total || 0)}</span>
            
            ${order.estado === 'pendiente' ? `
              <button class="btn btn-primary order-action-btn" data-id="${order.id}" data-action="confirmado" style="padding: 8px 16px; font-size: 11px; border-radius: var(--radius-lg);">
                ${t('seller.orders.confirm')}
              </button>
            ` : order.estado === 'confirmado' ? `
              <button class="btn btn-primary order-action-btn" data-id="${order.id}" data-action="enviado" style="padding: 8px 16px; font-size: 11px; border-radius: var(--radius-lg);">
                ${t('seller.orders.markShipped')}
              </button>
            ` : order.estado === 'enviado' ? `
              <button class="btn btn-primary order-action-btn" data-id="${order.id}" data-action="entregado" style="padding: 8px 16px; font-size: 11px; border-radius: var(--radius-lg);">
                ${t('seller.orders.delivered')}
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach action listeners
  list.querySelectorAll('.order-action-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await updatePedido(btn.dataset.id, { estado: btn.dataset.action });
        const order = allOrders.find(o => o.id === btn.dataset.id);
        if (order) order.estado = btn.dataset.action;
        renderOrdersList();
        window.__components?.showToast?.(`${t('seller.orders.updated')}: ${estadoConfig[btn.dataset.action]?.label}`, 'success');
      } catch (e) {
        window.__components?.showToast?.(t('seller.orders.errorUpdating'), 'error');
      }
    });
  });
}
