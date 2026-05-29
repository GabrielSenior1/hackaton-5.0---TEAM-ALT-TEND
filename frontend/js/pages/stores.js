/**
 * 🏪 KANKU — Stores / Companies Page
 * Lists all registered sellers/brands from Firestore
 */
import { getAllVendedores } from '../firebase.js';

export function renderStores() {
  return `
    <div class="page-content" style="position: relative;">
      <div class="ambient-blob ambient-blob--gold" style="top: 10%; left: -8%; width: 300px; height: 300px;"></div>
      <div class="ambient-blob ambient-blob--green" style="bottom: 10%; right: -5%; width: 350px; height: 350px;"></div>

      <main class="container" style="padding-top: 32px; padding-bottom: 80px; display: flex; flex-direction: column; gap: 32px;">

        <!-- Header -->
        <section style="text-align: center; display: flex; flex-direction: column; gap: 12px; max-width: 600px; margin: 0 auto;">
          <p class="label-sm" style="color: var(--secondary); letter-spacing: 0.15em;">${t('stores.badge')}</p>
          <h1 class="headline-xl gold-gradient-text">${t('stores.title')}</h1>
          <p class="body-md" style="color: var(--on-surface-variant);">${t('stores.subtitle')}</p>
        </section>

        <!-- Stores Grid -->
        <section id="stores-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
          <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
            <div class="spinner" style="margin: 0 auto 16px;"></div>
            <p class="body-md" style="color: var(--on-surface-variant);">${t('stores.loading')}</p>
          </div>
        </section>

      </main>
    </div>
  `;
}

export async function initStores() {
  let vendedores = [];
  try {
    vendedores = await getAllVendedores();
  } catch (e) {
    console.warn('Error loading vendors:', e);
  }

  const grid = document.getElementById('stores-grid');
  if (!grid) return;

  if (vendedores.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--surface-container-high); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
          <span class="material-symbols-outlined" style="font-size: 40px; color: var(--outline);">store</span>
        </div>
        <p class="headline-md" style="color: var(--on-surface); margin-bottom: 8px;">${t('stores.empty')}</p>
        <p class="body-md" style="color: var(--on-surface-variant);">${t('stores.emptyDesc')}</p>
      </div>
    `;
    return;
  }

  const catEmoji = { cacao: '🍫', cafe: '☕', banano: '🍌' };

  grid.innerHTML = vendedores.map((v, idx) => {
    const cats = (v.categorias || []).map(c => `
      <span style="background: var(--surface-container-highest); padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; color: var(--on-surface-variant); display: flex; align-items: center; gap: 4px;">
        ${catEmoji[c] || '📦'} ${(c || '').charAt(0).toUpperCase() + (c || '').slice(1)}
      </span>
    `).join('');

    return `
      <div class="card animate-fade-in-up stagger-${(idx % 5) + 1}" style="cursor: pointer; overflow: hidden; transition: transform 0.25s ease, box-shadow 0.25s ease; opacity: 0;" data-store-uid="${v.id}" 
        onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px rgba(0,0,0,0.12)'"
        onmouseout="this.style.transform='';this.style.boxShadow=''">
        
        <!-- Banner -->
        <div style="height: 100px; background: linear-gradient(135deg, var(--secondary), var(--tertiary)); position: relative; display: flex; align-items: flex-end; justify-content: center;">
          <div style="width: 72px; height: 72px; border-radius: 50%; border: 3px solid var(--surface); background: var(--surface-container); display: flex; align-items: center; justify-content: center; overflow: hidden; position: absolute; bottom: -36px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            ${v.imagenUrl
              ? `<img src="${v.imagenUrl}" alt="${v.nombreMarca || ''}" style="width: 100%; height: 100%; object-fit: cover;" />`
              : `<span class="material-symbols-outlined" style="font-size: 32px; color: var(--secondary);">storefront</span>`
            }
          </div>
        </div>

        <!-- Content -->
        <div style="padding: 44px 20px 20px; display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center;">
          <h3 style="font-weight: 700; font-size: 17px; color: var(--on-surface);">${v.nombreMarca || v.email || 'Tienda'}</h3>
          ${v.ubicacion ? `
            <p style="font-size: 12px; color: var(--on-surface-variant); display: flex; align-items: center; gap: 4px;">
              <span class="material-symbols-outlined" style="font-size: 14px; color: var(--tertiary);">location_on</span>
              ${v.ubicacion}
            </p>
          ` : ''}
          ${v.descripcion ? `<p style="font-size: 13px; color: var(--on-surface-variant); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${v.descripcion}</p>` : ''}
          ${cats ? `<div style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; margin-top: 4px;">${cats}</div>` : ''}
          <button class="btn btn-secondary" style="margin-top: 8px; padding: 8px 20px; border-radius: 9999px; font-size: 12px; font-weight: 600;">
            <span class="material-symbols-outlined" style="font-size: 16px;">visibility</span>
            ${t('stores.viewStore')}
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Click to navigate to store detail
  grid.querySelectorAll('[data-store-uid]').forEach(card => {
    card.addEventListener('click', () => {
      const uid = card.dataset.storeUid;
      window.location.hash = `#store-detail?uid=${uid}`;
    });
  });
}
