/**
 * 🌿 Story Page — Emotional Traceability / Producer Profile
 * Adapted from the user's fourth HTML mockup
 */

import api from '../api.js';

export function renderStory() {
  return `
    <div class="page-content">
      <main class="container" style="padding-top: 40px; padding-bottom: 60px; display: flex; flex-direction: column; gap: 64px;">

        <!-- Section: Producer Profile -->
        <section class="animate-fade-in-up" style="opacity: 0;">
          <div class="grid-12" style="align-items: center;">
            
            <!-- Image -->
            <div class="col-span-full md-col-6">
              <div style="position: relative; border-radius: 1rem; overflow: hidden; aspect-ratio: 4/5;" class="soft-shadow">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBM8Aat_Ni-t1dndmMkfVSpPgzfEePvq4jMozQpJAb8I1Y9bCG4by_Xfqp_zJQS3bXKZ3WWyZsJ4D-dTBqpfPJykFMbnt-qNKHs9V1L7Xs6hDE6U5Rt2CFavtvCoR29kVRftnt-n75geiK9xPuPs7zA6PwqjqVHov_DIfycObllQ35_jojoFGmu6UlYdXxedD9jy-D0-i8lGpITNUvOR2EZ33nRZYOjYD8whYiKCqYE1kz4l1WoCACY0odlskXlZLU7dqO3zYOpNA"
                  alt="Productor de Cacao"
                  style="width: 100%; height: 100%; object-fit: cover;"
                />
                <div style="position: absolute; top: 16px; left: 16px; background: rgba(255,255,255,0.9); backdrop-filter: blur(8px); padding: 6px 14px; border-radius: 9999px; display: flex; align-items: center; gap: 8px;" class="micro-gold-border">
                  <span class="material-symbols-outlined" style="font-size: 14px; color: var(--tertiary);">spa</span>
                  <span class="label-sm" style="color: var(--on-surface-variant);">ORIGEN ÚNICO</span>
                </div>
              </div>
            </div>

            <!-- Text Content -->
            <div class="col-span-full md-col-6" style="display: flex; flex-direction: column; justify-content: center; gap: 24px; padding-top: 32px;">
              <div>
                <h2 class="headline-xl" style="color: var(--secondary); margin-bottom: 8px;" id="producer-name">Manuel</h2>
                <p class="label-sm" style="color: var(--outline); letter-spacing: 0.15em;" id="producer-gen">3ª GENERACIÓN DE CACAOTEROS</p>
              </div>
              <div style="width: 48px; border-top: 1px solid var(--secondary); opacity: 0.5;"></div>
              <p class="body-lg" style="color: var(--on-surface-variant); line-height: 1.8;" id="producer-story">
                Manuel cultiva este cacao fino de aroma a 1,200msnm en las laderas neblinosas de la Sierra Nevada. Su dedicación a métodos ancestrales y el respeto por la biodiversidad del entorno garantizan un perfil de sabor complejo, con notas a frutos rojos y maderas finas, preservando la esencia del suelo en cada grano.
              </p>
            </div>
          </div>
        </section>

        <!-- Section: Terroir & Altitude -->
        <section>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
              <h3 class="headline-md" style="color: var(--on-background);">Terruño & Altitud</h3>
              <span class="label-sm" style="color: var(--secondary); background: rgba(254, 214, 91, 0.15); padding: 6px 14px; border-radius: 9999px;" class="micro-gold-border" id="altitude-badge">1,200 M.S.N.M.</span>
            </div>

            <!-- Map Container -->
            <div style="position: relative; width: 100%; height: 300px; border-radius: 1rem; overflow: hidden; background: var(--surface-container-highest); display: flex; align-items: center; justify-content: center; cursor: pointer;" class="soft-shadow" id="map-container">
              <div style="position: absolute; inset: 0; background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAawNyCRfBAn-Qd3mNSQ5o5mKI4W5IzSSqYAV1nZJiP6r0_xREUAwFNE6RtrPhOrYUXVCxtS9TcnF3fvvHL7Ihtq07FwjnV17rdwrwIn9cOAvGsX-DRsn1VxiFlnMOvOBFBo2R-cob'); background-size: cover; background-position: center; opacity: 0.4; transition: opacity 0.5s;"></div>
              <div style="position: relative; z-index: 1; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px;">
                <span class="material-symbols-outlined" style="font-size: 48px; color: var(--tertiary); animation: float 3s ease-in-out infinite;">pin_drop</span>
                <p class="headline-md" style="color: var(--on-surface);">Sierra Nevada de Santa Marta</p>
                <p class="body-md" style="color: var(--on-surface-variant);">Colombia · 10.9°N, 73.7°W</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Section: Journey Timeline -->
        <section>
          <h3 class="headline-md" style="color: var(--on-background); margin-bottom: 24px;">
            <span class="material-symbols-outlined" style="color: var(--secondary); vertical-align: middle; margin-right: 8px;">timeline</span>
            Viaje del Grano
          </h3>
          
          <div class="timeline" id="journey-timeline">
            <div class="timeline__item stagger-1" style="animation-delay: 0.3s;">
              <div class="timeline__time">Enero 2026</div>
              <div class="timeline__content">Siembra y cuidado en parcela 'El Mirador'</div>
              <div class="timeline__detail">Altitud: 1,200 msnm · Variedad: Criollo</div>
            </div>
            <div class="timeline__item stagger-2" style="animation-delay: 0.5s;">
              <div class="timeline__time">Marzo 2026</div>
              <div class="timeline__content">Monitoreo de maduración con sensores IoT</div>
              <div class="timeline__detail">Humedad: 72% · Temperatura: 24°C</div>
            </div>
            <div class="timeline__item stagger-3" style="animation-delay: 0.7s;">
              <div class="timeline__time">Abril 2026</div>
              <div class="timeline__content">Cosecha selectiva a mano</div>
              <div class="timeline__detail">Solo granos en punto óptimo de maduración</div>
            </div>
            <div class="timeline__item stagger-4" style="animation-delay: 0.9s;">
              <div class="timeline__time">Abril 2026</div>
              <div class="timeline__content">Fermentación controlada (5 días)</div>
              <div class="timeline__detail">Cajones de madera de laurel · Volteo cada 48h</div>
            </div>
            <div class="timeline__item stagger-5" style="animation-delay: 1.1s;">
              <div class="timeline__time">Mayo 2026</div>
              <div class="timeline__content">Secado al sol y selección final</div>
              <div class="timeline__detail">Camas elevadas de bambú · 7 días</div>
            </div>
          </div>
        </section>

        <!-- Section: Flavor Profile -->
        <section style="max-width: 600px; margin: 0 auto; width: 100%;">
          <div class="card-flat" style="text-align: center; display: flex; flex-direction: column; gap: 20px;">
            <h3 class="headline-md">Perfil de Sabor</h3>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;" id="flavor-tags">
              <span style="background: var(--tertiary-container); color: var(--on-tertiary-container); padding: 8px 18px; border-radius: 9999px; font-size: 13px; font-weight: 600;">🍒 Frutos Rojos</span>
              <span style="background: var(--secondary-container); color: var(--on-secondary-container); padding: 8px 18px; border-radius: 9999px; font-size: 13px; font-weight: 600;">🍫 Cacao Intenso</span>
              <span style="background: var(--primary-fixed); color: var(--on-primary-fixed-variant); padding: 8px 18px; border-radius: 9999px; font-size: 13px; font-weight: 600;">🪵 Maderas Finas</span>
              <span style="background: var(--surface-container-highest); color: var(--on-surface); padding: 8px 18px; border-radius: 9999px; font-size: 13px; font-weight: 600;">🌰 Nuez</span>
              <span style="background: var(--tertiary-container); color: var(--on-tertiary-container); padding: 8px 18px; border-radius: 9999px; font-size: 13px; font-weight: 600;">🌿 Herbal</span>
            </div>
            <div style="width: 80%; margin: 0 auto;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span class="label-sm" style="color: var(--on-surface-variant);">PUNTAJE DE CALIDAD</span>
                <span class="label-sm" style="color: var(--secondary);" id="quality-score">87/100</span>
              </div>
              <div style="width: 100%; height: 6px; background: var(--surface-container-highest); border-radius: 9999px; overflow: hidden;">
                <div style="width: 87%; height: 100%; background: linear-gradient(to right, var(--tertiary), var(--secondary)); border-radius: 9999px; transition: width 1s ease;" id="quality-bar"></div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  `;
}

export function initStory() {
  // Load producer data from API
  loadProducerData();
}

async function loadProducerData() {
  try {
    const productores = await api.getProductores({ limit: 1 });
    if (productores && productores.length > 0) {
      const p = productores[0];
      const nameEl = document.getElementById('producer-name');
      const storyEl = document.getElementById('producer-story');
      if (nameEl && p.nombre) nameEl.textContent = p.nombre;
      if (storyEl && p.historia) storyEl.textContent = p.historia;
    }
  } catch (e) {
    // Keep default demo data
    console.log('Using demo producer data');
  }
}
