/**
 * 📊 KANKU — Seller Dashboard
 * KPIs, quick actions, and activity overview
 */
import { getCurrentUser, getVendedor, getProductosByVendedor, getPedidosByVendedor } from '../firebase.js';
import { formatPrice } from '../api.js';

export function renderSellerDashboard() {
  return `
    <div class="seller-content">
      <div class="container" style="padding: 32px 24px; display: flex; flex-direction: column; gap: 28px; max-width: 1100px;">

        <!-- Welcome Header -->
        <section style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 class="headline-lg" style="color: var(--on-background);">Dashboard</h2>
            <p class="body-md" style="color: var(--on-surface-variant); margin-top: 4px;" id="seller-welcome-text">Bienvenido a KANKU</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary" style="padding: 10px 18px; font-size: 11px; border-radius: var(--radius-xl);" id="btn-refresh-seller-dash">
              <span class="material-symbols-outlined" style="font-size: 18px;">refresh</span>
              ACTUALIZAR
            </button>
            <button class="btn btn-primary" style="padding: 10px 18px; font-size: 11px; border-radius: var(--radius-xl);" data-nav="seller-products">
              <span class="material-symbols-outlined" style="font-size: 18px;">add</span>
              NUEVO PRODUCTO
            </button>
          </div>
        </section>

        <!-- KPI Cards -->
        <section class="dashboard-grid" id="seller-kpi-section">
          <div class="kpi-card animate-fade-in-up stagger-1" style="opacity: 0;">
            <div class="kpi-card__icon kpi-card__icon--gold">
              <span class="material-symbols-outlined filled">inventory_2</span>
            </div>
            <div class="kpi-card__value" id="seller-kpi-products">—</div>
            <div class="kpi-card__label">Productos Activos</div>
          </div>

          <div class="kpi-card animate-fade-in-up stagger-2" style="opacity: 0;">
            <div class="kpi-card__icon kpi-card__icon--green">
              <span class="material-symbols-outlined filled">receipt_long</span>
            </div>
            <div class="kpi-card__value" id="seller-kpi-orders">—</div>
            <div class="kpi-card__label">Pedidos Totales</div>
          </div>

          <div class="kpi-card animate-fade-in-up stagger-3" style="opacity: 0;">
            <div class="kpi-card__icon kpi-card__icon--surface">
              <span class="material-symbols-outlined filled">pending_actions</span>
            </div>
            <div class="kpi-card__value" id="seller-kpi-pending">—</div>
            <div class="kpi-card__label">Pendientes</div>
          </div>

          <div class="kpi-card animate-fade-in-up stagger-4" style="opacity: 0;">
            <div class="kpi-card__icon kpi-card__icon--gold">
              <span class="material-symbols-outlined filled">payments</span>
            </div>
            <div class="kpi-card__value" id="seller-kpi-revenue">—</div>
            <div class="kpi-card__label">Ingresos Totales</div>
          </div>
        </section>

        <!-- Quick Actions -->
        <section>
          <h3 class="headline-md" style="margin-bottom: 16px;">Acciones Rápidas</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            
            <div class="card" style="cursor: pointer; text-align: center; padding: 28px 20px;" data-nav="seller-products">
              <span class="material-symbols-outlined" style="font-size: 40px; color: var(--secondary); margin-bottom: 12px;">add_circle</span>
              <h4 style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">Agregar Producto</h4>
              <p class="body-md" style="color: var(--on-surface-variant); font-size: 13px;">Cacao, Café o Banano</p>
            </div>

            <div class="card" style="cursor: pointer; text-align: center; padding: 28px 20px;" data-nav="seller-orders">
              <span class="material-symbols-outlined" style="font-size: 40px; color: var(--tertiary); margin-bottom: 12px;">local_shipping</span>
              <h4 style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">Ver Pedidos</h4>
              <p class="body-md" style="color: var(--on-surface-variant); font-size: 13px;">Gestiona tus envíos</p>
            </div>

            <div class="card" style="cursor: pointer; text-align: center; padding: 28px 20px;" data-nav="seller-brand">
              <span class="material-symbols-outlined" style="font-size: 40px; color: var(--primary); margin-bottom: 12px;">palette</span>
              <h4 style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">Mi Marca</h4>
              <p class="body-md" style="color: var(--on-surface-variant); font-size: 13px;">Configura tu perfil</p>
            </div>
          </div>
        </section>

        <!-- Categories Overview -->
        <section>
          <h3 class="headline-md" style="margin-bottom: 16px;">Mis Categorías</h3>
          <div id="seller-categories-overview" style="display: flex; gap: 16px; flex-wrap: wrap;">
            <div class="card-flat" style="flex: 1; min-width: 160px; text-align: center; padding: 24px;">
              <span style="font-size: 40px;">🍫</span>
              <p style="font-weight: 700; margin-top: 8px;">Cacao</p>
              <p id="cat-count-cacao" class="label-sm" style="color: var(--on-surface-variant); margin-top: 4px;">0 productos</p>
            </div>
            <div class="card-flat" style="flex: 1; min-width: 160px; text-align: center; padding: 24px;">
              <span style="font-size: 40px;">☕</span>
              <p style="font-weight: 700; margin-top: 8px;">Café</p>
              <p id="cat-count-cafe" class="label-sm" style="color: var(--on-surface-variant); margin-top: 4px;">0 productos</p>
            </div>
            <div class="card-flat" style="flex: 1; min-width: 160px; text-align: center; padding: 24px;">
              <span style="font-size: 40px;">🍌</span>
              <p style="font-weight: 700; margin-top: 8px;">Banano</p>
              <p id="cat-count-banano" class="label-sm" style="color: var(--on-surface-variant); margin-top: 4px;">0 productos</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  `;
}

export async function initSellerDashboard() {
  const user = getCurrentUser();
  if (!user) return;

  // Load vendedor info
  try {
    const vendedor = await getVendedor(user.uid);
    if (vendedor?.nombreMarca) {
      const welcome = document.getElementById('seller-welcome-text');
      if (welcome) welcome.textContent = \`Bienvenido, \${vendedor.nombreMarca}\`;
    }
  } catch (e) { console.warn(e); }

  // Load KPIs
  try {
    const products = await getProductosByVendedor(user.uid);
    const orders = await getPedidosByVendedor(user.uid);

    const activeProducts = products.filter(p => p.activo !== false);
    const pending = orders.filter(o => o.estado === 'pendiente');
    const revenue = orders
      .filter(o => o.estado !== 'cancelado')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    // Update KPIs
    animateKPI('seller-kpi-products', activeProducts.length);
    animateKPI('seller-kpi-orders', orders.length);
    animateKPI('seller-kpi-pending', pending.length);
    const revenueEl = document.getElementById('seller-kpi-revenue');
    if (revenueEl) revenueEl.textContent = formatPrice(revenue);

    // Update category counts
    const cacaoCount = activeProducts.filter(p => p.categoria === 'cacao').length;
    const cafeCount = activeProducts.filter(p => p.categoria === 'cafe').length;
    const bananoCount = activeProducts.filter(p => p.categoria === 'banano').length;

    const setCount = (id, count) => {
      const el = document.getElementById(id);
      if (el) el.textContent = \`\${count} producto\${count !== 1 ? 's' : ''}\`;
    };
    setCount('cat-count-cacao', cacaoCount);
    setCount('cat-count-cafe', cafeCount);
    setCount('cat-count-banano', bananoCount);
  } catch (e) {
    console.warn('Error loading seller KPIs:', e);
  }

  // Refresh button
  document.getElementById('btn-refresh-seller-dash')?.addEventListener('click', () => {
    initSellerDashboard();
  });
}

function animateKPI(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
}
