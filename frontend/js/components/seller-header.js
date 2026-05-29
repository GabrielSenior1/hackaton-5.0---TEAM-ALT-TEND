/**
 * 🏪 KANKU — Seller Portal Header & Sidebar Component
 */
import { logoutUser, getCurrentUser, getVendedor } from '../firebase.js';

export function renderSellerHeader(activePage = 'seller') {
  const navItems = [
    { id: 'seller', label: t('seller.header.dashboard'), icon: 'dashboard' },
    { id: 'seller-products', label: t('seller.header.products'), icon: 'inventory_2' },
    { id: 'seller-orders', label: t('seller.header.orders'), icon: 'receipt_long' },
    { id: 'seller-brand', label: t('seller.header.brand'), icon: 'storefront' },
  ];

  return `
    <!-- Seller Sidebar (Desktop) -->
    <aside class="seller-sidebar" id="seller-sidebar">
      <div class="seller-sidebar__brand">
        <a data-nav="home" style="cursor: pointer; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 28px;">🌿</span>
          <span style="font-family: 'Playfair Display', serif; font-weight: 700; font-size: 22px; color: var(--secondary);">KANKU</span>
        </a>
        <span class="label-sm" style="color: var(--on-surface-variant); margin-top: 4px; display: block;">${t('seller.header.portal')}</span>
      </div>

      <nav class="seller-sidebar__nav">
        ${navItems.map(item => `
          <a data-nav="${item.id}" class="seller-sidebar__link ${activePage === item.id ? 'active' : ''}">
            <span class="material-symbols-outlined${activePage === item.id ? ' filled' : ''}">${item.icon}</span>
            <span>${item.label}</span>
          </a>
        `).join('')}
      </nav>

      <div class="seller-sidebar__footer">
        <div class="seller-sidebar__user" id="seller-user-info">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--secondary-container); display: flex; align-items: center; justify-content: center;">
            <span class="material-symbols-outlined" style="font-size: 18px; color: var(--on-secondary-container);">person</span>
          </div>
          <div style="flex: 1; min-width: 0;">
            <p id="seller-brand-name" style="font-size: 13px; font-weight: 700; color: var(--on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Mi Marca</p>
            <p id="seller-email" style="font-size: 11px; color: var(--on-surface-variant); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">correo@email.com</p>
          </div>
        </div>

        <button id="seller-logout-btn" class="seller-sidebar__link" style="color: var(--error); margin-top: 8px;">
          <span class="material-symbols-outlined">logout</span>
          <span>${t('seller.header.logout')}</span>
        </button>

        <a data-nav="home" class="seller-sidebar__link" style="margin-top: 4px;">
          <span class="material-symbols-outlined">shopping_bag</span>
          <span>${t('seller.header.goToStore')}</span>
        </a>
      </div>
    </aside>

    <!-- Top bar for mobile seller -->
    <header class="seller-topbar" id="seller-topbar">
      <button id="seller-menu-toggle" style="display: flex; align-items: center; background: none; border: none; cursor: pointer;">
        <span class="material-symbols-outlined" style="font-size: 26px; color: var(--on-surface);">menu</span>
      </button>
      <span style="font-family: 'Playfair Display', serif; font-weight: 700; font-size: 18px; color: var(--secondary);">KANKU</span>
      <button id="seller-logout-btn-mobile" style="display: flex; align-items: center; background: none; border: none; cursor: pointer;">
        <span class="material-symbols-outlined" style="font-size: 22px; color: var(--error);">logout</span>
      </button>
    </header>

    <!-- Mobile drawer overlay -->
    <div id="seller-sidebar-backdrop" class="seller-sidebar-backdrop"></div>
  `;
}

/**
 * Initialize seller header interactions
 */
export function initSellerHeader(appRouter) {
  const sidebar = document.getElementById('seller-sidebar');
  const backdrop = document.getElementById('seller-sidebar-backdrop');
  const toggle = document.getElementById('seller-menu-toggle');

  // Mobile sidebar toggle
  toggle?.addEventListener('click', () => {
    sidebar?.classList.add('open');
    backdrop?.classList.add('open');
  });

  backdrop?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
    backdrop?.classList.remove('open');
  });

  // Logout buttons
  const logout = async () => {
    await logoutUser();
    localStorage.removeItem('kanku_role');
    window.location.hash = '#/';
    window.location.reload();
  };

  document.getElementById('seller-logout-btn')?.addEventListener('click', logout);
  document.getElementById('seller-logout-btn-mobile')?.addEventListener('click', logout);

  // Load seller info
  loadSellerInfo();
}

async function loadSellerInfo() {
  const user = getCurrentUser();
  if (!user) return;

  const emailEl = document.getElementById('seller-email');
  if (emailEl) emailEl.textContent = user.email;

  try {
    const vendedor = await getVendedor(user.uid);
    if (vendedor?.nombreMarca) {
      const nameEl = document.getElementById('seller-brand-name');
      if (nameEl) nameEl.textContent = vendedor.nombreMarca;
    }
  } catch (e) {
    console.warn('Could not load seller brand name:', e);
  }
}
