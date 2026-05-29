/**
 * 🏠 Reusable Header Component with Cart, Language, Currency, and Accessibility Controls
 */
import { formatPrice } from '../api.js';
import { createPedido, getCurrentUser } from '../firebase.js';

export function renderHeader(activePage = 'product') {
  const navItems = [
    { id: 'product', label: t('nav.product'), icon: 'storefront' },
    { id: 'stores', label: t('nav.stores'), icon: 'store' },
    { id: 'model3d', label: t('nav.models3d'), icon: 'view_in_ar' },
    { id: 'scanner', label: t('nav.scanner'), icon: 'qr_code_scanner' },
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
        <img src="https://i.postimg.cc/25xCXKX3/Kanku-Logo.png" alt="KANKU" style="height: 36px; width: auto; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));">
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
          ${t('nav.seller')}
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
              <span>🇪🇸</span> ${t('header.lang.es')}
            </button>
            <button class="lang-opt" data-lang="en" style="text-align: left; font-size: 13px; font-weight: 600; width: 100%; padding: 8px; border-radius: var(--radius-lg); display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <span>🇺🇸</span> ${t('header.lang.en')}
            </button>
            <button class="lang-opt" data-lang="fr" style="text-align: left; font-size: 13px; font-weight: 600; width: 100%; padding: 8px; border-radius: var(--radius-lg); display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <span>🇫🇷</span> ${t('header.lang.fr')}
            </button>
            <button class="lang-opt" data-lang="pt" style="text-align: left; font-size: 13px; font-weight: 600; width: 100%; padding: 8px; border-radius: var(--radius-lg); display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <span>🇵🇹</span> ${t('header.lang.pt')}
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
            <p style="font-size: 11px; font-weight: 700; color: var(--secondary); letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 4px;">${t('header.accessibility')}</p>
            
            <button id="acc-high-contrast" style="text-align: left; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 10px; border-radius: var(--radius-lg); background: var(--surface-container-low); cursor: pointer;">
              <span>${t('header.highContrast')}</span>
              <span id="contrast-status" class="material-symbols-outlined" style="font-size: 20px; color: var(--outline);">toggle_off</span>
            </button>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; background: var(--surface-container-low); padding: 8px; border-radius: var(--radius-lg);">
              <span style="font-size: 13px; font-weight: 600;">${t('header.fontSize')}</span>
              <div style="display: flex; gap: 8px;">
                <button id="acc-font-minus" style="width: 30px; height: 30px; border-radius: 50%; background: var(--surface-container-highest); font-weight: bold; font-size: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer;">A-</button>
                <button id="acc-font-plus" style="width: 30px; height: 30px; border-radius: 50%; background: var(--surface-container-highest); font-weight: bold; font-size: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer;">A+</button>
              </div>
            </div>

            <button id="acc-voice" style="text-align: left; font-size: 13px; font-weight: 600; display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 10px; border-radius: var(--radius-lg); background: var(--surface-container-low); cursor: pointer;">
              <span>${t('header.voiceGuide')}</span>
              <span id="voice-status" class="material-symbols-outlined" style="font-size: 20px; color: var(--outline);">toggle_off</span>
            </button>
          </div>
        </div>

        <button id="btn-cart-toggle" style="position: relative; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--surface-container-highest); border: 0.5px solid var(--outline-variant); cursor: pointer;" title="${t('header.viewCart')}">
          <span class="material-symbols-outlined" style="color: var(--secondary); font-size: 20px;">shopping_cart</span>
          <span id="cart-badge-count" class="cart-badge" style="display: ${cartCount > 0 ? 'flex' : 'none'};">${cartCount}</span>
        </button>

        <!-- Mobile Menu btn -->
        <button class="top-app-bar__menu-btn" id="menu-toggle" style="display: none;">
          <span class="material-symbols-outlined">menu</span>
        </button>

      </div>
    </header>

    <!-- Shopping Cart Drawer -->
    <div id="cart-drawer" style="
      position: fixed; top: 0; right: -440px; width: 100%; max-width: 420px; height: 100vh;
      background: var(--surface-container-low); z-index: 10000; display: flex; flex-direction: column;
      transition: right 0.35s cubic-bezier(0.16, 1, 0.3, 1); box-sizing: border-box;
    ">
      <!-- Header -->
      <div style="background: var(--surface-container-high); padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--outline-variant);">
        <h3 style="margin: 0; font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 10px; color: var(--on-surface); font-family: 'Inter', sans-serif;">
          <span class="material-symbols-outlined" style="font-size: 22px; color: var(--secondary);">shopping_cart</span>
          ${t('header.cartTitle')}
        </h3>
        <button id="cart-close-btn" style="width: 36px; height: 36px; border-radius: 50%; background: var(--surface-container); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; color: var(--on-surface-variant);">
          <span class="material-symbols-outlined" style="font-size: 20px;">close</span>
        </button>
      </div>
      
      <!-- Cart items container -->
      <div id="cart-drawer-items" style="flex: 1; overflow-y: auto; padding: 16px 20px;" class="hide-scrollbar">
        <!-- Rendered dynamically -->
      </div>
      
      <!-- Cart footer summary -->
      <div style="background: var(--surface-container-high); border-top: 1px solid var(--outline-variant); padding: 20px 24px; padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px)); display: flex; flex-direction: column; gap: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span style="font-weight: 600; font-size: 14px; color: var(--on-surface-variant);">${t('header.cartTotal')}</span>
          <span id="cart-drawer-total" style="font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 800; color: var(--secondary);">$0.00</span>
        </div>
        <button id="cart-drawer-checkout" style="
          width: 100%; padding: 16px; border-radius: var(--radius-xl); font-weight: 700; font-size: 15px;
          background: linear-gradient(135deg, #2e7d32, #43a047); color: #fff;
          border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15); transition: transform 0.2s, box-shadow 0.2s;
        " onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='';this.style.boxShadow='0 4px 16px rgba(0,0,0,0.15)'">
          <span class="material-symbols-outlined" style="font-size: 20px;">lock</span>
          ${t('header.cartCheckout')}
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
  const lang = localStorage.getItem('lang') || 'es';
  const currency = localStorage.getItem('currency') || 'USD';
  const flags = { es: '🇪🇸', en: '🇺🇸', fr: '🇫🇷', pt: '🇵🇹' };
  const langNames = { es: 'Español', en: 'English', fr: 'Français', pt: 'Português' };
  const currencySymbols = { COP: 'COP $', USD: 'USD $', EUR: 'EUR €' };

  const items = [
    { id: 'product', label: t('nav.product'), icon: 'storefront' },
    { id: 'stores', label: t('nav.stores'), icon: 'store' },
    { id: 'model3d', label: t('nav.models3d'), icon: 'view_in_ar' },
  ];

  return `
    <nav class="bottom-nav" id="bottom-nav">
      ${items.map(item => `
        <a class="bottom-nav__item ${activePage === item.id ? 'active' : ''}" data-nav="${item.id}">
          <span class="material-symbols-outlined">${item.icon}</span>
          <span class="label-sm">${item.label}</span>
        </a>
      `).join('')}
      <!-- Mobile Cart Toggle -->
      <a class="bottom-nav__item" id="btn-cart-toggle-mobile" style="position: relative;">
        <span class="material-symbols-outlined">shopping_cart</span>
        <span class="label-sm">${t('nav.cart')}</span>
        <span id="cart-badge-count-mobile" class="cart-badge" style="display: none; width: 14px; height: 14px; font-size: 8px; top: 0px; right: 2px; border-color: var(--surface-container-low);">0</span>
      </a>
      <!-- More Menu Toggle -->
      <a class="bottom-nav__item" id="btn-more-mobile" style="cursor: pointer;">
        <span class="material-symbols-outlined">more_horiz</span>
        <span class="label-sm">Más</span>
      </a>
    </nav>

    <!-- Mobile More Menu -->
    <div id="mobile-more-menu" class="mobile-more-menu">
      <div class="mobile-more-menu__panel">
        ${Object.entries(flags).map(([code, flag]) => `
          <button class="mobile-more-menu__opt ${code === lang ? 'active' : ''}" data-lang="${code}">
            <span>${flag}</span>
            <span>${langNames[code]}</span>
            ${code === lang ? '<span class="material-symbols-outlined" style="font-size: 14px; color: var(--secondary); margin-left: auto;">check</span>' : ''}
          </button>
        `).join('')}

        <div style="height:1px;background:var(--outline-variant);margin:4px 0;"></div>

        ${Object.entries(currencySymbols).map(([code, label]) => `
          <button class="mobile-more-menu__opt ${code === currency ? 'active' : ''}" data-curr="${code}">
            <span>${label}</span>
            ${code === currency ? '<span class="material-symbols-outlined" style="font-size: 14px; color: var(--secondary); margin-left: auto;">check</span>' : ''}
          </button>
        `).join('')}

        <div style="height:1px;background:var(--outline-variant);margin:4px 0;"></div>

        <button class="mobile-more-menu__opt" data-nav="scanner">
          <span class="material-symbols-outlined" style="font-size: 16px;">qr_code_scanner</span>
          <span>${t('nav.scanner')}</span>
        </button>
        <button class="mobile-more-menu__opt" data-nav="dashboard">
          <span class="material-symbols-outlined" style="font-size: 16px;">dashboard</span>
          <span>${t('nav.dashboard')}</span>
        </button>
        <button class="mobile-more-menu__opt" data-nav="traceability">
          <span class="material-symbols-outlined" style="font-size: 16px;">verified_user</span>
          <span>${t('nav.traceability')}</span>
        </button>

        <div style="height:1px;background:var(--outline-variant);margin:4px 0;"></div>

        <button class="mobile-more-menu__opt" id="mobile-login-btn" style="color: var(--secondary);">
          <span class="material-symbols-outlined" style="font-size: 16px;">storefront</span>
          <span>${t('nav.seller')}</span>
        </button>
      </div>
    </div>
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
      showToast(t('header.langChanged'), 'success');
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

      showToast(`${t('header.currencyChanged')} ${selectedCurrency}`, 'success');
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
    showToast(active ? t('header.contrastOn') : t('header.contrastOff'), 'success');
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
    showToast(voiceSynthesizerEnabled ? t('header.voiceOn') : t('header.voiceOff'), 'success');
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
      cartDrawer.style.right = '-440px';
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

  // Mobile more menu
  const moreBtn = document.getElementById('btn-more-mobile');
  const moreMenu = document.getElementById('mobile-more-menu');
  if (moreBtn && moreMenu) {
    moreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      moreMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#mobile-more-menu') && !e.target.closest('#btn-more-mobile')) {
        moreMenu.classList.remove('open');
      }
    });
  }

  // Mobile more menu — language options
  document.querySelectorAll('#mobile-more-menu [data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('lang', btn.dataset.lang);
      showToast(t('header.langChanged'), 'success');
      setTimeout(() => window.location.reload(), 500);
    });
  });

  // Mobile more menu — currency options
  document.querySelectorAll('#mobile-more-menu [data-curr]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('currency', btn.dataset.curr);
      showToast(`${t('header.currencyChanged')} ${btn.dataset.curr}`, 'success');
      setTimeout(() => window.location.reload(), 500);
    });
  });

  // Mobile more menu — login
  document.getElementById('mobile-login-btn')?.addEventListener('click', () => {
    document.getElementById('mobile-more-menu')?.classList.remove('open');
    const hash = '#seller-login';
    window.location.hash = hash;
  });

  // checkout actions — navigate to dedicated checkout page
  document.getElementById('cart-drawer-checkout')?.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      showToast(t('header.cartCheckoutEmpty'), 'error');
      return;
    }
    // Close cart drawer and navigate to checkout page
    closeCart();
    setTimeout(() => {
      window.location.hash = '#checkout';
    }, 320);
  });
}

/**
 * 🔴 Update cart badge count on header and bottom nav
 */
export function updateCartBadge() {
  const badge = document.getElementById('cart-badge-count');
  const badgeMobile = document.getElementById('cart-badge-count-mobile');
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!Array.isArray(cart)) cart = [];
  } catch (e) {
    cart = [];
  }
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
}

/**
 * 🛒 Render Shopping Cart Drawer items dynamically
 */
export function renderCartDrawerItems() {
  const container = document.getElementById('cart-drawer-items');
  const totalEl = document.getElementById('cart-drawer-total');
  if (!container || !totalEl) return;

  updateCartBadge();

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!Array.isArray(cart)) cart = [];
  } catch (e) {
    cart = [];
    localStorage.setItem('cart', '[]');
  }

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 20px; padding-top: 60px;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--surface-container-high); display: flex; align-items: center; justify-content: center;">
          <span class="material-symbols-outlined" style="font-size: 40px; color: var(--outline);">shopping_bag</span>
        </div>
        <div style="text-align: center;">
          <p style="font-weight: 600; font-size: 16px; color: var(--on-surface); margin-bottom: 4px;">${t('header.cartEmpty')}</p>
          <p style="font-size: 13px; color: var(--on-surface-variant);">Agrega productos para empezar</p>
        </div>
      </div>
    `;
    totalEl.textContent = formatPrice(0);
    return;
  }

  // Group by seller
  const groups = {};
  cart.forEach((item, index) => {
    const uid = item.vendedorUid || 'unknown';
    if (!groups[uid]) groups[uid] = { vendedorNombre: item.vendedorNombre || 'Vendedor', items: [] };
    groups[uid].items.push({ ...item, localIdx: index });
  });

  const catEmoji = { cacao: '🍫', cafe: '☕', banano: '🍌' };
  let subtotal = 0;
  container.innerHTML = Object.entries(groups).map(([uid, group]) => {
    const sellerTotal = group.items.reduce((s, i) => s + (i.price * i.quantity), 0);
    return `
      <div style="margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
          <span style="font-weight: 700; font-size: 13px; color: var(--on-surface);">${group.vendedorNombre}</span>
          <span style="font-size: 11px; font-weight: 500; color: var(--on-surface-variant);">· ${group.items.reduce((s, i) => s + i.quantity, 0)} ${t('orders.items')}</span>
        </div>
        ${group.items.map((item, gIdx) => {
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;
          return `
            <div style="display: flex; align-items: center; gap: 12px; background: var(--surface-container); padding: 12px; border-radius: var(--radius-lg); margin-bottom: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
              <div style="width: 48px; height: 48px; border-radius: var(--radius-lg); background: var(--surface-container-highest); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;">
                ${item.image
                  ? `<img src="${item.image}" style="width: 100%; height: 100%; object-fit: cover;" />`
                  : `<span style="font-size: 24px;">${catEmoji[item.categoria] || '📦'}</span>`
                }
              </div>
              <div style="flex: 1; min-width: 0;">
                <p style="font-weight: 700; font-size: 13px; color: var(--on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</p>
                <p style="font-size: 12px; font-weight: 600; color: var(--secondary); margin-top: 2px;">${formatPrice(item.price)} ${t('header.perUnit')}</p>
              </div>
              <div style="display: flex; align-items: center; gap: 6px; background: var(--surface-container-highest); padding: 2px; border-radius: var(--radius-full);">
                <button class="cart-qty-btn-minus" data-idx="${item.localIdx}" style="width: 26px; height: 26px; border-radius: 50%; background: transparent; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; cursor: pointer; color: var(--on-surface); border: none; transition: background 0.15s;">−</button>
                <span style="font-size: 13px; font-weight: 700; min-width: 16px; text-align: center; color: var(--on-surface);">${item.quantity}</span>
                <button class="cart-qty-btn-plus" data-idx="${item.localIdx}" style="width: 26px; height: 26px; border-radius: 50%; background: transparent; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; cursor: pointer; color: var(--on-surface); border: none; transition: background 0.15s;">+</button>
              </div>
              <button class="cart-delete-btn" data-idx="${item.localIdx}" style="color: var(--error); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; background: transparent; border: none; transition: background 0.15s; flex-shrink: 0;">
                <span class="material-symbols-outlined" style="font-size: 18px;">delete</span>
              </button>
            </div>
          `;
        }).join('')}
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
      showToast(t('header.cartDeleted'), 'success');
    });
  });
}
