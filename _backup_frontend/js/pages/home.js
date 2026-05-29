/**
 * 🏠 Home / Landing Page — "Descubre el Origen"
 * Adapted from the user's second HTML mockup
 */

export function renderHome() {
  return `
    <div class="page-content" style="position: relative;">
      <!-- Ambient Background -->
      <div class="ambient-blob ambient-blob--gold" style="top: 20%; left: -5%; width: 300px; height: 300px;"></div>
      <div class="ambient-blob ambient-blob--green" style="bottom: 15%; right: -5%; width: 350px; height: 350px;"></div>

      <!-- Hero Section -->
      <section class="container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 48px; padding-top: 40px; padding-bottom: 60px; min-height: calc(100dvh - 160px);">

        <!-- Product Image with Hover Effect -->
        <div style="position: relative; width: 100%; max-width: 420px; margin: 0 auto; aspect-ratio: 3/4; border-radius: 1rem; overflow: hidden; background: var(--surface-container-low); transition: transform 0.5s ease; cursor: pointer;" 
             class="soft-shadow"
             onmouseover="this.style.transform='scale(1.02)'"
             onmouseout="this.style.transform='scale(1)'">
          <img 
            src="https://lh3.googleusercontent.com/aida/ADBb0ugjNoI5u_zEtDksSWoVH0wGdR77Ns4_dIH8foONYcbFtl6g-yvdWb_Ai63AdUNhqxGDn9lyfUoKa6zwmLgwlEzkuxjb6NZkxpI7MpeEmCU7hnwAZlvOHigEp8B--JZbZ0LOuBtzM63_Vr2PCLfj7iKSMDlvi-K2nwFjUBHbUnT2olbLU0rngEWAUUjUxgmE4gRyUPnSc9yL30wWmzMp5KD_a0NE2NNiNttHYh3_7nPkFTUIlNaoLzfs1Q" 
            alt="Cacao de la Sierra - Chocolate Premium"
            style="width: 100%; height: 100%; object-fit: cover; border-radius: 1rem;"
          />
          <!-- Hover Overlay -->
          <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent, transparent); opacity: 0; transition: opacity 0.3s ease; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 32px;"
               onmouseover="this.style.opacity='1'"
               onmouseout="this.style.opacity='0'">
            <p class="headline-md" style="color: var(--on-primary); font-style: italic; opacity: 0.9;">
              Tu viaje comienza aquí.
            </p>
          </div>
        </div>

        <!-- CTA Content -->
        <div style="display: flex; flex-direction: column; align-items: center; gap: 24px; max-width: 520px;">
          <h2 class="headline-xl gold-gradient-text" style="letter-spacing: -0.02em;">
            Descubre el Origen
          </h2>
          <p class="body-lg" style="color: var(--on-surface-variant); max-width: 480px;">
            Cada tableta tiene una historia. Escanea el código para rastrear el viaje de nuestro cacao, desde las montañas hasta tus manos.
          </p>
          <button class="btn btn-primary" style="margin-top: 16px; padding: 18px 36px; border-radius: 9999px; width: 100%; max-width: 360px;" data-nav="scanner">
            <span class="material-symbols-outlined filled">qr_code_scanner</span>
            <span>ESCANEAR Y VERIFICAR ORIGEN</span>
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
              <span class="material-symbols-outlined filled" style="color: var(--on-secondary-container); font-size: 28px;">spa</span>
            </div>
            <h3 class="headline-md" style="margin-bottom: 8px;">Origen Único</h3>
            <p class="body-md" style="color: var(--on-surface-variant);">Sierra Nevada del Magdalena. Cacao fino de aroma cultivado a 1,200 m.s.n.m.</p>
          </div>

          <div class="card animate-fade-in-up stagger-3" style="text-align: center; opacity: 0; cursor: pointer;" data-nav="model3d">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--primary-fixed); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <span class="material-symbols-outlined filled" style="color: var(--on-primary-fixed-variant); font-size: 28px;">view_in_ar</span>
            </div>
            <h3 class="headline-md" style="margin-bottom: 8px;">Experiencia 3D</h3>
            <p class="body-md" style="color: var(--on-surface-variant);">Explora nuestro producto en realidad aumentada desde tu dispositivo.</p>
          </div>

        </div>
      </section>
    </div>
  `;
}
