/**
 * 🏪 KANKU — Store Detail Page
 * Shows a single seller's profile, catalog, and 3D models
 */
import { formatPrice } from '../api.js';
import { getVendedor, getProductosByVendedor, getReviewsForProducts } from '../firebase.js';
import { updateCartBadge } from '../components/header.js';
import { openProductModal } from '../components/product-modal.js';

export function renderStoreDetail() {
  return `
    <div class="page-content" style="position: relative;">
      <div class="ambient-blob ambient-blob--gold" style="top: 15%; right: -5%; width: 250px; height: 250px;"></div>

      <main class="container" style="padding-top: 0; padding-bottom: 80px; display: flex; flex-direction: column; gap: 32px;">

        <!-- Back button -->
        <div style="padding-top: 20px;">
          <button class="btn btn-secondary" data-nav="stores" style="padding: 8px 16px; border-radius: var(--radius-xl); font-size: 13px;">
            <span class="material-symbols-outlined" style="font-size: 16px;">arrow_back</span>
            ${t('stores.backToStores')}
          </button>
        </div>

        <!-- Store Banner (placeholder until loaded) -->
        <div id="store-banner" style="border-radius: var(--radius-xl); overflow: hidden; background: linear-gradient(135deg, var(--secondary), var(--tertiary)); min-height: 200px; display: flex; align-items: center; justify-content: center;">
          <div class="spinner" style="border-top-color: white;"></div>
        </div>

        <!-- Products Section -->
        <section>
          <h2 class="headline-md" style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-outlined" style="font-size: 22px; color: var(--secondary);">inventory_2</span>
            ${t('stores.products')}
          </h2>
          <div id="store-products-grid" class="catalog-grid">
            <div style="text-align: center; padding: 40px 20px; grid-column: 1 / -1;">
              <div class="spinner" style="margin: 0 auto 12px;"></div>
              <p class="body-md" style="color: var(--on-surface-variant);">${t('product.loading')}</p>
            </div>
          </div>
        </section>

        <!-- 3D Models Section -->
        <section id="store-models-section" style="display: none;">
          <h2 class="headline-md" style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span class="material-symbols-outlined" style="font-size: 22px; color: var(--tertiary);">view_in_ar</span>
            ${t('stores.models3d')}
          </h2>
          <div id="store-models-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px;">
          </div>
        </section>

      </main>
    </div>
  `;
}

export async function initStoreDetail() {
  // Parse UID from hash
  const hash = window.location.hash;
  const match = hash.match(/uid=([^&]+)/);
  if (!match) {
    window.location.hash = '#stores';
    return;
  }
  const uid = match[1];

  // Load vendor data
  let vendedor = null;
  try {
    vendedor = await getVendedor(uid);
  } catch (e) {
    console.error('Error loading vendor:', e);
  }

  const banner = document.getElementById('store-banner');
  if (!vendedor) {
    if (banner) {
      banner.innerHTML = `
        <div style="text-align: center; padding: 40px; color: white;">
          <span class="material-symbols-outlined" style="font-size: 48px; opacity: 0.7;">error</span>
          <p style="font-size: 16px; margin-top: 12px;">${t('stores.notFound')}</p>
        </div>
      `;
    }
    return;
  }

  // Render banner
  if (banner) {
    banner.innerHTML = `
      <div style="position: relative; width: 100%;">
        <!-- Gradient Background -->
        <div style="background: linear-gradient(135deg, #3E2723 0%, #5D4037 50%, var(--secondary) 100%); padding: 40px 32px; display: flex; align-items: center; gap: 24px; flex-wrap: wrap;">
          <!-- Logo -->
          <div style="width: 96px; height: 96px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.3); background: var(--surface-container); display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0;">
            ${vendedor.imagenUrl
              ? `<img src="${vendedor.imagenUrl}" alt="${vendedor.nombreMarca}" style="width: 100%; height: 100%; object-fit: cover;" />`
              : `<span class="material-symbols-outlined" style="font-size: 44px; color: var(--secondary);">storefront</span>`
            }
          </div>
          <!-- Info -->
          <div style="flex: 1; min-width: 200px;">
            <h1 style="color: #F5C518; font-size: 28px; font-weight: 800; margin: 0 0 8px; font-family: 'Inter', sans-serif;">${vendedor.nombreMarca || 'Tienda'}</h1>
            ${vendedor.ubicacion ? `
              <p style="color: rgba(255,255,255,0.85); font-size: 14px; display: flex; align-items: center; gap: 6px; margin: 0 0 12px;">
                <span class="material-symbols-outlined" style="font-size: 16px;">location_on</span>
                ${vendedor.ubicacion}
              </p>
            ` : ''}
            ${vendedor.descripcion ? `<p style="color: rgba(255,255,255,0.75); font-size: 13px; line-height: 1.6; margin: 0; max-width: 500px;">${vendedor.descripcion}</p>` : ''}
            ${vendedor.categorias?.length ? `
              <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;">
                ${vendedor.categorias.map(c => {
                  const emoji = { cacao: '🍫', cafe: '☕', banano: '🍌' }[c] || '📦';
                  return `<span style="background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); color: white; padding: 5px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600;">${emoji} ${c.charAt(0).toUpperCase() + c.slice(1)}</span>`;
                }).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // Load products
  let products = [];
  try {
    const result = await getProductosByVendedor(uid);
    products = result.data || [];
  } catch (e) {
    console.warn('Error loading products:', e);
  }

  const grid = document.getElementById('store-products-grid');
  if (grid) {
    if (products.length === 0) {
      grid.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; grid-column: 1 / -1;">
          <span class="material-symbols-outlined" style="font-size: 48px; color: var(--outline);">inventory_2</span>
          <p class="body-md" style="color: var(--on-surface-variant); margin-top: 12px;">${t('stores.noProducts')}</p>
        </div>
      `;
    } else {
      // Fetch reviews
      let reviews = {};
      try {
        const ids = products.map(p => p.id).filter(Boolean);
        reviews = await getReviewsForProducts(ids);
      } catch (e) { reviews = {}; }

      const catEmoji = { cacao: '🍫', cafe: '☕', banano: '🍌' };

      function renderStars(avg) {
        const full = Math.round(avg);
        return [1,2,3,4,5].map(i =>
          `<span style="font-size: 14px; color: ${i <= full ? 'var(--secondary)' : 'var(--outline-variant)'};">★</span>`
        ).join('');
      }

      grid.innerHTML = products.map((product, idx) => {
        const ratings = reviews[product.id];
        const avg = ratings?.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
        const count = ratings?.length || 0;

        return `
          <div class="catalog-card animate-fade-in-up stagger-${(idx % 5) + 1}" data-product-id="${product.id}">
            <div class="catalog-card__image-wrap">
              ${product.imagenUrl
                ? `<img src="${product.imagenUrl}" alt="${product.nombre}" class="catalog-card__image" />`
                : `<div class="catalog-card__image catalog-card__image--placeholder"><span>${catEmoji[product.categoria] || '📦'}</span></div>`
              }
              <span class="catalog-card__badge">${catEmoji[product.categoria] || ''} ${(product.categoria || '').toUpperCase()}</span>
            </div>
            <div style="padding: 18px; display: flex; flex-direction: column; gap: 8px; flex: 1;">
              <h4 style="font-weight: 700; font-size: 16px; color: var(--on-surface);">${product.nombre}</h4>
              ${count > 0 ? `<div style="display: flex; align-items: center; gap: 6px;">${renderStars(avg)} <span style="font-size: 11px; color: var(--on-surface-variant);">${avg.toFixed(1)} (${count})</span></div>` : ''}
              <p style="font-size: 13px; color: var(--on-surface-variant); flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${product.descripcion || ''}</p>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 12px; border-top: 1px solid var(--outline-variant);">
                <span style="font-family: 'Inter', sans-serif; font-size: 22px; font-weight: 700; color: var(--secondary);">${formatPrice(product.precio || 0)}</span>
                <button class="btn btn-primary store-add-cart" data-product-id="${product.id}" style="padding: 8px 16px; font-size: 11px; border-radius: var(--radius-lg);">
                  <span class="material-symbols-outlined" style="font-size: 16px;">add_shopping_cart</span>
                  ${t('product.add')}
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Add to cart
      grid.querySelectorAll('.store-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const product = products.find(p => p.id === btn.dataset.productId);
          if (!product) return;

          const cart = JSON.parse(localStorage.getItem('cart') || '[]');
          const idx = cart.findIndex(item => item.id === product.id);
          if (idx > -1) {
            cart[idx].quantity++;
          } else {
            cart.push({
              id: product.id,
              name: product.nombre,
              price: product.precio || 0,
              quantity: 1,
              image: product.imagenUrl || '',
              categoria: product.categoria,
              vendedorUid: product.vendedorUid,
              vendedorNombre: product.vendedorNombre || vendedor.nombreMarca || '',
            });
          }
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCartBadge();
          window.__components?.showToast?.(t('product.added'), 'success');
        });
      });

      // Product card click → modal
      grid.querySelectorAll('.catalog-card[data-product-id]').forEach(card => {
        card.addEventListener('click', () => {
          const product = products.find(p => p.id === card.dataset.productId);
          if (product) openProductModal(product, reviews);
        });
      });
    }
  }
}
