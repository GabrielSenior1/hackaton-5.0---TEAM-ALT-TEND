/**
 * 🛒 KANKU — Product Catalog (Multi-product from Firestore)
 * Shows all products from all sellers with category filtering
 */
import { formatPrice } from '../api.js';
import { getAllProductos, getVendedor } from '../firebase.js';

export function renderProduct() {
  return `
    <div class="page-content">
      <main class="container" style="padding-top: 40px; padding-bottom: 60px; display: flex; flex-direction: column; gap: 32px;">
        
        <!-- Header -->
        <section style="text-align: center; display: flex; flex-direction: column; gap: 12px; align-items: center;">
          <p class="label-sm" style="color: var(--secondary); letter-spacing: 0.15em;">MARKETPLACE</p>
          <h1 class="headline-xl" style="color: var(--on-background);">Tienda KANKU</h1>
          <p class="body-lg" style="color: var(--on-surface-variant); max-width: 520px;">
            Cacao, Café y Banano de la Sierra Nevada — directo del productor
          </p>
        </section>

        <!-- Category Filter -->
        <section style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
          <button class="catalog-filter active" data-filter="all" style="padding: 10px 24px; border-radius: var(--radius-full); font-size: 14px; font-weight: 600; cursor: pointer; border: 1px solid var(--outline-variant); background: var(--secondary-container); color: var(--on-secondary-container); transition: all 0.2s ease;">
            🌿 Todos
          </button>
          <button class="catalog-filter" data-filter="cacao" style="padding: 10px 24px; border-radius: var(--radius-full); font-size: 14px; font-weight: 600; cursor: pointer; border: 1px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface); transition: all 0.2s ease;">
            🍫 Cacao
          </button>
          <button class="catalog-filter" data-filter="cafe" style="padding: 10px 24px; border-radius: var(--radius-full); font-size: 14px; font-weight: 600; cursor: pointer; border: 1px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface); transition: all 0.2s ease;">
            ☕ Café
          </button>
          <button class="catalog-filter" data-filter="banano" style="padding: 10px 24px; border-radius: var(--radius-full); font-size: 14px; font-weight: 600; cursor: pointer; border: 1px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface); transition: all 0.2s ease;">
            🍌 Banano
          </button>
        </section>

        <!-- Products Grid -->
        <section id="catalog-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px;">
          <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
            <div class="spinner" style="margin: 0 auto 16px;"></div>
            <p class="body-md" style="color: var(--on-surface-variant);">Cargando productos...</p>
          </div>
        </section>

      </main>
    </div>
  `;
}

let catalogProducts = [];
let catalogFilter = 'all';
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

  // Category filters
  document.querySelectorAll('.catalog-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.catalog-filter').forEach(b => {
        b.style.background = 'var(--surface-container)';
        b.style.color = 'var(--on-surface)';
        b.classList.remove('active');
      });
      btn.style.background = 'var(--secondary-container)';
      btn.style.color = 'var(--on-secondary-container)';
      btn.classList.add('active');
      catalogFilter = btn.dataset.filter;
      renderCatalog();
    });
  });
}

async function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  const filtered = catalogFilter === 'all'
    ? catalogProducts
    : catalogProducts.filter(p => p.categoria === catalogFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
        <span class="material-symbols-outlined" style="font-size: 56px; color: var(--outline);">shopping_bag</span>
        <p class="body-md" style="color: var(--on-surface-variant); margin-top: 12px;">No hay productos en esta categoría</p>
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
          <span style="font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--secondary);">${formatPrice(product.precio || 0)}</span>
          <button class="btn btn-primary catalog-add-cart" data-product-id="${product.id}" style="padding: 8px 16px; font-size: 11px; border-radius: var(--radius-lg);">
            <span class="material-symbols-outlined" style="font-size: 16px;">add_shopping_cart</span>
            Agregar
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
      window.__components?.showToast?.('¡Producto añadido al carrito!', 'success');

      // Update cart drawer
      import('../components/header.js').then(module => {
        module.renderCartDrawerItems();
      });
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
