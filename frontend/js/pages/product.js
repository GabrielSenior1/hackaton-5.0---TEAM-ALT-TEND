/**
 * 🛒 KANKU — Product Catalog (Multi-product from Firestore)
 * Shows all products from all sellers with category filtering
 */
import { formatPrice } from '../api.js';
import { getAllProductos, getVendedor } from '../firebase.js';
import { updateCartBadge } from '../components/header.js';

export function renderProduct() {
  return `
    <div class="page-content" style="position: relative;">
      <!-- Ambient Background -->
      <div class="ambient-blob ambient-blob--gold" style="top: 20%; left: -5%; width: 300px; height: 300px;"></div>
      <div class="ambient-blob ambient-blob--green" style="bottom: 15%; right: -5%; width: 350px; height: 350px;"></div>

      <!-- Compact Hero Banner -->
      <section class="container" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; padding-top: 24px; padding-bottom: 20px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 28px;">🌿</span>
          <h1 class="headline-lg gold-gradient-text" style="margin: 0;">KANKU</h1>
        </div>
        <p class="body-md" style="color: var(--on-surface-variant); max-width: 480px; font-size: 14px;">
          Marketplace de la Sierra Nevada. Cacao, Café y Banano directo del productor a tu mesa.
        </p>
        <p class="label-sm" style="color: var(--secondary); letter-spacing: 0.15em;">${t('home.hero.honor')}</p>
      </section>

      <main class="container" style="padding-bottom: 60px; display: flex; flex-direction: column; gap: 32px;">

        <!-- Amazon-style Search Bar -->
        <section style="display: flex; max-width: 720px; margin: 0 auto; width: 100%; box-shadow: var(--shadow-sm); border-radius: var(--radius-xl); overflow: hidden;">
          <select id="search-category" style="font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; padding: 0 14px; border: 1.5px solid var(--outline-variant); border-right: none; border-radius: 0; background: var(--surface-container-highest); color: var(--on-surface); cursor: pointer; outline: none; min-width: 130px; appearance: auto;">
            <option value="all">🌿 Todos los productos</option>
            <option value="cacao">🍫 Cacao</option>
            <option value="cafe">☕ Café</option>
            <option value="banano">🍌 Banano</option>
          </select>
          <input type="text" id="search-input" placeholder="Buscar productos…" style="font-family: 'Inter', sans-serif; font-size: 14px; padding: 12px 16px; border: 1.5px solid var(--outline-variant); border-left: none; border-right: none; outline: none; flex: 1; background: var(--surface-container-low); color: var(--on-surface);">
          <button id="search-btn" style="font-family: 'Inter', sans-serif; background: var(--secondary); color: var(--on-secondary); border: 1.5px solid var(--secondary); padding: 0 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s ease;">
            <span class="material-symbols-outlined" style="font-size: 22px;">search</span>
          </button>
        </section>

        <!-- Products Grid -->
        <section id="catalog-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px;">
          <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
            <div class="spinner" style="margin: 0 auto 16px;"></div>
            <p class="body-md" style="color: var(--on-surface-variant);">${t('product.loading')}</p>
          </div>
        </section>

        <!-- CTA Buttons -->
        <section style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; padding-top: 16px;">
          <button class="btn btn-primary" style="padding: 18px 36px; border-radius: 9999px;" data-nav="scanner">
            <span class="material-symbols-outlined filled">qr_code_scanner</span>
            <span>${t('home.cta.scan')}</span>
          </button>
          <button class="btn btn-secondary" style="padding: 18px 36px; border-radius: 9999px;" data-nav="seller-login">
            <span class="material-symbols-outlined">storefront</span>
            <span>${t('home.cta.seller')}</span>
          </button>
        </section>

        <!-- Features -->
        <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; padding-bottom: 40px;">
          <div class="card animate-fade-in-up stagger-1" style="text-align: center; opacity: 0; cursor: pointer;" data-nav="traceability">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--tertiary-container); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <span class="material-symbols-outlined filled" style="color: var(--on-tertiary-container); font-size: 28px;">verified_user</span>
            </div>
            <h3 class="headline-md" style="margin-bottom: 8px;">${t('home.feature.traceability')}</h3>
            <p class="body-md" style="color: var(--on-surface-variant);">${t('home.feature.traceabilityDesc')}</p>
          </div>

          <div class="card animate-fade-in-up stagger-2" style="text-align: center; opacity: 0; cursor: pointer;" data-nav="story">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--secondary-container); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <span class="material-symbols-outlined filled" style="color: var(--on-secondary-container); font-size: 28px;">groups</span>
            </div>
            <h3 class="headline-md" style="margin-bottom: 8px;">${t('home.feature.community')}</h3>
            <p class="body-md" style="color: var(--on-surface-variant);">${t('home.feature.communityDesc')}</p>
          </div>

          <div class="card animate-fade-in-up stagger-3" style="text-align: center; opacity: 0; cursor: pointer;" data-nav="model3d">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--primary-fixed); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <span class="material-symbols-outlined filled" style="color: var(--on-primary-fixed-variant); font-size: 28px;">view_in_ar</span>
            </div>
            <h3 class="headline-md" style="margin-bottom: 8px;">${t('home.feature.model3d')}</h3>
            <p class="body-md" style="color: var(--on-surface-variant);">${t('home.feature.model3dDesc')}</p>
          </div>
        </section>

      </main>
    </div>
  `;
}

let catalogProducts = [];
let catalogCategory = 'all';
let catalogSearchText = '';
let vendedorCache = {};

export async function initProduct() {
  // Load all products from Firestore
  try {
    catalogProducts = await getAllProductos();
  } catch (e) {
    console.warn('Error loading products from Firestore, using demo data:', e);
    catalogProducts = getDemoProducts();
  }

  // If no products in Firestore, show demo
  if (catalogProducts.length === 0) {
    catalogProducts = getDemoProducts();
  }

  renderCatalog();

  // Search bar logic
  const searchSelect = document.getElementById('search-category');
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  function doSearch() {
    catalogCategory = searchSelect.value;
    catalogSearchText = searchInput.value.trim().toLowerCase();
    renderCatalog();
  }

  // Update placeholder when category changes
  searchSelect.addEventListener('change', () => {
    const labels = { all: 'Buscar productos…', cacao: 'Buscar en Cacao…', cafe: 'Buscar en Café…', banano: 'Buscar en Banano…' };
    searchInput.placeholder = labels[searchSelect.value] || 'Buscar productos…';
    doSearch();
  });

  searchBtn.addEventListener('click', doSearch);
  searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
}

async function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  let filtered = catalogCategory === 'all'
    ? catalogProducts
    : catalogProducts.filter(p => p.categoria === catalogCategory);

  if (catalogSearchText) {
    filtered = filtered.filter(p =>
      (p.nombre || '').toLowerCase().includes(catalogSearchText) ||
      (p.descripcion || '').toLowerCase().includes(catalogSearchText)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
        <span class="material-symbols-outlined" style="font-size: 56px; color: var(--outline);">shopping_bag</span>
        <p class="body-md" style="color: var(--on-surface-variant); margin-top: 12px;">${t('product.empty')}</p>
      </div>
    `;
    return;
  }

  const catEmoji = { cacao: '🍫', cafe: '☕', banano: '🍌' };

  grid.innerHTML = filtered.map((product, idx) => `
    <div class="card animate-fade-in-up stagger-${(idx % 5) + 1}" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; opacity: 0; cursor: pointer;">
      <div style="width: 100%; height: 200px; background: var(--surface-container-low); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
        ${product.imagenUrl
          ? `<img src="${product.imagenUrl}" alt="${product.nombre}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" />`
          : `<span style="font-size: 72px;">${catEmoji[product.categoria] || '📦'}</span>`
        }
        <span style="position: absolute; top: 10px; left: 10px; background: rgba(255,248,245,0.92); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; color: var(--on-surface); border: 0.5px solid var(--outline-variant);">
          ${catEmoji[product.categoria] || ''} ${(product.categoria || '').toUpperCase()}
        </span>
      </div>
      <div style="padding: 18px; display: flex; flex-direction: column; gap: 8px; flex: 1;">
        <h4 style="font-weight: 700; font-size: 16px; color: var(--on-surface);">${product.nombre}</h4>
        <p style="font-size: 13px; color: var(--on-surface-variant); flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${product.descripcion || ''}</p>
        ${product.vendedorNombre ? `<p style="font-size: 11px; color: var(--secondary); font-weight: 600; display: flex; align-items: center; gap: 4px;"><span class="material-symbols-outlined" style="font-size: 14px;">storefront</span> ${product.vendedorNombre}</p>` : ''}
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 12px; border-top: 1px solid var(--outline-variant);">
          <span style="font-family: 'Inter', sans-serif; font-size: 22px; font-weight: 700; color: var(--secondary);">${formatPrice(product.precio || 0)}</span>
          <button class="btn btn-primary catalog-add-cart" data-product-id="${product.id}" style="padding: 8px 16px; font-size: 11px; border-radius: var(--radius-lg);">
            <span class="material-symbols-outlined" style="font-size: 16px;">add_shopping_cart</span>
            ${t('product.add')}
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Add to cart listeners
  grid.querySelectorAll('.catalog-add-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const product = catalogProducts.find(p => p.id === btn.dataset.productId);
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
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartBadge();
      window.__components?.showToast?.(t('product.added'), 'success');
    });
  });
}

function getDemoProducts() {
  return [
    {
      id: 'demo-cacao-1',
      nombre: 'Cacao Orgánico 70% — Sierra Nevada',
      descripcion: 'Barra de chocolate fino de aroma, cultivado a 1,200 m.s.n.m. Notas de fruta roja y nuez. Certificación Fairtrade.',
      categoria: 'cacao',
      precio: 14.00,
      stock: 50,
      imagenUrl: '',
      vendedorNombre: 'Finca El Mirador',
      activo: true,
    },
    {
      id: 'demo-cacao-2',
      nombre: 'Cacao en Polvo Premium',
      descripcion: '100% cacao natural sin azúcar. Ideal para repostería y bebidas. Procesado artesanalmente.',
      categoria: 'cacao',
      precio: 8.50,
      stock: 100,
      imagenUrl: '',
      vendedorNombre: 'Kankuamo Cacao',
      activo: true,
    },
    {
      id: 'demo-cafe-1',
      nombre: 'Café Arábica de Altura',
      descripcion: 'Granos selectos cultivados a 1,800 m.s.n.m. Tostado medio con notas de caramelo y cítricos.',
      categoria: 'cafe',
      precio: 12.00,
      stock: 75,
      imagenUrl: '',
      vendedorNombre: 'Sierra Coffee Co.',
      activo: true,
    },
    {
      id: 'demo-cafe-2',
      nombre: 'Café Molido Especial',
      descripcion: 'Blend exclusivo de la Sierra Nevada. Perfil de sabor suave con cuerpo medio.',
      categoria: 'cafe',
      precio: 10.00,
      stock: 60,
      imagenUrl: '',
      vendedorNombre: 'Café Kankuamo',
      activo: true,
    },
    {
      id: 'demo-banano-1',
      nombre: 'Banano Orgánico — Caja 12kg',
      descripcion: 'Banano premium orgánico certificado. Cultivado sin pesticidas en las fértiles tierras del Magdalena.',
      categoria: 'banano',
      precio: 18.00,
      stock: 30,
      imagenUrl: '',
      vendedorNombre: 'BanaMag Export',
      activo: true,
    },
    {
      id: 'demo-banano-2',
      nombre: 'Chips de Banano Artesanal',
      descripcion: 'Snack saludable deshidratado al sol. Sin conservantes ni azúcar añadida.',
      categoria: 'banano',
      precio: 5.50,
      stock: 200,
      imagenUrl: '',
      vendedorNombre: 'Sierra Snacks',
      activo: true,
    },
  ];
}
