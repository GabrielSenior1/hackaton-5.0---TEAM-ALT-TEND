/**
 * 🌿 KANKU — SPA Router & App
 * Hash-based SPA router connecting consumer and seller portals
 */

import { renderHeader, renderBottomNav, showToast, initHeader } from './components/header.js';
import { renderSellerHeader, initSellerHeader } from './components/seller-header.js';
import { renderHome } from './pages/home.js';
import { renderProduct, initProduct } from './pages/product.js';
import { renderTraceability, initTraceability } from './pages/traceability.js';
import { renderStory, initStory } from './pages/story.js';
import { renderScanner, initScanner, cleanupScanner } from './pages/scanner.js';
import { renderDashboard, initDashboard } from './pages/dashboard.js';
import { renderModel3D, initModel3D } from './pages/model3d.js';
import { renderSellerLogin, initSellerLogin } from './pages/seller-login.js';
import { renderSellerDashboard, initSellerDashboard } from './pages/seller-dashboard.js';
import { renderSellerProducts, initSellerProducts } from './pages/seller-products.js';
import { renderSellerOrders, initSellerOrders } from './pages/seller-orders.js';
import { renderSellerBrand, initSellerBrand } from './pages/seller-brand.js';
import { initFirebase, getCurrentUser, onAuthChange } from './firebase.js';

// ── Page Registry ────────────────────────────────────────
const consumerPages = {
  home:         { render: renderHome,         init: null,              title: 'Inicio' },
  product:      { render: renderProduct,      init: initProduct,       title: 'Tienda' },
  traceability: { render: renderTraceability, init: initTraceability,  title: 'Trazabilidad' },
  story:        { render: renderStory,        init: initStory,         title: 'Historia' },
  scanner:      { render: renderScanner,      init: initScanner,       title: 'Escanear' },
  dashboard:    { render: renderDashboard,    init: initDashboard,     title: 'Dashboard' },
  model3d:      { render: renderModel3D,      init: initModel3D,       title: '3D' },
};

const sellerPages = {
  'seller-login':    { render: renderSellerLogin,     init: initSellerLogin,     title: 'Iniciar Sesión', noAuth: true },
  'seller':          { render: renderSellerDashboard,  init: initSellerDashboard,  title: 'Dashboard Vendedor' },
  'seller-products': { render: renderSellerProducts,   init: initSellerProducts,   title: 'Mis Productos' },
  'seller-orders':   { render: renderSellerOrders,     init: initSellerOrders,     title: 'Pedidos' },
  'seller-brand':    { render: renderSellerBrand,      init: initSellerBrand,      title: 'Mi Marca' },
};

let currentPage = null;

// ── Router ───────────────────────────────────────────────
function getPageFromHash() {
  const hash = window.location.hash.replace('#', '').replace('/', '') || 'home';
  // Map seller routes
  if (hash.startsWith('seller')) {
    return sellerPages[hash] ? hash : 'seller-login';
  }
  return consumerPages[hash] ? hash : 'home';
}

function isSellerPage(pageId) {
  return pageId.startsWith('seller');
}

function navigate(pageId) {
  const allPages = { ...consumerPages, ...sellerPages };
  if (!allPages[pageId]) pageId = 'home';

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

  // Update document title
  document.title = `KANKU — ${page.title}`;

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

  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    const pageId = getPageFromHash();
    if (pageId !== currentPage) {
      if (currentPage === 'scanner') cleanupScanner();
      currentPage = pageId;
      renderPage(pageId);
    }
  });

  // Initial render
  const pageId = getPageFromHash();
  navigate(pageId);
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
