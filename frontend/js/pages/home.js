/**
 * 🏠 Home / Landing Page — KANKU
 * Multi-product showcase: Cacao, Café, Banano
 */

export function renderHome() {
  return `
    <div class="page-content" style="position: relative;">
      <!-- Ambient Background -->
      <div class="ambient-blob ambient-blob--gold" style="top: 20%; left: -5%; width: 300px; height: 300px;"></div>
      <div class="ambient-blob ambient-blob--green" style="bottom: 15%; right: -5%; width: 350px; height: 350px;"></div>

      <!-- Hero Section -->
      <section class="container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 40px; padding-top: 40px; padding-bottom: 48px; min-height: calc(100dvh - 200px);">

        <!-- Logo & Title -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--secondary-container); display: flex; align-items: center; justify-content: center; animation: float 3s ease-in-out infinite;">
            <span style="font-size: 42px;">🌿</span>
          </div>
          <h1 class="headline-xl gold-gradient-text" style="letter-spacing: -0.02em; font-size: 56px;">KANKU</h1>
          <p class="body-lg" style="color: var(--on-surface-variant); max-width: 520px;">
            Marketplace de la Sierra Nevada. Cacao, Café y Banano directo del productor a tu mesa — con trazabilidad verificable.
          </p>
          <p class="label-sm" style="color: var(--secondary); letter-spacing: 0.15em; margin-top: 4px;">EN HONOR AL PUEBLO KANKUAMO</p>
        </div>

        <!-- 3 Product Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; width: 100%; max-width: 900px;">
          
          <div class="card animate-fade-in-up stagger-1" style="text-align: center; opacity: 0; cursor: pointer; padding: 32px 20px;" data-nav="product">
            <span style="font-size: 56px; display: block; margin-bottom: 16px;">🍫</span>
            <h3 class="headline-md" style="margin-bottom: 8px;">Cacao</h3>
            <p class="body-md" style="color: var(--on-surface-variant);">Fino de aroma. Cultivado a 1,200 m.s.n.m. en la Sierra Nevada.</p>
            <div style="margin-top: 16px; display: flex; justify-content: center;">
              <span class="btn btn-secondary" style="padding: 8px 20px; font-size: 11px;">VER PRODUCTOS</span>
            </div>
          </div>

          <div class="card animate-fade-in-up stagger-2" style="text-align: center; opacity: 0; cursor: pointer; padding: 32px 20px;" data-nav="product">
            <span style="font-size: 56px; display: block; margin-bottom: 16px;">☕</span>
            <h3 class="headline-md" style="margin-bottom: 8px;">Café</h3>
            <p class="body-md" style="color: var(--on-surface-variant);">De altura, arábica premium. Tostado artesanal con notas de fruta.</p>
            <div style="margin-top: 16px; display: flex; justify-content: center;">
              <span class="btn btn-secondary" style="padding: 8px 20px; font-size: 11px;">VER PRODUCTOS</span>
            </div>
          </div>

          <div class="card animate-fade-in-up stagger-3" style="text-align: center; opacity: 0; cursor: pointer; padding: 32px 20px;" data-nav="product">
            <span style="font-size: 56px; display: block; margin-bottom: 16px;">🍌</span>
            <h3 class="headline-md" style="margin-bottom: 8px;">Banano</h3>
            <p class="body-md" style="color: var(--on-surface-variant);">Orgánico y sostenible. Desde las fincas del Magdalena al mundo.</p>
            <div style="margin-top: 16px; display: flex; justify-content: center;">
              <span class="btn btn-secondary" style="padding: 8px 20px; font-size: 11px;">VER PRODUCTOS</span>
            </div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;">
          <button class="btn btn-primary" style="padding: 18px 36px; border-radius: 9999px;" data-nav="scanner">
            <span class="material-symbols-outlined filled">qr_code_scanner</span>
            <span>ESCANEAR ORIGEN</span>
          </button>
          <button class="btn btn-secondary" style="padding: 18px 36px; border-radius: 9999px;" data-nav="seller-login">
            <span class="material-symbols-outlined">storefront</span>
            <span>SOY VENDEDOR</span>
          </button>
        </div>
      </section>

      <!-- Features Section -->
      <section class="container" style="padding-bottom: 60px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
          
          <div class="card animate-fade-in-up stagger-1" style="text-align: center; opacity: 0; cursor: pointer;" data-nav="traceability">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--tertiary-container); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <span class="material-symbols-outlined filled" style="color: var(--on-tertiary-container); font-size: 28px;">verified_user</span>
            </div>
            <h3 class="headline-md" style="margin-bottom: 8px;">Trazabilidad Real</h3>
            <p class="body-md" style="color: var(--on-surface-variant);">Cada lote verificado con hash SHA-256. Certificaciones Fairtrade y Rainforest Alliance.</p>
          </div>

          <div class="card animate-fade-in-up stagger-2" style="text-align: center; opacity: 0; cursor: pointer;" data-nav="story">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--secondary-container); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <span class="material-symbols-outlined filled" style="color: var(--on-secondary-container); font-size: 28px;">groups</span>
            </div>
            <h3 class="headline-md" style="margin-bottom: 8px;">Comunidades Indígenas</h3>
            <p class="body-md" style="color: var(--on-surface-variant);">En honor al pueblo Kankuamo. Compra directa que beneficia a los productores de la Sierra.</p>
          </div>

          <div class="card animate-fade-in-up stagger-3" style="text-align: center; opacity: 0; cursor: pointer;" data-nav="model3d">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--primary-fixed); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <span class="material-symbols-outlined filled" style="color: var(--on-primary-fixed-variant); font-size: 28px;">view_in_ar</span>
            </div>
            <h3 class="headline-md" style="margin-bottom: 8px;">Experiencia 3D</h3>
            <p class="body-md" style="color: var(--on-surface-variant);">Explora nuestros productos en realidad aumentada desde tu dispositivo.</p>
          </div>

        </div>
      </section>
    </div>
  `;
}
