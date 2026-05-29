import { formatPrice } from '../api.js';
import { updateCartBadge, showToast } from './header.js';

let reviewsMap = {};
let modalQuantity = 1;

export function openProductModal(product, reviews) {
  reviewsMap = reviews || {};
  modalQuantity = 1;
  const existing = document.getElementById('product-modal-backdrop');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'product-modal-backdrop';
  backdrop.className = 'product-modal-backdrop';
  backdrop.innerHTML = buildModalContent(product);
  document.body.appendChild(backdrop);

  requestAnimationFrame(() => backdrop.classList.add('open'));
  document.body.style.overflow = 'hidden';

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  const closeEl = backdrop.querySelector('.product-modal__close');
  if (closeEl) closeEl.addEventListener('click', closeModal);

  const qtyEl = backdrop.querySelector('.modal-qty__value');
  const minusBtn = backdrop.querySelector('.modal-qty__minus');
  const plusBtn = backdrop.querySelector('.modal-qty__plus');

  function updateQty() {
    if (qtyEl) qtyEl.textContent = modalQuantity;
    if (minusBtn) minusBtn.disabled = modalQuantity <= 1;
  }

  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      if (modalQuantity > 1) { modalQuantity--; updateQty(); }
    });
  }
  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      modalQuantity++; updateQty();
    });
  }

  const addBtn = backdrop.querySelector('.product-modal-add-cart');
  if (addBtn) {
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(product, modalQuantity);
    });
  }

  document.addEventListener('keydown', onKeyDown);
}

function closeModal() {
  const backdrop = document.getElementById('product-modal-backdrop');
  if (backdrop) {
    backdrop.classList.remove('open');
    setTimeout(() => backdrop.remove(), 400);
  }
  document.body.style.overflow = '';
}

function onKeyDown(e) {
  if (e.key === 'Escape') closeModal();
}

function buildModalContent(product) {
  const catEmoji = { cacao: '🍫', cafe: '☕', banano: '🍌' };
  const emoji = catEmoji[product.categoria] || '📦';
  const stars = renderStarsHtml(product);

  return `
    <div class="product-modal">
      <div class="product-modal__image">
        ${product.imagenUrl
          ? `<img src="${product.imagenUrl}" alt="${product.nombre}" />`
          : `<span class="product-modal__emoji">${emoji}</span>`
        }
        <span class="product-modal__category">${emoji} ${(product.categoria || '').toUpperCase()}</span>
        <button class="product-modal__close">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="product-modal__body">
        <h2 class="product-modal__name">${product.nombre}</h2>

        <div class="product-modal__price-row">
          <span class="product-modal__price">${formatPrice(product.precio || 0)}</span>
          <span class="product-modal__stock">
            <span class="material-symbols-outlined">inventory_2</span>
            ${product.stock || 0} ${t('product.detail.stock')}
          </span>
        </div>

        <div class="product-modal__meta">
          ${product.vendedorNombre ? `
            <span class="product-modal__meta-item">
              <span class="material-symbols-outlined">storefront</span>
              ${t('product.detail.seller')}: ${product.vendedorNombre}
            </span>
          ` : ''}
          <span class="product-modal__meta-item">
            <span class="material-symbols-outlined">sell</span>
            ${t('product.detail.category')}: ${product.categoria || ''}
          </span>
        </div>

        <p class="product-modal__description">${product.descripcion || ''}</p>

        ${stars}
      </div>

      <div class="product-modal__footer">
        <div class="modal-qty">
          <button class="modal-qty__btn modal-qty__minus" type="button">
            <span class="material-symbols-outlined">remove</span>
          </button>
          <span class="modal-qty__value">1</span>
          <button class="modal-qty__btn modal-qty__plus" type="button">
            <span class="material-symbols-outlined">add</span>
          </button>
        </div>
        <button class="btn btn-gold product-modal-add-cart">
          <span class="material-symbols-outlined">add_shopping_cart</span>
          ${t('product.add')}
        </button>
      </div>
    </div>
  `;
}

function renderStarsHtml(product) {
  const ratings = reviewsMap[product.id];
  const avg = ratings?.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  const count = ratings?.length || 0;
  if (count === 0) return '';

  const full = Math.round(avg);
  const stars = [1,2,3,4,5].map(i =>
    `<span class="${i <= full ? 'star-filled' : 'star-empty'}">★</span>`
  ).join('');

  return `
    <div class="product-modal__rating">
      <div class="product-modal__stars">${stars}</div>
      <span class="product-modal__rating-text">${avg.toFixed(1)} (${count} ${count === 1 ? t('review.oneReview') : t('review.nReviews')})</span>
    </div>
  `;
}

function addToCart(product, quantity = 1) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const idx = cart.findIndex(item => item.id === product.id);

  if (idx > -1) {
    cart[idx].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.nombre,
      price: product.precio || 0,
      quantity,
      image: product.imagenUrl || '',
      categoria: product.categoria,
      vendedorUid: product.vendedorUid,
      vendedorNombre: product.vendedorNombre || '',
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
  showToast(t('product.added'), 'success');
}
