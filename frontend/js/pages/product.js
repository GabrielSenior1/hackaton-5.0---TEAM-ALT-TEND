/**
 * 🛒 Product / Checkout Page with Cart and Multi-currency Formatting
 */
import { formatPrice } from '../api.js';

export function renderProduct() {
  const currentPrice = formatPrice(14.00);

  return `
    <div class="page-content">
      <main class="container" style="padding-top: 40px; padding-bottom: 60px;">
        <div class="grid-12" style="align-items: start;">

          <!-- Product Image Side -->
          <div class="col-span-full md-col-7" style="display: flex; justify-content: center;">
            <div style="position: relative; width: 100%; max-width: 640px; background: var(--surface-container-low); border-radius: 1rem; padding: 32px; display: flex; justify-content: center; align-items: center;" class="soft-shadow">
              <img 
                src="https://lh3.googleusercontent.com/aida/ADBb0ugjNoI5u_zEtDksSWoVH0wGdR77Ns4_dIH8foONYcbFtl6g-yvdWb_Ai63AdUNhqxGDn9lyfUoKa6zwmLgwlEzkuxjb6NZkxpI7MpeEmCU7hnwAZlvOHigEp8B--JZbZ0LOuBtzM63_Vr2PCLfj7iKSMDlvi-K2nwFjUBHbUnT2olbLU0rngEWAUUjUxgmE4gRyUPnSc9yL30wWmzMp5KD_a0NE2NNiNttHYh3_7nPkFTUIlNaoLzfs1Q" 
                alt="Cacao de la Sierra Chocolate Bar"
                style="width: 100%; max-height: 600px; object-fit: cover; border-radius: 0.5rem; box-shadow: var(--shadow-sm);"
              />
              <div style="position: absolute; top: 16px; left: 16px; background: var(--surface); color: var(--secondary); padding: 6px 14px; border-radius: var(--radius-sm); border: 0.5px solid var(--secondary); backdrop-filter: blur(8px); background: rgba(255,248,245,0.9);" class="label-sm" style="letter-spacing: 0.15em;">
                LOTE #0492
              </div>
            </div>
          </div>

          <!-- Checkout Side -->
          <div class="col-span-full md-col-5" style="display: flex; flex-direction: column; gap: 32px; padding-left: 0; padding-top: 32px;">

            <div style="display: flex; flex-direction: column; gap: 16px;">
              <h2 class="headline-xl" style="color: var(--on-background); font-family: 'Playfair Display', serif;">Reserva tu Lote</h2>
              <p class="body-md" style="color: var(--on-surface-variant);">
                Reserva para Recogida Local o Envío Internacional. Cada barra es un testimonio de nuestra tierra, cultivada con prácticas sostenibles.
              </p>
            </div>

            <!-- Purchase Card -->
            <div class="card-flat" style="display: flex; flex-direction: column; gap: 24px; padding: 28px;">
              
              <!-- Title & Price -->
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--outline-variant); padding-bottom: 16px;">
                <span class="headline-md">70% Cacao Oscuro</span>
                <span class="headline-lg" id="base-item-price" style="color: var(--secondary); font-family: 'Playfair Display', serif;">${currentPrice}</span>
              </div>

              <!-- Country Selector -->
              <div class="form-field">
                <label class="form-field__label" for="shipping-country">Destino de Envío</label>
                <div style="position: relative;">
                  <select class="form-field__select" id="shipping-country" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg); height: 44px; width: 100%;">
                    <option value="">Selecciona un país...</option>
                    <option value="US">Estados Unidos</option>
                    <option value="ES">España</option>
                    <option value="CO">Colombia</option>
                    <option value="LOCAL">Recogida Local (Finca)</option>
                  </select>
                </div>
                <p class="label-sm" id="shipping-estimate" style="color: var(--primary); text-align: right; margin-top: 4px;">Selecciona un destino</p>
              </div>

              <!-- Quantity -->
              <div class="form-field">
                <label class="form-field__label">Cantidad</label>
                <div style="display: flex; align-items: center; gap: 16px;">
                  <button id="qty-minus" style="width: 40px; height: 40px; border-radius: 50%; background: var(--surface-container-highest); display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--on-surface); transition: all 0.2s ease; cursor: pointer;" onmouseover="this.style.background='var(--secondary-container)'" onmouseout="this.style.background='var(--surface-container-highest)'">−</button>
                  <span id="qty-value" class="headline-md" style="min-width: 40px; text-align: center;">1</span>
                  <button id="qty-plus" style="width: 40px; height: 40px; border-radius: 50%; background: var(--surface-container-highest); display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--on-surface); transition: all 0.2s ease; cursor: pointer;" onmouseover="this.style.background='var(--secondary-container)'" onmouseout="this.style.background='var(--surface-container-highest)'">+</button>
                </div>
              </div>

              <!-- Total -->
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-top: 1px solid var(--outline-variant);">
                <span class="body-lg" style="font-weight: 600;">Total</span>
                <span id="total-price" class="headline-lg" style="color: var(--secondary); font-family: 'Playfair Display', serif;">${currentPrice}</span>
              </div>

              <!-- Buy Button (Add to Cart) -->
              <button class="btn btn-primary btn-full" style="padding: 18px; border-radius: var(--radius-xl); flex-direction: column; gap: 4px;" id="buy-btn">
                <span>AÑADIR AL CARRITO</span>
                <span style="font-size: 10px; opacity: 0.8; text-transform: none; letter-spacing: normal;">Añade este producto a tu pedido</span>
              </button>
            </div>

            <!-- Trust Badges -->
            <div class="trust-badges">
              <div class="trust-badge">
                <span class="material-symbols-outlined">verified_user</span>
                <span class="label-sm" style="color: var(--on-surface-variant); text-align: center; line-height: 1.3;">Pago<br/>Seguro</span>
              </div>
              <div class="trust-badge">
                <span class="material-symbols-outlined">local_shipping</span>
                <span class="label-sm" style="color: var(--on-surface-variant); text-align: center; line-height: 1.3;">Envío<br/>Global</span>
              </div>
              <div class="trust-badge">
                <span class="material-symbols-outlined">eco</span>
                <span class="label-sm" style="color: var(--on-surface-variant); text-align: center; line-height: 1.3;">100%<br/>Sostenible</span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  `;
}

export function initProduct() {
  const PRICE = 14.00;
  let quantity = 1;

  const shippingCosts = {
    'US': { cost: 12, days: '5-7 días' },
    'ES': { cost: 15, days: '7-10 días' },
    'CO': { cost: 5, days: '3-5 días' },
    'LOCAL': { cost: 0, days: 'Disponible inmediatamente' },
  };

  const qtyEl = document.getElementById('qty-value');
  const totalEl = document.getElementById('total-price');
  const estimateEl = document.getElementById('shipping-estimate');

  function updateTotal() {
    const country = document.getElementById('shipping-country')?.value;
    const shipping = shippingCosts[country]?.cost || 0;
    const totalUSD = PRICE * quantity + shipping;
    if (totalEl) totalEl.textContent = formatPrice(totalUSD);
    if (qtyEl) qtyEl.textContent = quantity;
  }

  document.getElementById('qty-minus')?.addEventListener('click', () => {
    if (quantity > 1) { quantity--; updateTotal(); }
  });

  document.getElementById('qty-plus')?.addEventListener('click', () => {
    if (quantity < 50) { quantity++; updateTotal(); }
  });

  document.getElementById('shipping-country')?.addEventListener('change', (e) => {
    const info = shippingCosts[e.target.value];
    if (info && estimateEl) {
      estimateEl.textContent = info.cost > 0 
        ? `Envío: ${formatPrice(info.cost)} — ${info.days}` 
        : `${info.days}`;
      estimateEl.style.color = 'var(--tertiary)';
    } else if (estimateEl) {
      estimateEl.textContent = 'Selecciona un destino';
      estimateEl.style.color = 'var(--primary)';
    }
    updateTotal();
  });

  document.getElementById('buy-btn')?.addEventListener('click', () => {
    const { showToast } = window.__components || {};
    
    // Add item to cart in localStorage safely
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (!Array.isArray(cart)) cart = [];
    } catch (e) {
      cart = [];
    }
    const itemIndex = cart.findIndex(item => item.id === 'bar-70');
    
    if (itemIndex > -1) {
      cart[itemIndex].quantity += quantity;
    } else {
      cart.push({
        id: 'bar-70',
        name: '70% Cacao Oscuro',
        price: 14.00,
        quantity: quantity,
        image: 'https://lh3.googleusercontent.com/aida/ADBb0ugjNoI5u_zEtDksSWoVH0wGdR77Ns4_dIH8foONYcbFtl6g-yvdWb_Ai63AdUNhqxGDn9lyfUoKa6zwmLgwlEzkuxjb6NZkxpI7MpeEmCU7hnwAZlvOHigEp8B--JZbZ0LOuBtzM63_Vr2PCLfj7iKSMDlvi-K2nwFjUBHbUnT2olbLU0rngEWAUUjUxgmE4gRyUPnSc9yL30wWmzMp5KD_a0NE2NNiNttHYh3_7nPkFTUIlNaoLzfs1Q'
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    if (showToast) showToast('¡Producto añadido al carrito!', 'success');
    
    // Import and update cart drawer dynamically
    import('../components/header.js').then(module => {
      module.renderCartDrawerItems();
      
      // Open the cart drawer
      const cartDrawer = document.getElementById('cart-drawer');
      const cartBackdrop = document.getElementById('cart-drawer-backdrop');
      if (cartDrawer && cartBackdrop) {
        cartBackdrop.style.display = 'block';
        setTimeout(() => {
          cartDrawer.style.right = '0';
          cartBackdrop.style.opacity = '1';
        }, 10);
      }
    });
  });
}
