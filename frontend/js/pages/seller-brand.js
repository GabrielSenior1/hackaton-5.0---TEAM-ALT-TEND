/**
 * 🏷️ KANKU — Seller Brand Configuration
 * Manage brand identity: name, logo, description, categories
 */
import { getCurrentUser, getVendedor, updateVendedor, uploadPhoto } from '../firebase.js';

export function renderSellerBrand() {
  return `
    <div class="seller-content">
      <div class="container" style="padding: 32px 24px; display: flex; flex-direction: column; gap: 28px; max-width: 800px;">

        <section>
          <h2 class="headline-lg" style="color: var(--on-background);">${t('seller.brand.title')}</h2>
          <p class="body-md" style="color: var(--on-surface-variant); margin-top: 4px;">${t('seller.brand.subtitle')}</p>
        </section>

        <!-- Brand Form -->
        <form id="brand-form" style="display: flex; flex-direction: column; gap: 24px;">

          <!-- Logo Upload -->
          <div class="card" style="display: flex; align-items: center; gap: 24px; padding: 24px; flex-wrap: wrap;">
            <div id="brand-logo-container" style="width: 100px; height: 100px; border-radius: 50%; background: var(--surface-container-highest); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
              <img id="brand-logo-preview" src="" style="width: 100%; height: 100%; object-fit: cover; display: none;" />
              <span id="brand-logo-placeholder" class="material-symbols-outlined" style="font-size: 40px; color: var(--outline);">storefront</span>
            </div>
            <div style="flex: 1; min-width: 200px;">
              <h4 style="font-weight: 700; margin-bottom: 8px;">${t('seller.brand.logoTitle')}</h4>
              <p style="font-size: 13px; color: var(--on-surface-variant); margin-bottom: 12px;">${t('seller.brand.logoDesc')}</p>
              <label style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: var(--radius-lg); background: var(--surface-container-highest); cursor: pointer; font-size: 13px; font-weight: 600;">
                <span class="material-symbols-outlined" style="font-size: 18px;">upload</span>
                ${t('seller.brand.changeLogo')}
                <input type="file" id="brand-logo-input" accept="image/*" style="display: none;" />
              </label>
            </div>
          </div>

          <!-- Brand Name -->
          <div class="form-field">
            <label class="form-field__label" for="brand-name">${t('seller.brand.name')}</label>
            <input type="text" id="brand-name" class="form-field__input" placeholder="${t('seller.brand.placeholderName')}" required
              style="border: 1px solid var(--outline-variant); padding: 14px 16px; border-radius: var(--radius-lg); font-size: 16px;" />
          </div>

          <!-- Description -->
          <div class="form-field">
            <label class="form-field__label" for="brand-desc">${t('seller.brand.description')}</label>
            <textarea id="brand-desc" class="form-field__input" placeholder="${t('seller.brand.placeholderDesc')}" rows="4"
              style="border: 1px solid var(--outline-variant); padding: 14px 16px; border-radius: var(--radius-lg); resize: vertical;"></textarea>
          </div>

          <!-- Location -->
          <div class="form-field">
            <label class="form-field__label" for="brand-location">${t('seller.brand.location')}</label>
            <input type="text" id="brand-location" class="form-field__input" placeholder="${t('seller.brand.placeholderLocation')}"
              style="border: 1px solid var(--outline-variant); padding: 14px 16px; border-radius: var(--radius-lg);" />
          </div>

          <!-- Categories -->
          <div class="form-field">
            <label class="form-field__label">${t('seller.brand.categories')}</label>
            <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-top: 8px;">
              <label class="category-check" style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 12px 20px; border-radius: var(--radius-xl); border: 1px solid var(--outline-variant); background: var(--surface-container); transition: all 0.2s ease; font-weight: 600;">
                <input type="checkbox" name="brand-cat" value="cacao" style="accent-color: var(--secondary); width: 18px; height: 18px;" /> 
                <span style="font-size: 20px;">🍫</span> Cacao
              </label>
              <label class="category-check" style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 12px 20px; border-radius: var(--radius-xl); border: 1px solid var(--outline-variant); background: var(--surface-container); transition: all 0.2s ease; font-weight: 600;">
                <input type="checkbox" name="brand-cat" value="cafe" style="accent-color: var(--secondary); width: 18px; height: 18px;" /> 
                <span style="font-size: 20px;">☕</span> Café
              </label>
              <label class="category-check" style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 12px 20px; border-radius: var(--radius-xl); border: 1px solid var(--outline-variant); background: var(--surface-container); transition: all 0.2s ease; font-weight: 600;">
                <input type="checkbox" name="brand-cat" value="banano" style="accent-color: var(--secondary); width: 18px; height: 18px;" /> 
                <span style="font-size: 20px;">🍌</span> Banano
              </label>
            </div>
          </div>

          <!-- Save Button -->
          <button type="submit" class="btn btn-primary btn-full" style="padding: 18px; border-radius: var(--radius-xl);" id="brand-save-btn">
            <span class="material-symbols-outlined" style="font-size: 18px;">save</span>
            ${t('seller.brand.save')}
          </button>

          <!-- Status -->
          <div id="brand-status" style="display: none; padding: 12px 16px; border-radius: var(--radius-lg); font-size: 13px; font-weight: 600; text-align: center;"></div>
        </form>

      </div>
    </div>
  `;
}

export async function initSellerBrand() {
  const user = getCurrentUser();
  if (!user) return;

  // Load existing data
  try {
    const vendedor = await getVendedor(user.uid);
    if (vendedor) {
      document.getElementById('brand-name').value = vendedor.nombreMarca || '';
      document.getElementById('brand-desc').value = vendedor.descripcion || '';
      document.getElementById('brand-location').value = vendedor.ubicacion || '';

      // Set logo
      if (vendedor.logo) {
        const preview = document.getElementById('brand-logo-preview');
        const placeholder = document.getElementById('brand-logo-placeholder');
        preview.src = vendedor.logo;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
      }

      // Set categories
      const cats = vendedor.categorias || [];
      document.querySelectorAll('input[name="brand-cat"]').forEach(cb => {
        cb.checked = cats.includes(cb.value);
      });
    }
  } catch (e) {
    console.warn('Error loading brand:', e);
  }

  // Logo preview
  document.getElementById('brand-logo-input')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = document.getElementById('brand-logo-preview');
      const placeholder = document.getElementById('brand-logo-placeholder');
      preview.src = URL.createObjectURL(file);
      preview.style.display = 'block';
      placeholder.style.display = 'none';
    }
  });

  // Save form
  document.getElementById('brand-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('brand-save-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<span class="spinner" style="width: 18px; height: 18px; border-width: 2px;"></span> ${t('seller.brand.saving')}`;

    try {
      const data = {
        nombreMarca: document.getElementById('brand-name').value,
        descripcion: document.getElementById('brand-desc').value,
        ubicacion: document.getElementById('brand-location').value,
        categorias: Array.from(document.querySelectorAll('input[name="brand-cat"]:checked')).map(cb => cb.value),
      };

      // Upload logo if changed
      const logoFile = document.getElementById('brand-logo-input').files[0];
      if (logoFile) {
        const logoUrl = await uploadPhoto(logoFile, `logos/${user.uid}/${Date.now()}_logo`);
        data.logo = logoUrl;
      }

      await updateVendedor(user.uid, data);

      const statusEl = document.getElementById('brand-status');
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.textContent = `✅ ${t('seller.brand.saved')}`;
        statusEl.style.background = 'var(--tertiary-container)';
        statusEl.style.color = 'var(--on-tertiary-container)';
        setTimeout(() => statusEl.style.display = 'none', 3000);
      }

      window.__components?.showToast?.(t('seller.brand.saved'), 'success');
    } catch (e) {
      console.error('Error saving brand:', e);
      window.__components?.showToast?.(t('seller.brand.error') + ': ' + e.message, 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size: 18px;">save</span> ${t('seller.brand.save')}`;
    }
  });
}
