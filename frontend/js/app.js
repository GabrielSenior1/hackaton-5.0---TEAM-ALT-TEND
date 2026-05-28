/**
 * 🍫 Cacao de la Sierra — SPA Router & App
 * Hash-based SPA router connecting all pages
 */

import { renderHeader, renderBottomNav, showToast } from './components/header.js';
import { renderHome } from './pages/home.js';
import { renderProduct, initProduct } from './pages/product.js';
import { renderTraceability, initTraceability } from './pages/traceability.js';
import { renderStory, initStory } from './pages/story.js';
import { renderScanner, initScanner, cleanupScanner } from './pages/scanner.js';
import { renderDashboard, initDashboard } from './pages/dashboard.js';
import { renderModel3D, initModel3D } from './pages/model3d.js';
import { initFirebase } from './firebase.js';

// ── Page Registry ────────────────────────────────────────
const pages = {
  home:         { render: renderHome,         init: null,              title: 'Inicio' },
  product:      { render: renderProduct,      init: initProduct,       title: 'Tienda' },
  traceability: { render: renderTraceability, init: initTraceability,  title: 'Transparencia' },
  story:        { render: renderStory,        init: initStory,         title: 'Historia' },
  scanner:      { render: renderScanner,      init: initScanner,       title: 'Escanear' },
  dashboard:    { render: renderDashboard,    init: initDashboard,     title: 'Dashboard' },
  model3d:      { render: renderModel3D,      init: initModel3D,       title: '3D' },
};

let currentPage = null;

// ── Router ───────────────────────────────────────────────
function getPageFromHash() {
  const hash = window.location.hash.replace('#', '').replace('/', '') || 'home';
  return pages[hash] ? hash : 'home';
}

function navigate(pageId) {
  if (!pages[pageId]) pageId = 'home';
  
  // Cleanup previous page
  if (currentPage === 'scanner') {
    cleanupScanner();
  }

  window.location.hash = pageId;
  currentPage = pageId;
  renderPage(pageId);
}

function renderPage(pageId) {
  const page = pages[pageId];
  if (!page) return;

  // Update document title
  document.title = `Cacao de la Sierra — ${page.title}`;

  const app = document.getElementById('app');
  if (!app) return;

  // Build the full page layout
  app.innerHTML = `
    ${renderHeader(pageId)}
    <div id="page-container">
      ${page.render()}
    </div>
    ${renderBottomNav(pageId)}
  `;

  // Initialize page-specific logic
  if (page.init) {
    requestAnimationFrame(() => {
      page.init();
    });
  }

  // Setup navigation handlers
  setupNavigation();

  // Setup header scroll behavior
  setupScrollBehavior();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ── Navigation Setup ─────────────────────────────────────
function setupNavigation() {
  // All elements with data-nav attribute trigger navigation
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.dataset.nav;
      
      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu) mobileMenu.classList.remove('open');
      
      navigate(target);
    });
  });

  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuClose = document.getElementById('menu-close');

  menuToggle?.addEventListener('click', () => {
    mobileMenu?.classList.add('open');
  });

  menuClose?.addEventListener('click', () => {
    mobileMenu?.classList.remove('open');
  });

  // Close mobile menu on backdrop click
  mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove('open');
    }
  });
}

// ── Scroll Behavior ──────────────────────────────────────
function setupScrollBehavior() {
  const header = document.getElementById('top-app-bar');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (scroll > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scroll;
  }, { passive: true });
}

// ── Initialization ───────────────────────────────────────
async function init() {
  // Expose components globally for cross-module use
  window.__components = { showToast };

  // Initialize Firebase (non-blocking)
  initFirebase().catch(e => console.warn('Firebase init skipped:', e.message));

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
