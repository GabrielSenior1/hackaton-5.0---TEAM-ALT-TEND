/**
 * 🌿 KANKU — SPA Router & App
 * Hash-based SPA router connecting consumer and seller portals
 */

import { t } from './translations.js';
window.t = t;

import { renderHeader, renderBottomNav, showToast, initHeader } from './components/header.js';
import { renderSellerHeader, initSellerHeader } from './components/seller-header.js';
import { renderProduct, initProduct } from './pages/product.js';
import { renderTraceability, initTraceability } from './pages/traceability.js';
import { renderStory, initStory } from './pages/story.js';
import { renderScanner, initScanner, cleanupScanner } from './pages/scanner.js';
import { renderDashboard, initDashboard } from './pages/dashboard.js';
import { renderModel3D, initModel3D } from './pages/model3d.js';
import { renderStores, initStores } from './pages/stores.js';
import { renderStoreDetail, initStoreDetail } from './pages/store-detail.js';
import { renderSellerLogin, initSellerLogin } from './pages/seller-login.js';
import { renderSellerDashboard, initSellerDashboard } from './pages/seller-dashboard.js';
import { renderSellerProducts, initSellerProducts } from './pages/seller-products.js';
import { renderSellerOrders, initSellerOrders } from './pages/seller-orders.js';
import { renderSellerBrand, initSellerBrand } from './pages/seller-brand.js';
import { renderCheckout, initCheckout } from './pages/checkout.js';
import { initFirebase, getCurrentUser, onAuthChange } from './firebase.js';

// ── Page Registry ────────────────────────────────────────
const consumerPages = {
  product:        { render: renderProduct,      init: initProduct,       title: () => t('nav.product') },
  stores:         { render: renderStores,       init: initStores,        title: () => t('nav.stores') },
  'store-detail': { render: renderStoreDetail,  init: initStoreDetail,   title: () => t('nav.stores') },
  traceability:   { render: renderTraceability, init: initTraceability,  title: () => t('nav.traceability') },
  story:          { render: renderStory,        init: initStory,         title: 'Story' },
  scanner:        { render: renderScanner,      init: initScanner,       title: () => t('nav.scanner') },
  dashboard:      { render: renderDashboard,    init: initDashboard,     title: () => t('nav.dashboard') },
  model3d:        { render: renderModel3D,      init: initModel3D,       title: () => t('nav.models3d') },
  checkout:       { render: renderCheckout,     init: initCheckout,      title: 'Finalizar Compra' },
};

const sellerPages = {
  'seller-login':    { render: renderSellerLogin,     init: initSellerLogin,     title: () => t('seller.login.login'), noAuth: true },
  'seller':          { render: renderSellerDashboard,  init: initSellerDashboard,  title: () => t('seller.dashboard.title') },
  'seller-products': { render: renderSellerProducts,   init: initSellerProducts,   title: () => t('seller.products.title') },
  'seller-orders':   { render: renderSellerOrders,     init: initSellerOrders,     title: () => t('seller.orders.title') },
  'seller-brand':    { render: renderSellerBrand,      init: initSellerBrand,      title: () => t('seller.brand.title') },
};

let currentPage = null;

// ── Router ───────────────────────────────────────────────
function getPageFromHash() {
  let hash = window.location.hash.replace('#', '').replace('/', '');
  // If we are returning from Stripe, always route to checkout regardless of hash
  const params = new URLSearchParams(window.location.search);
  if (params.has('session_id')) {
    return 'checkout';
  }
  
  if (!hash) hash = 'product';

  // Strip query params from hash (e.g. "store-detail?uid=xxx" → "store-detail")
  const baseHash = hash.split('?')[0];

  // Map seller routes
  if (baseHash.startsWith('seller')) {
    return sellerPages[baseHash] ? baseHash : 'seller-login';
  }
  return consumerPages[baseHash] ? baseHash : 'product';
}

function isSellerPage(pageId) {
  return pageId.startsWith('seller');
}

function navigate(pageId) {
  const allPages = { ...consumerPages, ...sellerPages };
  if (!allPages[pageId]) pageId = 'product';

  // Cleanup previous page
  if (currentPage === 'scanner') {
    cleanupScanner();
  }

  window.location.hash = pageId;
  currentPage = pageId;
  renderPage(pageId);
}

function renderPage(pageId) {
  const allPages = { ...consumerPages, ...sellerPages };
  const page = allPages[pageId];
  if (!page) return;

  // Check if seller page requires auth
  if (isSellerPage(pageId) && !page.noAuth) {
    const user = getCurrentUser();
    if (!user) {
      window.location.hash = '#/seller-login';
      currentPage = 'seller-login';
      renderPage('seller-login');
      return;
    }
  }

  // Update document title and html lang
  document.title = `KANKU — ${typeof page.title === 'function' ? page.title() : page.title}`;
  document.documentElement.lang = localStorage.getItem('lang') || 'es';

  const app = document.getElementById('app');
  if (!app) return;

  if (isSellerPage(pageId) && !page.noAuth) {
    // ── Seller Layout (sidebar + content) ──
    app.innerHTML = `
      <div class="seller-layout">
        ${renderSellerHeader(pageId)}
        <div class="seller-main">
          ${page.render()}
        </div>
      </div>
    `;

    // Initialize seller header
    initSellerHeader((hash) => renderPage(currentPage));
  } else {
    // ── Consumer Layout (header + page + bottom nav) ──
    app.innerHTML = `
      ${renderHeader(pageId)}
      <div id="page-container">
        ${page.render()}
      </div>
      <footer class="site-footer">
        <div class="site-footer__inner">
          <div>
            <div class="site-footer__brand">
              <span style="font-size: 20px;">🌿</span>
              KANKU
            </div>
            <p class="site-footer__tagline">Marketplace de la Sierra Nevada. Cacao, Café y Banano directo del productor a tu mesa.</p>
          </div>
          <div class="site-footer__links">
            <h4>${t('header.accessibility')}</h4>
            <a data-nav="stores">${t('nav.stores')}</a>
            <a data-nav="model3d">${t('nav.models3d')}</a>
            <a data-nav="traceability">${t('nav.traceability')}</a>
          </div>
        </div>
        <div class="site-footer__bottom">
          &copy; ${new Date().getFullYear()} KANKU. Sierra Nevada de Santa Marta, Colombia.
        </div>
      </footer>
      ${renderBottomNav(pageId)}
    `;

    // Setup header scroll behavior
    setupScrollBehavior();

    // Setup header selectors, cart, and accessibility
    initHeader((hash) => renderPage(currentPage));
  }

  // Initialize page-specific logic
  if (page.init) {
    requestAnimationFrame(() => {
      page.init();
    });
  }

  // Setup navigation handlers
  setupNavigation();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ── Navigation Setup ─────────────────────────────────────
function setupNavigation() {
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.dataset.nav;

      // Close mobile menus
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) mobileMenu.classList.remove('open');

      const sidebar = document.getElementById('seller-sidebar');
      const backdrop = document.getElementById('seller-sidebar-backdrop');
      if (sidebar) sidebar.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');

      navigate(target);
    });
  });

  // Mobile menu toggle (consumer)
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuClose = document.getElementById('menu-close');

  menuToggle?.addEventListener('click', () => mobileMenu?.classList.add('open'));
  menuClose?.addEventListener('click', () => mobileMenu?.classList.remove('open'));
  mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) mobileMenu.classList.remove('open');
  });
}

// ── Scroll Behavior ──────────────────────────────────────
function setupScrollBehavior() {
  const header = document.getElementById('top-app-bar');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ── Initialization ───────────────────────────────────────
async function init() {
  // Expose components globally
  window.__components = { showToast };

  // Initialize Firebase
  await initFirebase().catch(e => console.warn('Firebase init skipped:', e.message));

  // Esperar a que Firebase Auth recupere la sesión activa antes de navegar
  await new Promise((resolve) => {
    const unsubscribe = onAuthChange((user) => {
      resolve(user);
      if (typeof unsubscribe === 'function') unsubscribe();
    });
    // Tiempo de espera máximo de 1.5 segundos
    setTimeout(resolve, 1500);
  });

  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    const pageId = getPageFromHash();
    // Always re-render store-detail (UID in query may change), or when page changes
    if (pageId !== currentPage || pageId === 'store-detail') {
      if (currentPage === 'scanner') cleanupScanner();
      currentPage = pageId;
      renderPage(pageId);
    }
  });

  // Initial render
  const pageId = getPageFromHash();
  navigate(pageId);
}

// Start the app safely checking DOM state
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
