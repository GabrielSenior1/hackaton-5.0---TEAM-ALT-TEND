import { getCurrentUser, getPedidosByComprador, createReview, getReviewByUserAndProduct } from '../firebase.js';
import { formatPrice } from '../api.js';

const estadoConfig = {
  pendiente: { label: t('orders.status.pending'), icon: 'schedule', color: 'secondary' },
  confirmado: { label: t('orders.status.confirmed'), icon: 'check_circle', color: 'tertiary' },
  enviado: { label: t('orders.status.shipped'), icon: 'local_shipping', color: 'primary' },
  entregado: { label: t('orders.status.delivered'), icon: 'done_all', color: 'tertiary' },
  cancelado: { label: t('orders.status.cancelled'), icon: 'cancel', color: 'error' },
};

const estadoOrder = ['pendiente', 'confirmado', 'enviado', 'entregado'];

export function renderDashboard() {
  return `
    <div class="page-content">
      <main class="container" style="padding-top: 32px; padding-bottom: 60px; display: flex; flex-direction: column; gap: 28px;">
        <section style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 class="headline-lg" style="color: var(--on-background);">${t('orders.title')}</h2>
            <p class="body-md" style="color: var(--on-surface-variant); margin-top: 4px;">${t('orders.subtitle')}</p>
          </div>
          <button class="btn btn-secondary" style="padding: 10px 18px; font-size: 11px; border-radius: var(--radius-xl);" id="btn-refresh-orders-consumer">
            <span class="material-symbols-outlined" style="font-size: 18px;">refresh</span>
            ${t('orders.refresh')}
          </button>
        </section>

        <div id="consumer-orders-list" style="display: flex; flex-direction: column; gap: 20px;">
          <div style="text-align: center; padding: 60px 20px;">
            <div class="spinner" style="margin: 0 auto 16px;"></div>
            <p class="body-md" style="color: var(--on-surface-variant);">${t('orders.loading')}</p>
          </div>
        </div>
      </main>
    </div>

    <div id="review-modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15,12,8,0.7); backdrop-filter: blur(12px); z-index: 9999; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;"></div>
  `;
}

let allOrders = [];

export async function initDashboard() {
  const user = getCurrentUser();
  if (!user) {
    const list = document.getElementById('consumer-orders-list');
    if (list) list.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <span class="material-symbols-outlined" style="font-size: 56px; color: var(--outline);">person_off</span>
        <p class="body-md" style="color: var(--on-surface-variant); margin-top: 12px;">${t('header.login')}</p>
      </div>
    `;
    return;
  }

  await loadOrders(user.uid);

  document.getElementById('btn-refresh-orders-consumer')?.addEventListener('click', () => loadOrders(user.uid));
}

async function loadOrders(uid) {
  try {
    allOrders = await getPedidosByComprador(uid);
    renderOrders();
  } catch (e) {
    console.error('Error loading consumer orders:', e);
    const list = document.getElementById('consumer-orders-list');
    if (list) list.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <span class="material-symbols-outlined" style="font-size: 48px; color: var(--error);">error</span>
        <p class="body-md" style="color: var(--error); margin-top: 8px;">${t('orders.error')}</p>
      </div>
    `;
  }
}

function renderOrders() {
  const list = document.getElementById('consumer-orders-list');
  if (!list) return;

  if (allOrders.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 80px 20px;">
        <span class="material-symbols-outlined" style="font-size: 64px; color: var(--outline);">shopping_bag</span>
        <p class="body-md" style="color: var(--on-surface-variant); margin-top: 16px;">${t('orders.empty')}</p>
        <a data-nav="product" style="display: inline-block; margin-top: 20px; padding: 12px 28px; border-radius: 9999px; background: var(--secondary); color: var(--on-secondary); font-weight: 700; font-size: 13px; cursor: pointer;">${t('home.cta.scan')}</a>
      </div>
    `;
    return;
  }

  list.innerHTML = allOrders.map(order => {
    const config = estadoConfig[order.estado] || estadoConfig.pendiente;
    const date = order.creadoEn?.toDate?.() || new Date();
    const dateStr = date.toLocaleDateString(localStorage.getItem('lang') || 'es', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const currentIdx = estadoOrder.indexOf(order.estado);
    const isDelivered = order.estado === 'entregado';
    const isCancelled = order.estado === 'cancelado';

    return `
      <div class="card" style="padding: 24px; display: flex; flex-direction: column; gap: 16px; animation: fadeInUp 0.4s ease;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="material-symbols-outlined filled" style="font-size: 24px; color: var(--${config.color});">${config.icon}</span>
            <div>
              <p style="font-weight: 700; font-size: 15px;">${t('orders.id')} #${order.id.substring(0, 8).toUpperCase()}</p>
              <p style="font-size: 12px; color: var(--on-surface-variant);">${dateStr}</p>
            </div>
          </div>
          <span class="status-badge ${isCancelled ? '' : 'status-badge--active'}" style="background: ${isCancelled ? 'var(--error-container)' : 'var(--secondary-container)'}; color: ${isCancelled ? 'var(--on-error-container)' : 'var(--on-secondary-container)'};">${config.label}</span>
        </div>

        ${!isCancelled ? `
        <div style="display: flex; align-items: center; gap: 4px; padding: 12px 0;">
          ${estadoOrder.map((estado, i) => {
            const done = i <= currentIdx;
            return `
              <div style="display: flex; align-items: center; flex: 1; position: relative;">
                <div style="width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: ${done ? 'var(--tertiary)' : 'var(--surface-container-highest)'}; color: ${done ? 'var(--on-tertiary)' : 'var(--outline)'}; font-size: 12px; z-index: 1;">
                  <span class="material-symbols-outlined" style="font-size: 14px;">${done ? 'check' : 'radio_button_unchecked'}</span>
                </div>
                ${i < estadoOrder.length - 1 ? `
                  <div style="flex: 1; height: 2px; background: ${done ? 'var(--tertiary)' : 'var(--outline-variant)'};"></div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0 2px; margin-top: -8px; margin-bottom: 4px;">
          ${estadoOrder.map((estado, i) => `
            <span style="font-size: 10px; font-weight: 600; color: ${i <= currentIdx ? 'var(--tertiary)' : 'var(--outline)'}; text-align: center; width: ${100 / estadoOrder.length}%;">${estadoConfig[estado].label}</span>
          `).join('')}
        </div>
        ` : ''}

        <div style="background: var(--surface-container-low); border-radius: var(--radius-lg); padding: 12px; display: flex; flex-direction: column; gap: 8px;">
          ${(order.items || []).map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px;">
              <span>${item.nombre || 'Producto'} × ${item.cantidad || 1}</span>
              <span style="font-weight: 600;">${formatPrice(item.precio || 0)}</span>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; border-top: 1px solid var(--outline-variant); padding-top: 12px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 700; color: var(--secondary);">${t('orders.total')}: ${formatPrice(order.total || 0)}</span>
          ${isDelivered ? `<button class="btn btn-primary btn-review-order" data-order-id="${order.id}" style="padding: 8px 18px; font-size: 11px; border-radius: var(--radius-lg);">${t('orders.review')}</button>` : ''}
        </div>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.btn-review-order').forEach(btn => {
    btn.addEventListener('click', () => openReviewModal(btn.dataset.orderId));
  });
}

function openReviewModal(orderId) {
  const order = allOrders.find(o => o.id === orderId);
  if (!order || !order.items) return;

  const overlay = document.getElementById('review-modal-overlay');
  if (!overlay) return;

  const user = getCurrentUser();
  const uid = user?.uid;

  let productCards = '';
  let hasAllReviewed = true;

  Promise.all((order.items || []).map(async (item, idx) => {
    let existing = null;
    if (uid && item.productId) {
      existing = await getReviewByUserAndProduct(uid, item.productId);
    }
    if (!existing) hasAllReviewed = false;
    const stars = existing?.rating || 0;
    return `<div class="review-product-card" data-idx="${idx}" data-pid="${item.productId || ''}" data-pname="${item.nombre || 'Producto'}">
      <p style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">${item.nombre || 'Producto'}</p>
      ${existing ? `
        <p style="font-size: 12px; color: var(--tertiary); display: flex; align-items: center; gap: 4px;"><span class="material-symbols-outlined" style="font-size: 16px;">check_circle</span> ${t('orders.reviewed')}</p>
        <div style="display: flex; gap: 4px; margin-top: 4px;">${renderStaticStars(existing.rating || 0)}</div>
        ${existing.comentario ? `<p style="font-size: 12px; color: var(--on-surface-variant); margin-top: 4px; font-style: italic;">"${existing.comentario}"</p>` : ''}
      ` : `
        <div style="display: flex; gap: 4px; margin-bottom: 8px;" class="star-select" data-idx="${idx}">
          ${[1,2,3,4,5].map(i => `<span data-star="${i}" style="font-size: 28px; cursor: pointer; color: var(--outline); transition: color 0.15s;">★</span>`).join('')}
        </div>
        <textarea data-idx="${idx}" placeholder="${t('review.commentPlaceholder')}" style="width: 100%; padding: 10px; border: 1px solid var(--outline-variant); border-radius: var(--radius-lg); font-family: inherit; font-size: 13px; resize: vertical; background: var(--surface-container); color: var(--on-surface); min-height: 60px;"></textarea>
        <button class="btn btn-primary btn-submit-review" data-idx="${idx}" data-pid="${item.productId || ''}" style="margin-top: 8px; padding: 8px 16px; font-size: 11px; border-radius: var(--radius-lg);">${t('review.submit')}</button>
      `}
    </div>`;
  })).then(cards => {
    if (hasAllReviewed) {
      overlay.innerHTML = `
        <div style="background: var(--surface-container-high); border-radius: var(--radius-xl); padding: 32px; width: 100%; max-width: 500px; box-shadow: var(--shadow-lg); border: 1px solid var(--outline-variant); display: flex; flex-direction: column; gap: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-weight: 700; font-size: 18px; display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="color: var(--tertiary);">star</span> ${t('review.title')}</h3>
            <button id="review-modal-close" style="background: none; border: none; color: var(--on-surface-variant); cursor: pointer;"><span class="material-symbols-outlined">close</span></button>
          </div>
          <p style="text-align: center; padding: 24px; color: var(--on-surface-variant);">${t('orders.reviewed')} ✨</p>
        </div>
      `;
    } else {
      overlay.innerHTML = `
        <div style="background: var(--surface-container-high); border-radius: var(--radius-xl); padding: 32px; width: 100%; max-width: 500px; box-shadow: var(--shadow-lg); border: 1px solid var(--outline-variant); display: flex; flex-direction: column; gap: 20px; max-height: 90vh; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-weight: 700; font-size: 18px; display: flex; align-items: center; gap: 8px;"><span class="material-symbols-outlined" style="color: var(--tertiary);">star</span> ${t('orders.review')}</h3>
            <button id="review-modal-close" style="background: none; border: none; color: var(--on-surface-variant); cursor: pointer;"><span class="material-symbols-outlined">close</span></button>
          </div>
          <div style="display: flex; flex-direction: column; gap: 24px;" id="review-products-container">${cards.join('')}</div>
        </div>
      `;
    }

    overlay.style.display = 'flex';
    overlay.querySelectorAll('.star-select').forEach(container => {
      const idx = container.dataset.idx;
      container.querySelectorAll('[data-star]').forEach(star => {
        star.addEventListener('click', () => {
          const val = parseInt(star.dataset.star);
          container.querySelectorAll('[data-star]').forEach((s, i) => {
            s.style.color = i < val ? 'var(--secondary)' : 'var(--outline)';
          });
          container.dataset.rating = val;
        });
        star.addEventListener('mouseenter', () => {
          const val = parseInt(star.dataset.star);
          container.querySelectorAll('[data-star]').forEach((s, i) => {
            s.style.color = i < val ? 'var(--secondary)' : 'var(--outline)';
          });
        });
        container.addEventListener('mouseleave', () => {
          const val = parseInt(container.dataset.rating || 0);
          container.querySelectorAll('[data-star]').forEach((s, i) => {
            s.style.color = i < val ? 'var(--secondary)' : 'var(--outline)';
          });
        });
      });
    });

    overlay.querySelectorAll('.btn-submit-review').forEach(btn => {
      btn.addEventListener('click', async () => {
        const idx = btn.dataset.idx;
        const productId = btn.dataset.pid;
        if (!productId || !uid) return;

        const starContainer = overlay.querySelector(`.star-select[data-idx="${idx}"]`);
        const rating = parseInt(starContainer?.dataset?.rating || 0);
        const comentario = overlay.querySelector(`textarea[data-idx="${idx}"]`)?.value?.trim() || '';

        if (rating === 0) { window.__components?.showToast?.('Selecciona una calificación', 'error'); return; }

        try {
          await createReview({
            productId,
            compradorUid: uid,
            compradorNombre: user?.displayName || 'Anónimo',
            rating,
            comentario,
            orderId,
          });
          window.__components?.showToast?.(t('review.thanks'), 'success');
          openReviewModal(orderId);
          loadOrders(uid);
        } catch (e) {
          window.__components?.showToast?.(e.message, 'error');
        }
      });
    });

    document.getElementById('review-modal-close')?.addEventListener('click', () => { overlay.style.display = 'none'; });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.style.display = 'none'; });
  });
}

function renderStaticStars(rating) {
  return [1,2,3,4,5].map(i => `<span style="font-size: 18px; color: ${i <= rating ? 'var(--secondary)' : 'var(--outline)'};">★</span>`).join('');
}

export function getDashboardOrders() {
  return allOrders;
}
