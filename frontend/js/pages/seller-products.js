/**
 * 📦 KANKU — Seller Products Management
 * CRUD for products (Cacao, Café, Banano)
 */
import { getCurrentUser, getProductosByVendedor, createProducto, updateProducto, deleteProducto, uploadPhoto } from '../firebase.js';
import { formatPrice } from '../api.js';

export function renderSellerProducts() {
  return `
    <div class="seller-content">
      <div class="container" style="padding: 32px 24px; display: flex; flex-direction: column; gap: 28px; max-width: 1100px;">

        <section style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 class="headline-lg" style="color: var(--on-background);">${t('seller.products.title')}</h2>
            <p class="body-md" style="color: var(--on-surface-variant); margin-top: 4px;">${t('seller.products.subtitle')}</p>
          </div>
          <button class="btn btn-primary" style="padding: 10px 18px; font-size: 11px; border-radius: var(--radius-xl);" id="btn-add-product">
            <span class="material-symbols-outlined" style="font-size: 18px;">add</span>
            ${t('seller.products.add')}
          </button>
        </section>

        <!-- Category Filter -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="product-filter active" data-filter="all" style="padding: 8px 18px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid var(--outline-variant); background: var(--secondary-container); color: var(--on-secondary-container);">
            ${t('seller.products.filterAll')}
          </button>
          <button class="product-filter" data-filter="cacao" style="padding: 8px 18px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface);">
            🍫 Cacao
          </button>
          <button class="product-filter" data-filter="cafe" style="padding: 8px 18px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface);">
            ☕ Café
          </button>
          <button class="product-filter" data-filter="banano" style="padding: 8px 18px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid var(--outline-variant); background: var(--surface-container); color: var(--on-surface);">
            🍌 Banano
          </button>
        </div>

        <!-- Products Grid -->
        <div id="seller-products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
          <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
            <div class="spinner" style="margin: 0 auto 16px;"></div>
            <p class="body-md" style="color: var(--on-surface-variant);">${t('seller.products.loading')}</p>
          </div>
        </div>

        <!-- Add/Edit Product Modal -->
        <div id="product-modal-backdrop" style="position: fixed; inset: 0; background: rgba(15,12,8,0.5); backdrop-filter: blur(4px); z-index: 10000; display: none; align-items: center; justify-content: center; padding: 20px;">
          <div id="product-modal" style="background: var(--background); border-radius: var(--radius-2xl); padding: 32px; max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-xl); animation: fadeInScale 0.3s ease;">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
              <h3 class="headline-md" id="modal-title">${t('seller.products.newTitle')}</h3>
              <button id="modal-close" style="cursor: pointer; color: var(--on-surface-variant); background: none; border: none;">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <form id="product-form" style="display: flex; flex-direction: column; gap: 18px;">
              <input type="hidden" id="product-edit-id" value="" />

              <div class="form-field">
                <label class="form-field__label" for="product-name">${t('seller.products.name')}</label>
                <input type="text" id="product-name" class="form-field__input" placeholder="Ej: Cacao Orgánico 70%" required
                  style="border: 1px solid var(--outline-variant); padding: 12px 16px; border-radius: var(--radius-lg);" />
              </div>

              <div class="form-field">
                <label class="form-field__label" for="product-desc">${t('seller.products.description')}</label>
                <textarea id="product-desc" class="form-field__input" placeholder="Describe tu producto..." rows="3"
                  style="border: 1px solid var(--outline-variant); padding: 12px 16px; border-radius: var(--radius-lg); resize: vertical;"></textarea>
              </div>

              <div class="form-field">
                <label class="form-field__label" for="product-category">${t('seller.products.category')}</label>
                <select id="product-category" class="form-field__select" required
                  style="border: 1px solid var(--outline-variant); padding: 12px 16px; border-radius: var(--radius-lg); height: 48px;">
                  <option value="">${t('seller.products.selectCategory')}</option>
                  <option value="cacao">🍫 Cacao</option>
                  <option value="cafe">☕ Café</option>
                  <option value="banano">🍌 Banano</option>
                </select>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="form-field">
                  <label class="form-field__label" for="product-price">${t('seller.products.price')}</label>
                  <input type="number" id="product-price" class="form-field__input" placeholder="0.00" step="0.01" min="0" required
                    style="border: 1px solid var(--outline-variant); padding: 12px 16px; border-radius: var(--radius-lg);" />
                </div>
                <div class="form-field">
                  <label class="form-field__label" for="product-stock">${t('seller.products.stockLabel')}</label>
                  <input type="number" id="product-stock" class="form-field__input" placeholder="0" min="0" required
                    style="border: 1px solid var(--outline-variant); padding: 12px 16px; border-radius: var(--radius-lg);" />
                </div>
              </div>

              <div class="form-field">
                <label class="form-field__label" for="product-weight">${t('seller.products.weight')}</label>
                <input type="number" id="product-weight" class="form-field__input" placeholder="1.0" step="0.1" min="0"
                  style="border: 1px solid var(--outline-variant); padding: 12px 16px; border-radius: var(--radius-lg);" />
              </div>

              <div class="form-field">
                <label class="form-field__label">${t('seller.products.image')}</label>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <label style="display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: var(--radius-lg); background: var(--surface-container-highest); cursor: pointer; font-size: 13px; font-weight: 600;">
                    <span class="material-symbols-outlined" style="font-size: 18px;">upload</span>
                    ${t('seller.products.uploadImage')}
                    <input type="file" id="product-image" accept="image/*" style="display: none;" />
                  </label>
                  <span id="product-image-name" style="font-size: 12px; color: var(--on-surface-variant);">${t('seller.products.noFile')}</span>
                </div>
                <img id="product-image-preview" style="display: none; margin-top: 8px; max-width: 200px; border-radius: var(--radius-lg);" />
              </div>

              <button type="submit" class="btn btn-primary btn-full" style="padding: 16px; border-radius: var(--radius-xl); margin-top: 8px;" id="product-submit-btn">
                <span class="material-symbols-outlined" style="font-size: 18px;">save</span>
                ${t('seller.products.save')}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  `;
}

let currentFilter = 'all';
let allProducts = [];
let lastVisibleProduct = null;
let hasMoreProducts = true;

export async function initSellerProducts() {
  const user = getCurrentUser();
  if (!user) return;

  // Load products
  allProducts = [];
  lastVisibleProduct = null;
  hasMoreProducts = true;
  await loadProducts(user.uid);

  // Add product button
  document.getElementById('btn-add-product')?.addEventListener('click', () => openModal());

  // Modal close
  document.getElementById('modal-close')?.addEventListener('click', closeModal);
  document.getElementById('product-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'product-modal-backdrop') closeModal();
  });

  // Image preview
  document.getElementById('product-image')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      document.getElementById('product-image-name').textContent = file.name;
      const preview = document.getElementById('product-image-preview');
      preview.src = URL.createObjectURL(file);
      preview.style.display = 'block';
    }
  });

  // Product form submit
  document.getElementById('product-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveProduct(user.uid);
  });

  // Category filters
  document.querySelectorAll('.product-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.product-filter').forEach(b => {
        b.style.background = 'var(--surface-container)';
        b.style.color = 'var(--on-surface)';
        b.classList.remove('active');
      });
      btn.style.background = 'var(--secondary-container)';
      btn.style.color = 'var(--on-secondary-container)';
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderProductsGrid();
    });
  });
}

async function loadProducts(uid, loadMore = false) {
  if (!hasMoreProducts && loadMore) return;
  
  try {
    const btnLoadMore = document.getElementById('btn-load-more-products');
    if (btnLoadMore) {
      btnLoadMore.disabled = true;
      btnLoadMore.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span>';
    }

    const { data, lastVisible } = await getProductosByVendedor(uid, 10, lastVisibleProduct);
    
    if (data.length < 10) {
      hasMoreProducts = false;
    }
    
    lastVisibleProduct = lastVisible;

    if (loadMore) {
      allProducts = [...allProducts, ...data];
    } else {
      allProducts = data;
    }
    
    renderProductsGrid();
  } catch (e) {
    console.error('Error loading products:', e);
    document.getElementById('seller-products-grid').innerHTML = `
      <div style="text-align: center; padding: 40px; grid-column: 1 / -1;">
        <span class="material-symbols-outlined" style="font-size: 48px; color: var(--error);">error</span>
        <p class="body-md" style="color: var(--error); margin-top: 8px;">${t('seller.products.errorLoading') || 'Error al cargar'}</p>
      </div>
    `;
  }
}

function renderProductsGrid() {
  const grid = document.getElementById('seller-products-grid');
  if (!grid) return;

  const filtered = currentFilter === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.categoria === currentFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; grid-column: 1 / -1;">
        <span class="material-symbols-outlined" style="font-size: 56px; color: var(--outline);">inventory_2</span>
        <p class="body-md" style="color: var(--on-surface-variant); margin-top: 12px;">${t('seller.products.empty')}${currentFilter !== 'all' ? ` ${t('seller.products.emptyCategory')}` : ''}</p>
        <button class="btn btn-secondary" style="margin-top: 16px; padding: 10px 20px; font-size: 12px;" id="btn-add-empty">
          <span class="material-symbols-outlined" style="font-size: 18px;">add</span>
          ${t('seller.products.addFirst')}
        </button>
      </div>
    `;
    document.getElementById('btn-add-empty')?.addEventListener('click', () => openModal());
    return;
  }

  const catEmoji = { cacao: '🍫', cafe: '☕', banano: '🍌' };

  grid.innerHTML = filtered.map(product => `
    <div class="card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
      <div style="width: 100%; height: 180px; background: var(--surface-container-low); display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
        ${product.imagenUrl 
          ? `<img src="${product.imagenUrl}" alt="${product.nombre}" style="width: 100%; height: 100%; object-fit: cover;" />`
          : `<span style="font-size: 64px;">${catEmoji[product.categoria] || '📦'}</span>`
        }
        <span style="position: absolute; top: 8px; right: 8px; background: var(--surface); padding: 4px 10px; border-radius: var(--radius-full); font-size: 11px; font-weight: 700; border: 1px solid var(--outline-variant);">
          ${catEmoji[product.categoria] || ''} ${product.categoria?.toUpperCase() || 'N/A'}
        </span>
        ${product.activo === false ? `<span style="position: absolute; top: 8px; left: 8px; background: var(--error-container); color: var(--on-error-container); padding: 4px 10px; border-radius: var(--radius-full); font-size: 10px; font-weight: 700;">${t('seller.products.inactive')}</span>` : ''}
      </div>
      <div style="padding: 16px; display: flex; flex-direction: column; gap: 8px; flex: 1;">
        <h4 style="font-weight: 700; font-size: 15px; color: var(--on-surface);">${product.nombre}</h4>
        <p style="font-size: 12px; color: var(--on-surface-variant); flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${product.descripcion || t('seller.products.noDescription')}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
          <span style="font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 700; color: var(--secondary);">${formatPrice(product.precio || 0)}</span>
          <span style="font-size: 12px; color: var(--on-surface-variant);">${t('seller.products.stock')}: ${product.stock ?? 0}</span>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button class="btn btn-secondary btn-edit-product" data-id="${product.id}" style="flex: 1; padding: 8px; font-size: 11px; border-radius: var(--radius-lg);">
            <span class="material-symbols-outlined" style="font-size: 16px;">edit</span> ${t('seller.products.edit')}
          </button>
          <button class="btn btn-delete-product" data-id="${product.id}" style="padding: 8px 14px; font-size: 11px; border-radius: var(--radius-lg); color: var(--error); border: 1px solid var(--error);">
            <span class="material-symbols-outlined" style="font-size: 16px;">delete</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (hasMoreProducts) {
    grid.innerHTML += `
      <div style="grid-column: 1 / -1; display: flex; justify-content: center; margin-top: 20px;">
        <button id="btn-load-more-products" class="btn btn-secondary" style="padding: 10px 24px; border-radius: var(--radius-xl);">
          Cargar más
        </button>
      </div>
    `;
    
    document.getElementById('btn-load-more-products')?.addEventListener('click', () => {
      const user = getCurrentUser();
      if (user) loadProducts(user.uid, true);
    });
  }

  // Attach edit listeners
  grid.querySelectorAll('.btn-edit-product').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = allProducts.find(p => p.id === btn.dataset.id);
      if (product) openModal(product);
    });
  });

  // Attach delete listeners
  grid.querySelectorAll('.btn-delete-product').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm(t('seller.products.confirmDelete'))) {
        try {
          await deleteProducto(btn.dataset.id);
          allProducts = allProducts.filter(p => p.id !== btn.dataset.id);
          renderProductsGrid();
          window.__components?.showToast?.(t('seller.products.deleted'), 'success');
        } catch (e) {
          window.__components?.showToast?.(t('seller.products.error'), 'error');
        }
      }
    });
  });
}

function openModal(product = null) {
  const backdrop = document.getElementById('product-modal-backdrop');
  const title = document.getElementById('modal-title');
  const editId = document.getElementById('product-edit-id');
  
  if (backdrop) backdrop.style.display = 'flex';
  
  if (product) {
    title.textContent = t('seller.products.editTitle');
    editId.value = product.id;
    document.getElementById('product-name').value = product.nombre || '';
    document.getElementById('product-desc').value = product.descripcion || '';
    document.getElementById('product-category').value = product.categoria || '';
    document.getElementById('product-price').value = product.precio || '';
    document.getElementById('product-stock').value = product.stock || '';
    document.getElementById('product-weight').value = product.peso || '';
    if (product.imagenUrl) {
      const preview = document.getElementById('product-image-preview');
      preview.src = product.imagenUrl;
      preview.style.display = 'block';
    }
  } else {
    title.textContent = t('seller.products.newTitle');
    editId.value = '';
    document.getElementById('product-form').reset();
    document.getElementById('product-image-preview').style.display = 'none';
    document.getElementById('product-image-name').textContent = t('seller.products.noFile');
  }
}

function closeModal() {
  const backdrop = document.getElementById('product-modal-backdrop');
  if (backdrop) backdrop.style.display = 'none';
}

async function saveProduct(uid) {
  const submitBtn = document.getElementById('product-submit-btn');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span class="spinner" style="width: 18px; height: 18px; border-width: 2px;"></span> ${t('seller.products.saving')}`;

  try {
    const editId = document.getElementById('product-edit-id').value;
    const imageFile = document.getElementById('product-image').files[0];
    
    let imagenUrl = '';
    if (imageFile) {
      const path = `productos/${uid}/${Date.now()}_${imageFile.name}`;
      imagenUrl = await uploadPhoto(imageFile, path);
    }

    const data = {
      vendedorUid: uid,
      nombre: document.getElementById('product-name').value,
      descripcion: document.getElementById('product-desc').value,
      categoria: document.getElementById('product-category').value,
      precio: parseFloat(document.getElementById('product-price').value) || 0,
      stock: parseInt(document.getElementById('product-stock').value) || 0,
      peso: parseFloat(document.getElementById('product-weight').value) || 0,
    };

    if (imagenUrl) data.imagenUrl = imagenUrl;

    if (editId) {
      await updateProducto(editId, data);
      window.__components?.showToast?.(t('seller.products.updated'), 'success');
    } else {
      await createProducto(data);
      window.__components?.showToast?.(t('seller.products.saved'), 'success');
    }

    closeModal();
    // Reload from scratch to reflect changes properly
    allProducts = [];
    lastVisibleProduct = null;
    hasMoreProducts = true;
    await loadProducts(uid);
  } catch (e) {
    console.error('Error saving product:', e);
    window.__components?.showToast?.(t('seller.products.error') + ': ' + e.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size: 18px;">save</span> ${t('seller.products.save')}`;
  }
}
