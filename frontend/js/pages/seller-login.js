/**
 * 🔐 KANKU — Seller Login / Register Page
 * Firebase Auth with email & password
 */
import { loginUser, registerUser, createVendedor } from '../firebase.js';

export function renderSellerLogin() {
  return `
    <div class="page-content" style="min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: 20px;">
      <!-- Ambient blobs -->
      <div class="ambient-blob ambient-blob--gold" style="top: 10%; left: -5%; width: 300px; height: 300px;"></div>
      <div class="ambient-blob ambient-blob--green" style="bottom: 10%; right: -5%; width: 350px; height: 350px;"></div>

      <div style="width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 32px; position: relative; z-index: 1;">

        <!-- Brand -->
        <div style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px;">
          <div style="width: 72px; height: 72px; border-radius: 50%; background: var(--secondary-container); display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 36px;">🌿</span>
          </div>
          <h1 class="headline-lg" style="color: var(--secondary);">KANKU</h1>
          <p class="body-md" style="color: var(--on-surface-variant);">${t('seller.login.title')}</p>
        </div>

        <!-- Login/Register Card -->
        <div class="card" style="padding: 32px; display: flex; flex-direction: column; gap: 24px;">
          
          <!-- Tab Toggle -->
          <div style="display: flex; border-radius: var(--radius-xl); overflow: hidden; background: var(--surface-container-highest); padding: 4px;">
            <button id="tab-login" class="auth-tab active" style="flex: 1; padding: 10px; border-radius: var(--radius-lg); font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s ease; border: none;">
              ${t('seller.login.login')}
            </button>
            <button id="tab-register" class="auth-tab" style="flex: 1; padding: 10px; border-radius: var(--radius-lg); font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s ease; border: none;">
              ${t('seller.login.register')}
            </button>
          </div>

          <!-- Login Form -->
          <form id="login-form" style="display: flex; flex-direction: column; gap: 18px;">
            <div class="form-field">
              <label class="form-field__label" for="login-email">${t('seller.login.email')}</label>
              <input type="text" id="login-email" class="form-field__input" placeholder="tu@correo.com o usuario admin" required
                style="border: 1px solid var(--outline-variant); padding: 12px 16px; border-radius: var(--radius-lg);" />
            </div>
            <div class="form-field">
              <label class="form-field__label" for="login-password">${t('seller.login.password')}</label>
              <input type="password" id="login-password" class="form-field__input" placeholder="••••••••" required
                style="border: 1px solid var(--outline-variant); padding: 12px 16px; border-radius: var(--radius-lg);" />
            </div>
            <button type="submit" class="btn btn-primary btn-full" style="padding: 16px; border-radius: var(--radius-xl);">
              <span class="material-symbols-outlined" style="font-size: 18px;">login</span>
              ${t('seller.login.enter')}
            </button>
          </form>

          <!-- Register Form (Hidden by default) -->
          <form id="register-form" style="display: none; flex-direction: column; gap: 18px;">
            <div class="form-field">
              <label class="form-field__label" for="reg-brand">${t('seller.login.brandName')}</label>
              <input type="text" id="reg-brand" class="form-field__input" placeholder="Ej: Finca El Mirador" required
                style="border: 1px solid var(--outline-variant); padding: 12px 16px; border-radius: var(--radius-lg);" />
            </div>
            <div class="form-field">
              <label class="form-field__label" for="reg-email">${t('seller.login.email')}</label>
              <input type="email" id="reg-email" class="form-field__input" placeholder="tu@correo.com" required
                style="border: 1px solid var(--outline-variant); padding: 12px 16px; border-radius: var(--radius-lg);" />
            </div>
            <div class="form-field">
              <label class="form-field__label" for="reg-password">${t('seller.login.password')} (mín. 6 caracteres)</label>
              <input type="password" id="reg-password" class="form-field__input" placeholder="••••••••" required minlength="6"
                style="border: 1px solid var(--outline-variant); padding: 12px 16px; border-radius: var(--radius-lg);" />
            </div>
            <div class="form-field">
              <label class="form-field__label">${t('seller.login.whatProducts')}</label>
              <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 6px;">
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
                  <input type="checkbox" name="categoria" value="cacao" checked style="accent-color: var(--secondary);"> 🍫 Cacao
                </label>
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
                  <input type="checkbox" name="categoria" value="cafe"> ☕ Café
                </label>
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">
                  <input type="checkbox" name="categoria" value="banano"> 🍌 Banano
                </label>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-full" style="padding: 16px; border-radius: var(--radius-xl);">
              <span class="material-symbols-outlined" style="font-size: 18px;">person_add</span>
              ${t('seller.login.createAccount')}
            </button>
          </form>

          <!-- Error/Status Display -->
          <div id="auth-status" style="display: none; padding: 12px 16px; border-radius: var(--radius-lg); font-size: 13px; font-weight: 600; text-align: center;"></div>
        </div>

        <!-- Back link -->
        <div style="text-align: center;">
          <a data-nav="home" style="cursor: pointer; color: var(--on-surface-variant); font-size: 14px; display: inline-flex; align-items: center; gap: 6px; text-decoration: underline;">
            <span class="material-symbols-outlined" style="font-size: 16px;">arrow_back</span>
            ${t('seller.login.back')}
          </a>
        </div>
      </div>
    </div>
  `;
}

export function initSellerLogin() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const statusEl = document.getElementById('auth-status');

  // Tab switching
  tabLogin?.addEventListener('click', () => {
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    tabLogin.style.background = 'var(--background)';
    tabLogin.style.boxShadow = 'var(--shadow-sm)';
    tabRegister.style.background = 'transparent';
    tabRegister.style.boxShadow = 'none';
    hideStatus();
  });

  tabRegister?.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    tabRegister.style.background = 'var(--background)';
    tabRegister.style.boxShadow = 'var(--shadow-sm)';
    tabLogin.style.background = 'transparent';
    tabLogin.style.boxShadow = 'none';
    hideStatus();
  });

  // Initialize active tab style
  tabLogin.style.background = 'var(--background)';
  tabLogin.style.boxShadow = 'var(--shadow-sm)';

  // Login submit
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    let email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Si el usuario ingresa 'admin', autocompletar con el correo del administrador
    if (email.trim().toLowerCase() === 'admin') {
      email = 'admin@kanku.com';
    }
    
    showStatus(t('seller.login.signingIn'), 'info');

    try {
      await loginUser(email, password);
      localStorage.setItem('kanku_role', 'seller');
      showStatus(t('seller.login.welcome'), 'success');
      setTimeout(() => {
        window.location.hash = '#/seller';
        window.location.reload();
      }, 800);
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential' ? t('seller.login.invalidCredentials')
        : err.code === 'auth/user-not-found' ? t('seller.login.userNotFound')
        : err.code === 'auth/wrong-password' ? t('seller.login.wrongPassword')
        : err.code === 'auth/too-many-requests' ? t('seller.login.tooManyRequests')
        : `Error: ${err.message}`;
      showStatus(msg, 'error');
    }
  });

  // Register submit
  registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const brand = document.getElementById('reg-brand').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const categorias = Array.from(document.querySelectorAll('input[name="categoria"]:checked'))
      .map(cb => cb.value);

    if (categorias.length === 0) {
      showStatus(t('seller.login.selectCategory'), 'error');
      return;
    }

    showStatus(t('seller.login.creating'), 'info');

    try {
      const cred = await registerUser(email, password);
      await createVendedor(cred.user.uid, {
        email,
        nombreMarca: brand,
        logo: '',
        descripcion: '',
        ubicacion: 'Sierra Nevada, Magdalena',
        categorias,
      });
      localStorage.setItem('kanku_role', 'seller');
      showStatus(t('seller.login.accountCreated'), 'success');
      setTimeout(() => {
        window.location.hash = '#/seller';
        window.location.reload();
      }, 800);
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use' ? t('seller.login.emailInUse')
        : err.code === 'auth/weak-password' ? t('seller.login.weakPassword')
        : `Error: ${err.message}`;
      showStatus(msg, 'error');
    }
  });

  function showStatus(msg, type) {
    if (!statusEl) return;
    statusEl.style.display = 'block';
    statusEl.textContent = msg;
    statusEl.style.background = type === 'error' ? 'var(--error-container)' 
      : type === 'success' ? 'var(--tertiary-container)' 
      : 'var(--surface-container-highest)';
    statusEl.style.color = type === 'error' ? 'var(--on-error-container)' 
      : type === 'success' ? 'var(--on-tertiary-container)' 
      : 'var(--on-surface)';
  }

  function hideStatus() {
    if (statusEl) statusEl.style.display = 'none';
  }
}
