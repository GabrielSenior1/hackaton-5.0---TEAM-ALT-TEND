/**
 * 🏠 Reusable Header Component with Cart, Language, Currency, and Accessibility Controls
 */
import { formatPrice } from '../api.js';

export function renderHeader(activePage = 'home') {
  const navItems = [
    { id: 'home', label: 'Inicio', icon: 'home' },
    { id: 'product', label: 'Tienda', icon: 'storefront' },
    { id: 'traceability', label: 'Transparencia', icon: 'verified_user' },
    { id: 'scanner', label: 'Escanear', icon: 'qr_code_scanner' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  ];

  // Retrieve current cart count safely
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!Array.isArray(cart)) cart = [];
  } catch (e) {
    cart = [];
    localStorage.setItem('cart', '[]');
  }
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Retrieve lang and currency from localStorage
  const lang = localStorage.getItem('lang') || 'es';
  const currency = localStorage.getItem('currency') || 'USD';
  
  const flags = { es: '🇪🇸', en: '🇺🇸', fr: '🇫🇷', pt: '🇵🇹' };
  const currentFlag = flags[lang] || '🇪🇸';

  return `
    <header class="top-app-bar" id="top-app-bar">
      <a class="top-app-bar__brand" data-nav="home">
        <span style="font-size: 24px;">🌿</span>
        <span class="top-app-bar__title" style="font-family: 'Playfair Display', serif; font-weight: 700; color: var(--secondary);">KANKU</span>
      </a>

      <!-- Navigation Links for Desktop -->
      <nav class="top-app-bar__nav" style="display: flex; gap: 28px; align-items: center;">
        ${navItems.map(item => `
          <a data-nav="${item.id}" class="${activePage === item.id ? 'active' : ''}" style="cursor: pointer; font-weight: 600; font-size: 14px; position: relative;">
            ${item.label}
          </a>
        `).join('')}
        <a data-nav="seller-login" style="cursor: pointer; font-weight: 600; font-size: 13px; padding: 8px 16px; border-radius: var(--radius-full); background: var(--tertiary); color: var(--on-tertiary); display: flex; align-items: center; gap: 6px; transition: all 0.2s ease;">
          <span class="material-symbols-outlined" style="font-size: 16px;">storefront</span>
          Vender
        </a>
      </nav>

      <!-- Amazon-Style Settings, Accessibility & Cart Controls -->
      <div style="display: flex; align-items: center; gap: 14px;">
        
        <!-- Language Dropdown (Amazon style) -->
        <div style="position: relative;" class="header-dropdown-container">
          <button id="btn-lang-dropdown" style="display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 13px; padding: 8px 12px; border-radius: var(--radius-xl); background: var(--surface-container-highest); border: 0.5px solid var(--outline-variant); cursor: pointer;">
            <span id="current-lang-flag">${currentFlag}</span>
            <span id="current-lang-text" style="text-transform: uppercase;">${lang}</span>
            <span class="material-symbols-outlined" style="font-size: 16px;">expand_more</span>
          </button>
          <div id="menu-lang-dropdown" style="
            position: absolute; top: 46px; right: 0; width: 150px;
            background: var(--surface-container-high); border: 1px solid var(--outline-variant);
            border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); padding: 8px;
            display: none; flex-direction: column; gap: 4px; z-index: 1000;
          ">
            <button class="lang-opt" data-lang="es" style="text-align: left; font-size: 13px; font-weight: 600; width: 100%; padding: 8px; border-radius: var(--radius-lg); display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <span>🇪🇸</span> Español
            </button>
            <button class="lang-opt" data-lang="en" style="text-align: left; font-size: 13px; font-weight: 600; width: 100%; padding: 8px; border-radius: var(--radius-lg); display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <span>🇺🇸</span> English
            </button>
            <button class="lang-opt" data-lang="fr" style="text-align: left; font-size: 13px; font-weight: 600; width: 100%; padding: 8px; border-radius: var(--radius-lg); display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <span>🇫🇷</span> Français
            </button>
            <button class="lang-opt" data-lang="pt" style="text-align: left; font-size: 13px; font-weight: 600; width: 100%; padding: 8px; border-radius: var(--radius-lg); display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <span>🇵🇹</span> Português
            </button>
          </div>
        </div>

        <!-- Currency Dropdown -->
        <div style="position: relative;" class="header-dropdown-container">
          <button id="btn-curr-dropdown" style="display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 13px; padding: 8px 12px; border-radius: var(--radius-xl); background: var(--surface-container-highest); border: 0.5px solid var(--outline-variant); cursor: pointer;">
            <span id="current-currency-text">${currency}</span>
            <span class="material-symbols-outlined" style="font-size: 16px;">expand_more</span>
          </button>
          <div id="menu-curr-dropdown" style="
            position: absolute; top: 46px; right: 0; width: 110px;
            background: var(--surface-container-high); border: 1px solid var(--outline-variant);
            border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); padding: 8px;
            display: none; flex-direction: column; gap: 4px; z-index: 1000;
          ">
            <button class="curr-opt" data-curr="COP" style="text-align: left; font-size: 13px; font-weight: 600; width: 100%; padding: 8px; border-radius: var(--radius-lg); cursor: pointer;">COP ($)</button>
            <button class="curr-opt" data-curr="USD" style="text-align: left; font-size: 13px; font-weight: 600; width: 100%; padding: 8px; border-radius: var(--radius-lg); cursor: pointer;">USD ($)</button>
            <button class="curr-opt" data-curr="EUR" style="text-align: left; font-size: 13px; font-weight: 600; width: 100%; padding: 8px; border-radius: var(--radius-lg); cursor: pointer;">EUR (€)</button>
          </div>
        </div>

        <!-- Accessibility Menu Dropdown -->
        <div style="position: relative;" class="header-dropdown-container">
          <button id="btn-acc-dropdown" title="Accesibilidad" style="width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--surface-container-highest); border: 0.5px solid var(--outline-variant); cursor: pointer;">
            <span class="material-symbols-outlined" style="color: var(--secondary); font-size: 20px;">accessibility_new</span>
          </button>
          <div id="menu-acc-dropdown" style="
            position: absolute; top: 46px; right: 0; width: 260px;
            background: var(--surface-container-high); border: 1px solid var(--outline-variant);
            border-radius: var(--radius-xl); box-shadow: var(--shadow-lg); padding: 16px;
            display: none; flex-direction: column; gap: 12px; z-index: 1000;
          ">
            <p style="font-size: 11px; font-weight: 700; color: var(--secondary); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 4px;">Accesibilidad Visual</p>
            
            <button id="acc-high-contrast" style="text-align: left; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 10px; border-radius: var(--radius-lg); background: var(--surface-container-low); cursor: pointer;">
              <span>Alto Contraste</span>
              <span id="contrast-status" class="material-symbols-outlined" style="font-size: 20px; color: var(--outline);">toggle_off</span>
            </button>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; background: var(--surface-container-low); padding: 8px; border-radius: var(--radius-lg);">
              <span style="font-size: 13px; font-weight: 600;">Tamaño de Letra</span>
              <div style="display: flex; gap: 8px;">
                <button id="acc-font-minus" style="width: 30px; height: 30px; border-radius: 50%; background: var(--surface-container-highest); font-weight: bold; font-size: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer;">A-</button>
                <button id="acc-font-plus" style="width: 30px; height: 30px; border-radius: 50%; background: var(--surface-container-highest); font-weight: bold; font-size: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer;">A+</button>
              </div>
            </div>

            <button id="acc-voice" style="text-align: left; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 10px; border-radius: var(--radius-lg); background: var(--surface-container-low); cursor: pointer;">
              <span>Audio-Guía (Voz)</span>
              <span id="voice-status" class="material-symbols-outlined" style="font-size: 20px; color: var(--outline);">toggle_off</span>
            </button>
          </div>
        </div>

        <!-- Cart Icon Button -->
        <button id="btn-cart-toggle" style="position: relative; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--surface-container-highest); border: 0.5px solid var(--outline-variant); cursor: pointer;" title="Ver Carrito">
          <span class="material-symbols-outlined" style="color: var(--secondary); font-size: 20px;">shopping_cart</span>
          ${cartCount > 0 ? `
            <span id="cart-badge-count" style="
              position: absolute; top: -4px; right: -4px;
              background: var(--tertiary); color: var(--on-tertiary);
              font-size: 10px; font-weight: 700; width: 18px; height: 18px;
              border-radius: 50%; display: flex; align-items: center; justify-content: center;
              box-shadow: var(--shadow-sm); border: 1.5px solid var(--background);
            ">${cartCount}</span>
          ` : ''}
        </button>

        <!-- Mobile Menu btn -->
        <button class="top-app-bar__menu-btn" id="menu-toggle" style="display: none;">
          <span class="material-symbols-outlined">menu</span>
        </button>

      </div>
    </header>

    <!-- Shopping Cart Drawer (Drawer Lateral Premium) -->
    <div id="cart-drawer" style="
      position: fixed; top: 0; right: -420px; width: 100%; max-width: 400px; height: 100vh;
      background: var(--background); border-left: 1px solid var(--outline-variant);
      box-shadow: var(--shadow-xl); z-index: 10000; display: flex; flex-direction: column;
      transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1); padding: 28px; box-sizing: border-box;
    ">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--outline-variant); padding-bottom: 18px; margin-bottom: 18px;">
        <h3 class="headline-md" style="margin: 0; display: flex; align-items: center; gap: 8px; color: var(--secondary);">
          <span class="material-symbols-outlined" style="font-size: 26px;">shopping_cart</span>
          Carrito
        </h3>
        <button id="cart-close-btn" style="cursor: pointer; color: var(--on-surface-variant); background: none; border: none; display: flex; align-items: center;">
          <span class="material-symbols-outlined" style="font-size: 24px;">close</span>
        </button>
      </div>
      
      <!-- Cart items container -->
      <div id="cart-drawer-items" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 16px;" class="hide-scrollbar">
        <!-- Rendered dynamically -->
      </div>
      
      <!-- Cart footer summary -->
      <div style="border-top: 1px solid var(--outline-variant); padding-top: 20px; margin-top: 20px; display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 16px; color: var(--on-surface);">
          <span>Total a pagar</span>
          <span id="cart-drawer-total" style="color: var(--secondary); font-size: 20px;">$0.00</span>
        </div>
        <button id="cart-drawer-checkout" class="btn btn-primary btn-full" style="padding: 16px; border-radius: var(--radius-xl); font-weight: 700;">
          PROCEDER AL PAGO
        </button>
      </div>
    </div>
    
    <!-- Drawer backdrop overlay -->
    <div id="cart-drawer-backdrop" style="
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 12, 8, 0.5); backdrop-filter: blur(4px); z-index: 9999;
      display: none; opacity: 0; transition: opacity 0.3s ease;
    "></div>
  `;
}

/**
 * 📱 Reusable Bottom Navigation Component
 */
export function renderBottomNav(activePage = 'home') {
  const items = [
    { id: 'home', label: 'Inicio', icon: 'home' },
    { id: 'product', label: 'Tienda', icon: 'storefront' },
    { id: 'scanner', label: 'Escanear', icon: 'qr_code_scanner' },
    { id: 'dashboard', label: 'Panel', icon: 'dashboard' },
  ];

  return `
    <nav class="bottom-nav" id="bottom-nav">
      ${items.map(item => `
        <a class="bottom-nav__item ${activePage === item.id ? 'active' : ''}" data-nav="${item.id}">
          <span class="material-symbols-outlined">${item.icon}</span>
          <span class="label-sm" style="font-size: 10px;">${item.label}</span>
        </a>
      `).join('')}
      <!-- Mobile Cart Toggle -->
      <a class="bottom-nav__item" id="btn-cart-toggle-mobile" style="position: relative;">
        <span class="material-symbols-outlined">shopping_cart</span>
        <span class="label-sm" style="font-size: 10px;">Carrito</span>
        <span id="cart-badge-count-mobile" style="
          position: absolute; top: 0px; right: 4px;
          background: var(--tertiary); color: var(--on-tertiary);
          font-size: 9px; font-weight: 700; width: 16px; height: 16px;
          border-radius: 50%; display: none; align-items: center; justify-content: center;
          box-shadow: var(--shadow-sm); border: 1.5px solid var(--surface-container-low);
        ">0</span>
      </a>
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

/**
 * ⚙️ Initialize Header Dropdowns, Sizing, Accessibility, Voice synthesis, and Cart Actions
 */
let voiceSynthesizerEnabled = false;
let currentFontSizeMultiplier = parseFloat(localStorage.getItem('fontScale') || '1.0');

export function initHeader(appRouter) {
  // --- Initialize Styles and Settings from LocalStorage ---
  
  // High contrast initialization
  const isHighContrast = localStorage.getItem('highContrast') === 'true';
  if (isHighContrast) {
    document.body.classList.add('high-contrast');
    const status = document.getElementById('contrast-status');
    if (status) {
      status.textContent = 'toggle_on';
      status.style.color = 'var(--tertiary)';
    }
  }

  // Font scale initialization
  document.documentElement.style.fontSize = (currentFontSizeMultiplier * 16) + 'px';

  // Voice synthesis initialization
  voiceSynthesizerEnabled = localStorage.getItem('voiceSynth') === 'true';
  const voiceStatus = document.getElementById('voice-status');
  if (voiceStatus && voiceSynthesizerEnabled) {
    voiceStatus.textContent = 'toggle_on';
    voiceStatus.style.color = 'var(--tertiary)';
  }

  // --- Dropdown Toggles ---
  setupDropdownToggle('btn-lang-dropdown', 'menu-lang-dropdown');
  setupDropdownToggle('btn-curr-dropdown', 'menu-curr-dropdown');
  setupDropdownToggle('btn-acc-dropdown', 'menu-acc-dropdown');

  function setupDropdownToggle(btnId, menuId) {
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = menu.style.display === 'flex';
      
      // Close all other menus first
      document.querySelectorAll('.header-dropdown-container > div').forEach(el => {
        el.style.display = 'none';
      });

      menu.style.display = isVisible ? 'none' : 'flex';
    });
  }

  // Close menus on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.header-dropdown-container > div').forEach(el => {
      el.style.display = 'none';
    });
  });

  // --- Language Selection Options ---
  document.querySelectorAll('.lang-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.dataset.lang;
      localStorage.setItem('lang', selectedLang);
      
      // Trigger complete routing re-render for translation change
      showToast('Idioma cambiado con éxito', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });
  });

  // --- Currency Selection Options ---
  document.querySelectorAll('.curr-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedCurrency = btn.dataset.curr;
      localStorage.setItem('currency', selectedCurrency);

      showToast(`Divisa cambiada a ${selectedCurrency}`, 'success');
      setTimeout(() => {
        // Trigger a simple routing page refresh to update prices dynamically
        const hash = window.location.hash || '#/';
        appRouter(hash);
      }, 300);
    });
  });

  // --- Accessibility Mode Actions ---
  
  // High contrast toggle
  document.getElementById('acc-high-contrast')?.addEventListener('click', () => {
    const active = document.body.classList.toggle('high-contrast');
    localStorage.setItem('highContrast', active);
    const status = document.getElementById('contrast-status');
    if (status) {
      status.textContent = active ? 'toggle_on' : 'toggle_off';
      status.style.color = active ? 'var(--tertiary)' : 'var(--outline)';
    }
    showToast(active ? 'Contraste Alto Activado' : 'Contraste Normal Activado', 'success');
  });

  // Font sizing listeners
  document.getElementById('acc-font-minus')?.addEventListener('click', () => {
    if (currentFontSizeMultiplier > 0.8) {
      currentFontSizeMultiplier -= 0.1;
      localStorage.setItem('fontScale', currentFontSizeMultiplier);
      document.documentElement.style.fontSize = (currentFontSizeMultiplier * 16) + 'px';
    }
  });

  document.getElementById('acc-font-plus')?.addEventListener('click', () => {
    if (currentFontSizeMultiplier < 1.4) {
      currentFontSizeMultiplier += 0.1;
      localStorage.setItem('fontScale', currentFontSizeMultiplier);
      document.documentElement.style.fontSize = (currentFontSizeMultiplier * 16) + 'px';
    }
  });

  // Dynamic voice synthesis (TTS) lector de pantalla accessibility feature
  document.getElementById('acc-voice')?.addEventListener('click', () => {
    voiceSynthesizerEnabled = !voiceSynthesizerEnabled;
    localStorage.setItem('voiceSynth', voiceSynthesizerEnabled);
    const voiceStatus = document.getElementById('voice-status');
    if (voiceStatus) {
      voiceStatus.textContent = voiceSynthesizerEnabled ? 'toggle_on' : 'toggle_off';
      voiceStatus.style.color = voiceSynthesizerEnabled ? 'var(--tertiary)' : 'var(--outline)';
    }
    showToast(voiceSynthesizerEnabled ? 'Lector de Voz Activado — Pasa el mouse sobre el texto' : 'Lector de Voz Desactivado', 'success');
  });

  // Screen reader synthesizer hover tracking
  document.body.addEventListener('mouseover', (e) => {
    if (!voiceSynthesizerEnabled) return;
    const text = e.target.innerText || e.target.alt || e.target.ariaLabel;
    if (text && text.trim().length > 0 && text.trim().length < 200) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = localStorage.getItem('lang') === 'en' ? 'en-US' : 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  });

  // --- Shopping Cart Drawer actions ---
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-drawer-backdrop');

  const openCart = () => {
    if (cartDrawer && cartBackdrop) {
      renderCartDrawerItems();
      cartBackdrop.style.display = 'block';
      setTimeout(() => {
        cartDrawer.style.right = '0';
        cartBackdrop.style.opacity = '1';
      }, 10);
    }
  };

  const closeCart = () => {
    if (cartDrawer && cartBackdrop) {
      cartDrawer.style.right = '-420px';
      cartBackdrop.style.opacity = '0';
      setTimeout(() => {
        cartBackdrop.style.display = 'none';
      }, 300);
    }
  };

  document.getElementById('btn-cart-toggle')?.addEventListener('click', openCart);
  document.getElementById('btn-cart-toggle-mobile')?.addEventListener('click', openCart);
  document.getElementById('cart-close-btn')?.addEventListener('click', closeCart);
  cartBackdrop?.addEventListener('click', closeCart);

  // checkout actions
  document.getElementById('cart-drawer-checkout')?.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      showToast('Tu carrito está vacío', 'error');
      return;
    }
    closeCart();
    
    // Redirect to checkout checkout flow or payments
    showToast('¡Redirigiendo a pasarela de pagos Stripe!', 'success');
    setTimeout(() => {
      window.location.hash = '#/product'; // Redirect to store checkout view
    }, 1000);
  });
}

/**
 * 🛒 Render Shopping Cart Drawer items dynamically
 */
export function renderCartDrawerItems() {
  const container = document.getElementById('cart-drawer-items');
  const totalEl = document.getElementById('cart-drawer-total');
  const badge = document.getElementById('cart-badge-count');
  const badgeMobile = document.getElementById('cart-badge-count-mobile');
  if (!container || !totalEl) return;

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!Array.isArray(cart)) cart = [];
  } catch (e) {
    cart = [];
    localStorage.setItem('cart', '[]');
  }
  
  // Update badge count
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  if (badge) {
    if (cartCount > 0) {
      badge.textContent = cartCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
  if (badgeMobile) {
    if (cartCount > 0) {
      badgeMobile.textContent = cartCount;
      badgeMobile.style.display = 'flex';
    } else {
      badgeMobile.style.display = 'none';
    }
  }

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 16px; opacity: 0.7; padding-top: 40px;">
        <span class="material-symbols-outlined" style="font-size: 56px; color: var(--outline);">shopping_bag</span>
        <p class="body-md" style="font-weight: 500;">Tu carrito está vacío</p>
      </div>
    `;
    totalEl.textContent = formatPrice(0);
    return;
  }

  let subtotal = 0;
  container.innerHTML = cart.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    return `
      <div style="display: flex; align-items: center; gap: 14px; background: var(--surface-container-low); padding: 12px; border-radius: var(--radius-xl); border: 1px solid var(--outline-variant);">
        <img src="${item.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: var(--radius-lg);" />
        <div style="flex: 1; min-width: 0;">
          <p style="font-weight: 700; font-size: 13px; color: var(--on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</p>
          <p style="font-size: 12px; font-weight: 600; color: var(--secondary); margin-top: 2px;">${formatPrice(item.price)} c/u</p>
        </div>
        
        <!-- Qty controls -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <button class="cart-qty-btn-minus" data-idx="${index}" style="width: 24px; height: 24px; border-radius: 50%; background: var(--surface-container-highest); display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer;">-</button>
          <span style="font-size: 13px; font-weight: 700; min-width: 14px; text-align: center;">${item.quantity}</span>
          <button class="cart-qty-btn-plus" data-idx="${index}" style="width: 24px; height: 24px; border-radius: 50%; background: var(--surface-container-highest); display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer;">+</button>
        </div>

        <button class="cart-delete-btn" data-idx="${index}" style="color: var(--error); padding: 4px; cursor: pointer; display: flex; align-items: center; background: none; border: none;" title="Eliminar">
          <span class="material-symbols-outlined" style="font-size: 20px;">delete</span>
        </button>
      </div>
    `;
  }).join('');

  totalEl.textContent = formatPrice(subtotal);

  // Attach quantity change listeners
  container.querySelectorAll('.cart-qty-btn-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      if (cart[idx].quantity > 1) {
        cart[idx].quantity--;
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartDrawerItems();
      }
    });
  });

  container.querySelectorAll('.cart-qty-btn-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      cart[idx].quantity++;
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCartDrawerItems();
    });
  });

  // Attach delete listeners
  container.querySelectorAll('.cart-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      cart.splice(idx, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCartDrawerItems();
      showToast('Producto eliminado del carrito', 'success');
    });
  });
}
