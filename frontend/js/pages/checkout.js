/**
 * 🛒 KANKU — Checkout Avanzado
 * Soporta:
 *   - Compradores Invitados (solo email)
 *   - Compradores Registrados (Firebase Auth)
 *   - Compradores Institucionales / B2B
 *   - Recogida en Origen (Finca/Tienda)
 *   - Envío a Domicilio (con dirección)
 *   - Dispara Firebase Email Trigger Extension
 */

import { api, formatPrice } from '../api.js';
import { getCurrentUser, createPedido, initFirebase, getVendedor, createEmailNotification } from '../firebase.js';
import { updateCartBadge } from '../components/header.js';

// ─── Render ────────────────────────────────────────────────────────────────

export function renderCheckout() {
  return `
    <div class="page-content" style="position: relative; min-height: 80vh;">
      <!-- Ambient blobs -->
      <div class="ambient-blob ambient-blob--gold" style="top: 5%; right: -8%; width: 320px; height: 320px; opacity: 0.4;"></div>
      <div class="ambient-blob ambient-blob--green" style="bottom: 10%; left: -5%; width: 280px; height: 280px; opacity: 0.35;"></div>

      <main class="container" style="padding-top: 36px; padding-bottom: 80px; max-width: 860px;">

        <!-- Header -->
        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 32px;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, var(--secondary), var(--tertiary)); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span class="material-symbols-outlined filled" style="color: white; font-size: 24px;">shopping_cart_checkout</span>
          </div>
          <div>
            <h1 class="headline-lg" style="margin: 0; color: var(--on-background);">Finalizar Compra</h1>
            <p class="body-md" style="color: var(--on-surface-variant); margin-top: 2px;">Elige cómo quieres recibir tu pedido de la Sierra Nevada</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr minmax(280px, 340px); gap: 28px; align-items: start;" id="checkout-layout">

          <!-- Left: Form -->
          <div style="display: flex; flex-direction: column; gap: 24px;">

            <!-- Step 1: Quién eres -->
            <div class="card checkout-step" id="step-identity" style="padding: 24px; animation: fadeInUp 0.4s ease;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                <div class="checkout-step-num">1</div>
                <h2 style="font-size: 17px; font-weight: 700; margin: 0;">Identificación del Comprador</h2>
              </div>

              <!-- Identity Mode Toggle -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                <button id="btn-mode-guest" class="checkout-mode-btn active" onclick="window.__checkout?.setMode('guest')">
                  <span class="material-symbols-outlined" style="font-size: 22px;">person</span>
                  <span style="font-weight: 700; font-size: 13px;">Como Invitado</span>
                  <span style="font-size: 11px; color: inherit; opacity: 0.8;">Solo tu correo</span>
                </button>
                <button id="btn-mode-login" class="checkout-mode-btn" onclick="window.__checkout?.setMode('registered')">
                  <span class="material-symbols-outlined" style="font-size: 22px;">badge</span>
                  <span style="font-weight: 700; font-size: 13px;">Cuenta Registrada</span>
                  <span style="font-size: 11px; color: inherit; opacity: 0.8;">Historial completo</span>
                </button>
              </div>

              <!-- Guest fields -->
              <div id="guest-fields">
                <div style="display: flex; flex-direction: column; gap: 14px;">
                  <div>
                    <label style="font-size: 12px; font-weight: 700; color: var(--on-surface-variant); display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.06em;">
                      📧 Correo Electrónico *
                    </label>
                    <input type="email" id="guest-email" placeholder="tu@correo.com"
                      style="width: 100%; padding: 12px 16px; border: 1.5px solid var(--outline-variant); border-radius: var(--radius-lg); background: var(--surface-container-low); color: var(--on-surface); font-size: 14px; font-family: 'Inter', sans-serif; box-sizing: border-box; transition: border-color 0.2s;"
                      onfocus="this.style.borderColor='var(--secondary)'" onblur="this.style.borderColor='var(--outline-variant)'">
                  </div>
                  <div>
                    <label style="font-size: 12px; font-weight: 700; color: var(--on-surface-variant); display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.06em;">
                      👤 Nombre Completo *
                    </label>
                    <input type="text" id="guest-name" placeholder="Tu nombre completo"
                      style="width: 100%; padding: 12px 16px; border: 1.5px solid var(--outline-variant); border-radius: var(--radius-lg); background: var(--surface-container-low); color: var(--on-surface); font-size: 14px; font-family: 'Inter', sans-serif; box-sizing: border-box; transition: border-color 0.2s;"
                      onfocus="this.style.borderColor='var(--secondary)'" onblur="this.style.borderColor='var(--outline-variant)'">
                  </div>
                  <div>
                    <label style="font-size: 12px; font-weight: 700; color: var(--on-surface-variant); display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.06em;">
                      🏢 Tipo de Comprador
                    </label>
                    <select id="guest-perfil"
                      style="width: 100%; padding: 12px 16px; border: 1.5px solid var(--outline-variant); border-radius: var(--radius-lg); background: var(--surface-container-low); color: var(--on-surface); font-size: 14px; font-family: 'Inter', sans-serif; box-sizing: border-box; cursor: pointer; appearance: auto;">
                      <option value="individual">👤 Individual / Particular</option>
                      <option value="institucional">🏛️ Institucional (Universidad, Empresa, Hotel)</option>
                    </select>
                  </div>
                  <!-- Institutional fields (conditional) -->
                  <div id="institutional-fields" style="display: none; flex-direction: column; gap: 12px; padding: 16px; background: var(--primary-fixed); border-radius: var(--radius-lg); border: 1px solid var(--secondary);">
                    <p style="font-size: 12px; font-weight: 700; color: var(--secondary); margin: 0; display: flex; align-items: center; gap: 6px;">
                      <span class="material-symbols-outlined" style="font-size: 16px;">domain</span>
                      Datos Institucionales (B2B)
                    </p>
                    <input type="text" id="inst-nombre-org" placeholder="Nombre de la organización (ej. Universidad del Magdalena)"
                      style="width: 100%; padding: 11px 14px; border: 1px solid var(--outline-variant); border-radius: var(--radius-lg); background: var(--surface-container-low); color: var(--on-surface); font-size: 13px; font-family: 'Inter', sans-serif; box-sizing: border-box;">
                    <input type="text" id="inst-nit" placeholder="NIT / RUT de la organización"
                      style="width: 100%; padding: 11px 14px; border: 1px solid var(--outline-variant); border-radius: var(--radius-lg); background: var(--surface-container-low); color: var(--on-surface); font-size: 13px; font-family: 'Inter', sans-serif; box-sizing: border-box;">
                    <input type="text" id="inst-cargo" placeholder="Cargo / Rol del solicitante (ej. Jefe de Compras)"
                      style="width: 100%; padding: 11px 14px; border: 1px solid var(--outline-variant); border-radius: var(--radius-lg); background: var(--surface-container-low); color: var(--on-surface); font-size: 13px; font-family: 'Inter', sans-serif; box-sizing: border-box;">
                  </div>
                </div>
              </div>

              <!-- Registered User Info (hidden by default) -->
              <div id="registered-info" style="display: none;">
                <div style="padding: 16px; background: var(--primary-fixed); border-radius: var(--radius-lg); border: 1px solid var(--secondary); display: flex; align-items: center; gap: 14px;">
                  <div style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--secondary), var(--tertiary)); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <span class="material-symbols-outlined" style="color: white; font-size: 22px;">person</span>
                  </div>
                  <div>
                    <p id="reg-user-name" style="font-weight: 700; font-size: 15px; color: var(--on-surface); margin: 0;">Cargando...</p>
                    <p id="reg-user-email" style="font-size: 12px; color: var(--on-surface-variant); margin: 0;"></p>
                    <p style="font-size: 11px; color: var(--secondary); margin: 4px 0 0; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                      <span class="material-symbols-outlined" style="font-size: 14px;">verified</span>Cuenta verificada
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Método de Entrega -->
            <div class="card checkout-step" id="step-delivery" style="padding: 24px; animation: fadeInUp 0.5s ease;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                <div class="checkout-step-num">2</div>
                <h2 style="font-size: 17px; font-weight: 700; margin: 0;">Método de Entrega</h2>
              </div>

              <div style="display: flex; flex-direction: column; gap: 12px;">
                <!-- Option: Pickup -->
                <label id="lbl-pickup" class="delivery-option active" for="delivery-pickup">
                  <input type="radio" name="delivery" id="delivery-pickup" value="recogida" checked style="display:none;">
                  <div style="display: flex; align-items: flex-start; gap: 14px; width: 100%;">
                    <div style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: linear-gradient(135deg, #2E7D32, #66BB6A); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <span class="material-symbols-outlined filled" style="color: white; font-size: 22px;">agriculture</span>
                    </div>
                    <div style="flex: 1;">
                      <p style="font-weight: 700; font-size: 14px; color: var(--on-surface); margin: 0;">Recogida en Origen 🌿</p>
                      <p style="font-size: 12px; color: var(--on-surface-variant); margin: 4px 0 0; line-height: 1.5;">
                        Recoge directamente en la finca o tienda del productor en Minca, Sierra Nevada. <strong style="color: var(--secondary);">¡Sin costo de envío!</strong>
                      </p>
                    </div>
                    <div class="delivery-check" style="width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--secondary); background: var(--secondary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                      <span class="material-symbols-outlined" style="font-size: 14px; color: white;">check</span>
                    </div>
                  </div>
                </label>

                <!-- Pickup details -->
                <div id="pickup-details" style="padding: 14px; background: var(--surface-container-low); border-radius: var(--radius-lg); border: 1px solid var(--outline-variant); margin-top: -4px;">
                  <p style="font-size: 12px; font-weight: 700; color: var(--secondary); margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.05em;">📍 Puntos de Recogida</p>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--on-surface);">
                      <span class="material-symbols-outlined" style="font-size: 16px; color: var(--tertiary);">location_on</span>
                      <span><strong>Minca, Sierra Nevada</strong> — Tienda principal Kanku</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--on-surface);">
                      <span class="material-symbols-outlined" style="font-size: 16px; color: var(--tertiary);">schedule</span>
                      <span>Lun – Sáb, 7:00 AM – 5:00 PM</span>
                    </div>
                  </div>
                </div>

                <!-- Option: Shipping -->
                <label id="lbl-shipping" class="delivery-option" for="delivery-shipping">
                  <input type="radio" name="delivery" id="delivery-shipping" value="envio" style="display:none;">
                  <div style="display: flex; align-items: flex-start; gap: 14px; width: 100%;">
                    <div style="width: 44px; height: 44px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--secondary), #FFD54F); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                      <span class="material-symbols-outlined filled" style="color: #1A1A1A; font-size: 22px;">local_shipping</span>
                    </div>
                    <div style="flex: 1;">
                      <p style="font-weight: 700; font-size: 14px; color: var(--on-surface); margin: 0;">Envío a Domicilio 🚚</p>
                      <p style="font-size: 12px; color: var(--on-surface-variant); margin: 4px 0 0; line-height: 1.5;">
                        Entregamos en Santa Marta y municipios del Magdalena. <strong style="color: var(--on-surface-variant);">Costo según distancia.</strong>
                      </p>
                    </div>
                    <div class="delivery-check" style="width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--outline); background: transparent; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;">
                    </div>
                  </div>
                </label>

                <!-- Shipping Address (conditional) -->
                <div id="shipping-address-block" style="display: none; flex-direction: column; gap: 12px; padding: 16px; background: var(--surface-container-low); border-radius: var(--radius-lg); border: 1.5px solid var(--secondary); margin-top: -4px;">
                  <p style="font-size: 12px; font-weight: 700; color: var(--secondary); margin: 0; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px;">
                    <span class="material-symbols-outlined" style="font-size: 16px;">edit_location</span>
                    Dirección de Entrega
                  </p>
                  <input type="text" id="shipping-address" placeholder="Calle / Carrera / Vereda"
                    style="width: 100%; padding: 11px 14px; border: 1px solid var(--outline-variant); border-radius: var(--radius-lg); background: var(--surface-container); color: var(--on-surface); font-size: 14px; font-family: 'Inter', sans-serif; box-sizing: border-box;">
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <input type="text" id="shipping-city" placeholder="Ciudad / Municipio"
                      style="padding: 11px 14px; border: 1px solid var(--outline-variant); border-radius: var(--radius-lg); background: var(--surface-container); color: var(--on-surface); font-size: 14px; font-family: 'Inter', sans-serif;">
                    <input type="text" id="shipping-phone" placeholder="📞 Celular de contacto"
                      style="padding: 11px 14px; border: 1px solid var(--outline-variant); border-radius: var(--radius-lg); background: var(--surface-container); color: var(--on-surface); font-size: 14px; font-family: 'Inter', sans-serif;">
                  </div>
                  <textarea id="shipping-notes" placeholder="Notas adicionales (color de puerta, apartamento, indicaciones especiales...)"
                    style="width: 100%; padding: 11px 14px; border: 1px solid var(--outline-variant); border-radius: var(--radius-lg); background: var(--surface-container); color: var(--on-surface); font-size: 13px; font-family: 'Inter', sans-serif; resize: vertical; min-height: 70px; box-sizing: border-box;"></textarea>
                </div>
              </div>
            </div>

            <!-- Step 3: Confirmación Correo -->
            <div class="card checkout-step" id="step-confirmation" style="padding: 24px; animation: fadeInUp 0.6s ease;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                <div class="checkout-step-num">3</div>
                <h2 style="font-size: 17px; font-weight: 700; margin: 0;">Confirmación por Correo</h2>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 12px; padding: 14px; background: var(--primary-fixed); border-radius: var(--radius-lg); border: 1px solid var(--secondary);">
                <span class="material-symbols-outlined filled" style="color: var(--secondary); font-size: 24px; flex-shrink: 0; margin-top: 2px;">mail</span>
                <div>
                  <p style="font-weight: 700; font-size: 14px; color: var(--on-surface); margin: 0;">Recibe tu recibo y código QR por email</p>
                  <p style="font-size: 12px; color: var(--on-surface-variant); margin: 6px 0 0; line-height: 1.6;">
                    Al completar tu pedido, recibirás automáticamente un correo de confirmación con el <strong>resumen detallado</strong> y un <strong>código QR</strong> para presentar al recoger o para seguimiento.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <!-- Right: Order Summary -->
          <div style="position: sticky; top: 90px;">
            <div class="card" style="padding: 24px; animation: fadeInUp 0.4s ease;">
              <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 18px; display: flex; align-items: center; gap: 8px;">
                <span class="material-symbols-outlined" style="font-size: 20px; color: var(--secondary);">receipt_long</span>
                Resumen del Pedido
              </h3>

              <div id="checkout-order-items" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px;">
                <div style="text-align: center; padding: 20px;">
                  <div class="spinner" style="margin: 0 auto;"></div>
                </div>
              </div>

              <div id="checkout-delivery-info" style="display: none; padding: 10px 14px; background: var(--surface-container-low); border-radius: var(--radius-lg); margin-bottom: 14px; font-size: 12px; color: var(--on-surface-variant);">
              </div>

              <div style="border-top: 1px solid var(--outline-variant); padding-top: 14px; display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--on-surface-variant);">
                  <span>Subtotal</span><span id="checkout-subtotal">$0.00</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--on-surface-variant);">
                  <span id="shipping-cost-label">Envío</span><span id="checkout-shipping-cost" style="color: var(--tertiary); font-weight: 600;">Gratis</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 18px; color: var(--secondary); margin-top: 6px;">
                  <span>Total</span><span id="checkout-total">$0.00</span>
                </div>
              </div>

              <!-- Place Order Button -->
              <button id="btn-place-order" class="btn btn-primary btn-full" style="padding: 16px; border-radius: var(--radius-xl); font-weight: 700; font-size: 15px; position: relative; overflow: hidden;">
                <span id="btn-order-content" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                  <span class="material-symbols-outlined filled" style="font-size: 20px;">lock</span>
                  Confirmar Pedido
                </span>
              </button>

              <p style="text-align: center; font-size: 11px; color: var(--on-surface-variant); margin-top: 12px; display: flex; align-items: center; justify-content: center; gap: 4px;">
                <span class="material-symbols-outlined" style="font-size: 14px; color: var(--tertiary);">verified_user</span>
                Compra segura. Datos protegidos.
              </p>

              <!-- Return to Cart -->
              <button class="btn btn-secondary btn-full" style="margin-top: 8px; padding: 11px; border-radius: var(--radius-xl);" data-nav="product">
                <span class="material-symbols-outlined" style="font-size: 16px;">arrow_back</span>
                Seguir comprando
              </button>
            </div>
          </div>
        </div>

      </main>

      <!-- Success Overlay -->
      <div id="checkout-success-overlay" style="display: none; position: fixed; inset: 0; background: rgba(15,12,8,0.85); backdrop-filter: blur(16px); z-index: 20000; align-items: center; justify-content: center; padding: 24px;">
        <div class="card" style="max-width: 480px; width: 100%; padding: 40px 32px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 20px; animation: fadeInUp 0.5s ease;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--tertiary), #66BB6A); display: flex; align-items: center; justify-content: center;">
            <span class="material-symbols-outlined filled" style="color: white; font-size: 40px;">check_circle</span>
          </div>
          <div>
            <h2 style="font-size: 22px; font-weight: 700; color: var(--on-surface); margin: 0 0 8px;">¡Pedido Confirmado! 🌿</h2>
            <p style="font-size: 14px; color: var(--on-surface-variant); line-height: 1.6;" id="success-message">
              Tu pedido ha sido registrado exitosamente.
            </p>
          </div>
          <div style="background: var(--surface-container-low); padding: 16px 24px; border-radius: var(--radius-xl); border: 1px solid var(--outline-variant); width: 100%; box-sizing: border-box;">
            <p style="font-size: 12px; color: var(--secondary); font-weight: 700; margin: 0 0 4px; display: flex; align-items: center; justify-content: center; gap: 4px;">
              <span class="material-symbols-outlined" style="font-size: 16px;">mail</span>
              CORREO ENVIADO A
            </p>
            <p id="success-email" style="font-size: 14px; font-weight: 600; color: var(--on-surface); margin: 0;"></p>
          </div>
          <p style="font-size: 12px; color: var(--on-surface-variant); margin: 0; line-height: 1.6;">
            📬 Revisa tu bandeja de entrada. Recibirás el <strong>recibo</strong> y tu <strong>código QR</strong> en los próximos minutos.
          </p>
          <button id="btn-success-go-home" class="btn btn-primary" style="padding: 14px 32px; border-radius: 9999px; font-weight: 700;" data-nav="product">
            <span class="material-symbols-outlined" style="font-size: 18px;">storefront</span>
            Seguir Explorando
          </button>
        </div>
      </div>
    </div>
  `;
}

// ─── CSS Injector ───────────────────────────────────────────────────────────
function injectCheckoutStyles() {
  if (document.getElementById('checkout-styles')) return;
  const style = document.createElement('style');
  style.id = 'checkout-styles';
  style.textContent = `
    .checkout-step-num {
      width: 32px; height: 32px; border-radius: 50%;
      background: linear-gradient(135deg, var(--secondary), var(--tertiary));
      color: #1A1A1A; font-weight: 800; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .checkout-mode-btn {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 16px 12px; border-radius: var(--radius-xl);
      border: 2px solid var(--outline-variant);
      background: var(--surface-container-low); cursor: pointer;
      color: var(--on-surface-variant); transition: all 0.25s ease;
    }
    .checkout-mode-btn.active {
      border-color: var(--secondary); background: var(--primary-fixed);
      color: var(--on-surface);
      box-shadow: 0 0 0 3px rgba(var(--secondary-rgb, 180, 120, 0), 0.12);
    }
    .checkout-mode-btn:hover:not(.active) {
      border-color: var(--outline); background: var(--surface-container);
    }
    .delivery-option {
      display: flex; align-items: center; padding: 16px; cursor: pointer;
      border-radius: var(--radius-xl); border: 2px solid var(--outline-variant);
      background: var(--surface-container-low); transition: all 0.25s ease;
    }
    .delivery-option.active {
      border-color: var(--secondary); background: var(--primary-fixed);
      box-shadow: 0 0 0 3px rgba(var(--secondary-rgb, 180, 120, 0), 0.1);
    }
    .delivery-option:hover:not(.active) {
      border-color: var(--outline); background: var(--surface-container);
    }
    .checkout-item-row {
      display: flex; align-items: center; gap: 10px; font-size: 13px;
      padding: 8px 0; border-bottom: 1px solid var(--outline-variant);
    }
    .checkout-item-row:last-child { border-bottom: none; }

    #btn-place-order:disabled {
      opacity: 0.7; cursor: not-allowed;
    }
    #btn-place-order .btn-loading {
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }

    @media (max-width: 700px) {
      #checkout-layout {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(style);
}

// ─── State ──────────────────────────────────────────────────────────────────
let checkoutMode = 'guest'; // 'guest' | 'registered'
let deliveryMethod = 'recogida'; // 'recogida' | 'envio'
let cart = [];

// ─── Init ───────────────────────────────────────────────────────────────────
export async function initCheckout() {
  injectCheckoutStyles();

  // Handle Stripe Success Callback immediately before anything else
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');
  if (sessionId) {
    // Show a loading UI while verifying
    const layout = document.getElementById('checkout-layout');
    if (layout) {
      layout.innerHTML = `
        <div style="grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; background: var(--surface-container-low); border-radius: var(--radius-xl); border: 1px solid var(--outline-variant);">
          <div class="spinner" style="width: 48px; height: 48px; border-width: 4px; border-top-color: var(--secondary); margin-bottom: 24px;"></div>
          <h2 style="font-size: 20px; font-weight: 700; color: var(--secondary); margin: 0 0 8px;">Verificando pago...</h2>
          <p style="font-size: 14px; color: var(--on-surface-variant); margin: 0;">Por favor espera mientras confirmamos tu transacción con Stripe de manera segura.</p>
        </div>
      `;
    }

    // Clear session_id from URL without refreshing
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
    await completePendingOrder(sessionId);
    return; // Stop further init to avoid double events if they click again
  }


  // Load cart
  try {
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (!Array.isArray(cart)) cart = [];
  } catch (e) { cart = []; }

  if (cart.length === 0) {
    // Empty cart → redirect to products
    window.__components?.showToast?.('Tu carrito está vacío', 'error');
    if (typeof navigate === 'function') navigate('product');
    else window.location.hash = '#product';
    return;
  }

  renderOrderSummary();

  // Check if user is already logged in
  const user = getCurrentUser();
  if (user) {
    setMode('registered');
  }



  // Expose checkout controller globally for inline event handlers
  window.__checkout = { setMode, setDelivery };

  // Delivery radio buttons
  document.getElementById('delivery-pickup')?.addEventListener('change', () => setDelivery('recogida'));
  document.getElementById('delivery-shipping')?.addEventListener('change', () => setDelivery('envio'));

  // Click on delivery labels
  document.getElementById('lbl-pickup')?.addEventListener('click', () => {
    document.getElementById('delivery-pickup').checked = true;
    setDelivery('recogida');
  });
  document.getElementById('lbl-shipping')?.addEventListener('click', () => {
    document.getElementById('delivery-shipping').checked = true;
    setDelivery('envio');
  });

  // Institutional profile
  document.getElementById('guest-perfil')?.addEventListener('change', (e) => {
    const instFields = document.getElementById('institutional-fields');
    if (instFields) {
      instFields.style.display = e.target.value === 'institucional' ? 'flex' : 'none';
    }
  });

  // Place order
  document.getElementById('btn-place-order')?.addEventListener('click', handlePlaceOrder);

  // Success overlay close
  document.getElementById('btn-success-go-home')?.addEventListener('click', () => {
    document.getElementById('checkout-success-overlay').style.display = 'none';
    window.location.hash = '#product';
  });
}

function setMode(mode) {
  checkoutMode = mode;
  const guestFields = document.getElementById('guest-fields');
  const registeredInfo = document.getElementById('registered-info');
  const btnGuest = document.getElementById('btn-mode-guest');
  const btnLogin = document.getElementById('btn-mode-login');

  if (mode === 'registered') {
    const user = getCurrentUser();
    if (!user) {
      // Redirect to login then come back
      window.__components?.showToast?.('Inicia sesión para continuar', 'error');
      return;
    }
    if (guestFields) guestFields.style.display = 'none';
    if (registeredInfo) {
      registeredInfo.style.display = 'block';
      document.getElementById('reg-user-name').textContent = user.displayName || user.email;
      document.getElementById('reg-user-email').textContent = user.email;
    }
    if (btnGuest) btnGuest.classList.remove('active');
    if (btnLogin) btnLogin.classList.add('active');
  } else {
    if (guestFields) guestFields.style.display = 'block';
    if (registeredInfo) registeredInfo.style.display = 'none';
    if (btnGuest) btnGuest.classList.add('active');
    if (btnLogin) btnLogin.classList.remove('active');
  }
}

function setDelivery(method) {
  deliveryMethod = method;

  const lblPickup = document.getElementById('lbl-pickup');
  const lblShipping = document.getElementById('lbl-shipping');
  const pickupDetails = document.getElementById('pickup-details');
  const shippingBlock = document.getElementById('shipping-address-block');
  const shippingCost = document.getElementById('checkout-shipping-cost');
  const shippingCostLabel = document.getElementById('shipping-cost-label');
  const deliveryInfoBox = document.getElementById('checkout-delivery-info');

  if (method === 'recogida') {
    lblPickup?.classList.add('active');
    lblShipping?.classList.remove('active');
    if (pickupDetails) pickupDetails.style.display = 'block';
    if (shippingBlock) shippingBlock.style.display = 'none';
    // Update check marks
    updateDeliveryCheckmarks('pickup');
    if (shippingCost) { shippingCost.textContent = 'Gratis'; shippingCost.style.color = 'var(--tertiary)'; }
    if (shippingCostLabel) shippingCostLabel.textContent = 'Recogida';
    if (deliveryInfoBox) {
      deliveryInfoBox.style.display = 'block';
      deliveryInfoBox.innerHTML = '📍 <strong>Recogida en:</strong> Tienda Kanku, Minca, Sierra Nevada de Santa Marta';
    }
  } else {
    lblPickup?.classList.remove('active');
    lblShipping?.classList.add('active');
    if (pickupDetails) pickupDetails.style.display = 'none';
    if (shippingBlock) shippingBlock.style.display = 'flex';
    updateDeliveryCheckmarks('shipping');
    if (shippingCost) { shippingCost.textContent = 'Por definir'; shippingCost.style.color = 'var(--on-surface-variant)'; }
    if (shippingCostLabel) shippingCostLabel.textContent = 'Envío';
    if (deliveryInfoBox) {
      deliveryInfoBox.style.display = 'block';
      deliveryInfoBox.innerHTML = '🚚 <strong>Envío a domicilio</strong> — Ingresa tu dirección de entrega';
    }
  }
}

function updateDeliveryCheckmarks(active) {
  const pickupCheck = document.querySelector('#lbl-pickup .delivery-check');
  const shippingCheck = document.querySelector('#lbl-shipping .delivery-check');
  if (active === 'pickup') {
    if (pickupCheck) {
      pickupCheck.style.background = 'var(--secondary)';
      pickupCheck.style.borderColor = 'var(--secondary)';
      pickupCheck.innerHTML = '<span class="material-symbols-outlined" style="font-size: 14px; color: white;">check</span>';
    }
    if (shippingCheck) {
      shippingCheck.style.background = 'transparent';
      shippingCheck.style.borderColor = 'var(--outline)';
      shippingCheck.innerHTML = '';
    }
  } else {
    if (shippingCheck) {
      shippingCheck.style.background = 'var(--secondary)';
      shippingCheck.style.borderColor = 'var(--secondary)';
      shippingCheck.innerHTML = '<span class="material-symbols-outlined" style="font-size: 14px; color: white;">check</span>';
    }
    if (pickupCheck) {
      pickupCheck.style.background = 'transparent';
      pickupCheck.style.borderColor = 'var(--outline)';
      pickupCheck.innerHTML = '';
    }
  }
}

function renderOrderSummary() {
  const container = document.getElementById('checkout-order-items');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const totalEl = document.getElementById('checkout-total');
  if (!container) return;

  const catEmoji = { cacao: '🍫', cafe: '☕', banano: '🍌' };
  let subtotal = 0;

  container.innerHTML = cart.map(item => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    subtotal += itemTotal;
    return `
      <div class="checkout-item-row">
        <div style="width: 36px; height: 36px; border-radius: var(--radius-lg); background: var(--surface-container-highest); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;">
          ${item.image ? `<img src="${item.image}" style="width: 100%; height: 100%; object-fit: cover;">` : `<span style="font-size: 18px;">${catEmoji[item.categoria] || '📦'}</span>`}
        </div>
        <div style="flex: 1; min-width: 0;">
          <p style="font-weight: 600; font-size: 12px; color: var(--on-surface); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</p>
          <p style="font-size: 11px; color: var(--on-surface-variant); margin: 2px 0 0;">${item.vendedorNombre || ''} × ${item.quantity}</p>
        </div>
        <span style="font-size: 13px; font-weight: 700; color: var(--secondary); flex-shrink: 0;">${formatPrice(itemTotal)}</span>
      </div>
    `;
  }).join('');

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl) totalEl.textContent = formatPrice(subtotal);
}

// ─── Place Order Handler ─────────────────────────────────────────────────────
async function handlePlaceOrder() {
  const btn = document.getElementById('btn-place-order');
  const btnContent = document.getElementById('btn-order-content');

  // Collect buyer info
  let compradorEmail = '';
  let compradorNombre = '';
  let esInvitado = true;
  let compradorUid = null;
  let tipoPerfil = 'individual';
  let datosInstitucionales = null;

  if (checkoutMode === 'registered') {
    const user = getCurrentUser();
    if (!user) {
      window.__components?.showToast?.('Por favor inicia sesión', 'error');
      return;
    }
    compradorEmail = user.email || '';
    compradorNombre = user.displayName || user.email;
    compradorUid = user.uid;
    esInvitado = false;
  } else {
    compradorEmail = document.getElementById('guest-email')?.value?.trim() || '';
    compradorNombre = document.getElementById('guest-name')?.value?.trim() || '';
    tipoPerfil = document.getElementById('guest-perfil')?.value || 'individual';

    if (!compradorEmail || !compradorEmail.includes('@')) {
      window.__components?.showToast?.('Por favor ingresa un correo válido', 'error');
      document.getElementById('guest-email')?.focus();
      return;
    }
    if (!compradorNombre) {
      window.__components?.showToast?.('Por favor ingresa tu nombre', 'error');
      document.getElementById('guest-name')?.focus();
      return;
    }

    // Institutional data
    if (tipoPerfil === 'institucional') {
      datosInstitucionales = {
        nombreOrganizacion: document.getElementById('inst-nombre-org')?.value?.trim() || '',
        nit: document.getElementById('inst-nit')?.value?.trim() || '',
        cargo: document.getElementById('inst-cargo')?.value?.trim() || '',
      };
    }
  }

  // Collect delivery info
  let direccionEntrega = null;
  if (deliveryMethod === 'envio') {
    const address = document.getElementById('shipping-address')?.value?.trim() || '';
    const city = document.getElementById('shipping-city')?.value?.trim() || '';
    const phone = document.getElementById('shipping-phone')?.value?.trim() || '';
    const notes = document.getElementById('shipping-notes')?.value?.trim() || '';

    if (!address || !city) {
      window.__components?.showToast?.('Por favor ingresa la dirección y ciudad de entrega', 'error');
      document.getElementById('shipping-address')?.focus();
      return;
    }

    direccionEntrega = { address, city, phone, notes };
  }

  // Disable button + show loading
  if (btn) btn.disabled = true;
  if (btnContent) btnContent.innerHTML = `
    <div class="spinner" style="width: 20px; height: 20px; border-width: 2px; margin: 0;"></div>
    <span>Procesando pedido...</span>
  `;

  try {
    // Group cart by seller
    const groups = {};
    cart.forEach(item => {
      const uid = item.vendedorUid || 'unknown';
      if (!groups[uid]) groups[uid] = { vendedorUid: uid, vendedorNombre: item.vendedorNombre || 'Vendedor', items: [] };
      groups[uid].items.push({
        nombre: item.name,
        precio: item.price || 0,
        cantidad: item.quantity || 1,
        productId: item.id,
        imagenUrl: item.image || '',
        categoria: item.categoria || '',
      });
    });

    // En lugar de crear el pedido en Firebase de inmediato, 
    // preparamos los datos para Stripe Checkout.
    const stripeItems = cart.map(item => ({
      name: item.name,
      description: `Vendido por: ${item.vendedorNombre || 'Vendedor local'}`,
      price: item.price || 0,
      quantity: item.quantity || 1,
    }));

    // Guardar temporalmente los datos del pedido en localStorage
    // para completarlo cuando Stripe redirija de vuelta.
    const pendingData = {
      compradorEmail,
      compradorNombre,
      compradorUid,
      esInvitado,
      tipoPerfil,
      deliveryMethod,
      direccionEntrega,
      datosInstitucionales,
      groups
    };
    localStorage.setItem('checkoutPendingData', JSON.stringify(pendingData));

    // Crear sesión de Stripe
    const successUrl = window.location.origin + window.location.pathname + '?session_id={CHECKOUT_SESSION_ID}#checkout';
    const cancelUrl = window.location.origin + window.location.pathname + '#checkout';

    const sessionResponse = await api.crearPagoCarrito({
      items: stripeItems,
      comprador_email: compradorEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { source: 'kanku_cart' }
    });

    if (sessionResponse && sessionResponse.checkout_url) {
      window.location.href = sessionResponse.checkout_url;
    } else {
      throw new Error('No se recibió la URL de Stripe');
    }

  } catch (err) {
    console.error('❌ Checkout error:', err);
    window.__components?.showToast?.('Error al procesar el pedido con Stripe. Intenta de nuevo.', 'error');
    if (btn) btn.disabled = false;
    if (btnContent) btnContent.innerHTML = `
      <span class="material-symbols-outlined filled" style="font-size: 20px;">lock</span>
      Confirmar Pedido
    `;
  }
}

async function completePendingOrder(sessionId) {
  try {
    const pendingDataStr = localStorage.getItem('checkoutPendingData');
    if (!pendingDataStr) return;
    
    const pendingData = JSON.parse(pendingDataStr);
    const {
      compradorEmail, compradorNombre, compradorUid, esInvitado,
      tipoPerfil, deliveryMethod, direccionEntrega, datosInstitucionales, groups
    } = pendingData;

    const ordersCreated = [];

    // Crear en Firebase
    for (const group of Object.values(groups)) {
      const total = group.items.reduce((sum, i) => sum + (i.precio * i.cantidad), 0);

      const pedidoData = {
        vendedorUid: group.vendedorUid,
        vendedorNombre: group.vendedorNombre,
        compradorEmail,
        compradorNombre,
        compradorUid,
        esInvitado,
        tipoPerfil,
        tipoEntrega: deliveryMethod,
        direccionEntrega,
        datosInstitucionales,
        items: group.items,
        total,
        estado: 'pagado', // Ya confirmado por Stripe (simplificación)
        stripeSessionId: sessionId
      };

      const docRef = await createPedido(pedidoData);
      ordersCreated.push({ ...pedidoData, id: docRef.id });

      let vendedorData = null;
      try {
        vendedorData = await getVendedor(group.vendedorUid);
      } catch (err) {
        console.warn('Could not fetch vendor data for email', err);
      }

      await createEmailNotification({
        to: [compradorEmail],
        message: buildEmailMessage({
          pedidoId: docRef.id,
          compradorNombre,
          compradorEmail,
          items: group.items,
          total,
          tipoEntrega: deliveryMethod,
          direccionEntrega,
          vendedorNombre: group.vendedorNombre,
          vendedorData,
        }),
        pedidoId: docRef.id,
      });
    }

    // Limpiar carrito y pendientes
    localStorage.setItem('cart', '[]');
    localStorage.removeItem('checkoutPendingData');
    updateCartBadge();

    // Mostrar overlay de éxito
    const overlay = document.getElementById('checkout-success-overlay');
    const successMsg = document.getElementById('success-message');
    const successEmail = document.getElementById('success-email');

    if (overlay) {
      const entregaText = deliveryMethod === 'recogida'
        ? 'Recoge tu pedido en la tienda Kanku, Minca, Sierra Nevada.'
        : `Enviaremos tu pedido a ${direccionEntrega?.city || 'tu dirección'}.`;

      if (successMsg) successMsg.textContent = `¡Pago exitoso, ${compradorNombre}! ${entregaText} Recibirás la confirmación pronto.`;
      if (successEmail) successEmail.textContent = compradorEmail;

      overlay.style.display = 'flex';
    }
  } catch (err) {
    console.error('Error completando pedido tras Stripe:', err);
    window.__components?.showToast?.('Hubo un problema al registrar tu pedido, pero el pago fue procesado. Contáctanos.', 'error');
  }
}

/**
 * Builds the email message compatible with Firebase Email Trigger Extension.
 * The extension reads: { to, message: { subject, html } }
 */
function buildEmailMessage({ pedidoId, compradorNombre, compradorEmail, items, total, tipoEntrega, direccionEntrega, vendedorNombre, vendedorData }) {
  const entregaHtml = tipoEntrega === 'recogida'
    ? `<p><strong>📍 Método de entrega:</strong> Recogida en Origen</p>
       <p><strong>Punto de recogida:</strong> ${vendedorData?.direccion || 'Tienda Principal'}, Sierra Nevada de Santa Marta</p>
       <p><strong>Horario:</strong> Lunes a Sábado, 7:00 AM – 5:00 PM</p>`
    : `<p><strong>🚚 Método de entrega:</strong> Envío a Domicilio</p>
       <p><strong>Dirección:</strong> ${direccionEntrega?.address || ''}, ${direccionEntrega?.city || ''}</p>
       ${direccionEntrega?.phone ? `<p><strong>Teléfono:</strong> ${direccionEntrega.phone}</p>` : ''}
       ${direccionEntrega?.notes ? `<p><strong>Notas:</strong> ${direccionEntrega.notes}</p>` : ''}`;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d3; font-size: 14px;">${item.nombre}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d3; text-align: center; font-size: 14px;">${item.cantidad}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f0e6d3; text-align: right; font-size: 14px; font-weight: 600; color: #5C3D11;">$${(item.precio * item.cantidad).toFixed(2)}</td>
    </tr>
  `).join('');

  // Seller Logo and Info
  const logoUrl = vendedorData?.imagenUrl || 'https://raw.githubusercontent.com/google/material-design-icons/master/png/maps/store_mall_directory/materialicons/48dp/2x/baseline_store_mall_directory_black_48dp.png';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${pedidoId}`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Pedido — KANKU</title></head>
    <body style="margin: 0; padding: 0; background: #FBF7F2; font-family: 'Helvetica Neue', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #5C3D11 0%, #8B5E3C 100%); border-radius: 16px; padding: 32px 28px; text-align: center; margin-bottom: 24px; position: relative;">
          <!-- Seller Logo inside Header -->
          <div style="width: 70px; height: 70px; border-radius: 50%; background: white; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 3px solid #F5C518;">
            <img src="${logoUrl}" alt="${vendedorNombre}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <h1 style="color: #F5C518; margin: 0 0 8px; font-size: 24px; letter-spacing: -0.5px;">${vendedorNombre}</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">${vendedorData?.descripcionCorta || 'Sierra Nevada de Santa Marta, Colombia'}</p>
        </div>

        <!-- Success Banner -->
        <div style="background: #E8F5E9; border-radius: 12px; padding: 20px 24px; text-align: center; margin-bottom: 24px; border: 1px solid #C8E6C9;">
          <div style="font-size: 40px; margin-bottom: 8px;">✅</div>
          <h2 style="color: #2E7D32; margin: 0 0 6px; font-size: 20px;">¡Pedido Confirmado!</h2>
          <p style="color: #388E3C; margin: 0; font-size: 14px;">Hola <strong>${compradorNombre}</strong>, tu pedido ha sido registrado exitosamente.</p>
        </div>

        <!-- Order Details -->
        <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <h3 style="color: #5C3D11; margin: 0 0 16px; font-size: 16px; display: flex; align-items: center; gap: 8px;">🛒 Detalle de tu pedido (#${pedidoId.substring(0, 8).toUpperCase()})</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #FBF7F2;">
                <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #8B7355; text-transform: uppercase; letter-spacing: 0.06em;">Producto</th>
                <th style="padding: 10px 12px; text-align: center; font-size: 12px; color: #8B7355; text-transform: uppercase; letter-spacing: 0.06em;">Cant.</th>
                <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #8B7355; text-transform: uppercase; letter-spacing: 0.06em;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="display: flex; justify-content: flex-end; margin-top: 14px; padding-top: 14px; border-top: 2px solid #5C3D11;">
            <div style="text-align: right;">
              <p style="margin: 0; color: #8B7355; font-size: 12px;">TOTAL</p>
              <p style="margin: 0; color: #5C3D11; font-size: 22px; font-weight: 700;">$${total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <!-- Delivery Info -->
        <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <h3 style="color: #5C3D11; margin: 0 0 12px; font-size: 16px;">📦 Información de Entrega</h3>
          <div style="font-size: 14px; color: #4A4A4A; line-height: 1.6;">
            ${entregaHtml}
          </div>
        </div>

        <!-- QR Note & Voucher -->
        <div style="background: linear-gradient(135deg, #FFF8E1, #FFF3CD); border-radius: 12px; padding: 20px 24px; margin-bottom: 24px; border: 1px solid #FFD54F; text-align: center;">
          <h3 style="color: #F57F17; margin: 0 0 10px; font-size: 15px;">📱 Voucher de Pedido (QR)</h3>
          <p style="color: #795548; margin: 0 0 16px; font-size: 13px; line-height: 1.7;">
            Presenta este código QR al vendedor al momento de la recogida o entrega para validar tu pedido de forma rápida y segura.
          </p>
          <div style="background: white; padding: 12px; display: inline-block; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <img src="${qrCodeUrl}" alt="QR del Pedido ${pedidoId}" style="display: block; width: 150px; height: 150px;">
          </div>
          <p style="color: #F57F17; font-size: 11px; font-weight: 700; margin: 12px 0 0; letter-spacing: 0.05em;">ID: ${pedidoId}</p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding-top: 16px; border-top: 1px solid #E8DDD0;">
          <p style="color: #8B7355; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} KANKU — Trazabilidad y Comercio del Cacao del Magdalena</p>
          <p style="color: #BCA882; font-size: 11px; margin: 6px 0 0;">Sierra Nevada de Santa Marta, Colombia 🇨🇴</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return {
    subject: `✅ Pedido Confirmado — KANKU | ${vendedorNombre}`,
    html,
  };
}
