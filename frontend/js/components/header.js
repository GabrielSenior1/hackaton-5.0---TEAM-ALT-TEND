/**
 * 🏠 Reusable Header Component
 */
export function renderHeader(activePage = 'home') {
  const navItems = [
    { id: 'home', label: 'Inicio', icon: 'home' },
    { id: 'product', label: 'Tienda', icon: 'storefront' },
    { id: 'traceability', label: 'Transparencia', icon: 'verified_user' },
    { id: 'scanner', label: 'Escanear', icon: 'qr_code_scanner' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  ];

  return `
    <header class="top-app-bar" id="top-app-bar">
      <a class="top-app-bar__brand" data-nav="home">
        <span class="material-symbols-outlined filled">landscape</span>
        <span class="top-app-bar__title">Cacao de la Sierra</span>
      </a>
      <nav class="top-app-bar__nav">
        ${navItems.map(item => `
          <a data-nav="${item.id}" class="${activePage === item.id ? 'active' : ''}">${item.label}</a>
        `).join('')}
      </nav>
      <button class="top-app-bar__menu-btn" id="menu-toggle">
        <span class="material-symbols-outlined">menu</span>
      </button>
    </header>

    <!-- Mobile Menu -->
    <div class="mobile-menu" id="mobile-menu">
      <div class="mobile-menu__panel">
        <button class="mobile-menu__close" id="menu-close">
          <span class="material-symbols-outlined">close</span>
        </button>
        ${navItems.map(item => `
          <a class="mobile-menu__link ${activePage === item.id ? 'active' : ''}" data-nav="${item.id}">
            <span class="material-symbols-outlined">${item.icon}</span>
            ${item.label}
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * 📱 Reusable Bottom Navigation Component
 */
export function renderBottomNav(activePage = 'home') {
  const items = [
    { id: 'home', label: 'Inicio', icon: 'home' },
    { id: 'scanner', label: 'Escanear', icon: 'qr_code_scanner' },
    { id: 'traceability', label: 'Rastreo', icon: 'verified_user' },
    { id: 'dashboard', label: 'Panel', icon: 'dashboard' },
  ];

  return `
    <nav class="bottom-nav" id="bottom-nav">
      ${items.map(item => `
        <a class="bottom-nav__item ${activePage === item.id ? 'active' : ''}" data-nav="${item.id}">
          <span class="material-symbols-outlined">${item.icon}</span>
          <span class="label-sm">${item.label}</span>
        </a>
      `).join('')}
    </nav>
  `;
}

/**
 * 🔔 Toast notification utility
 */
export function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icon = type === 'success' ? 'check_circle' : 'error';
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined filled">${icon}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
