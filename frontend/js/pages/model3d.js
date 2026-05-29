/**
 * 🎨 KANKU — 3D Gallery / Educational Experience
 * Interactive 3D gallery showcasing the history of cacao, coffee, and banana
 * Uses Google's <model-viewer> for AR-ready 3D visualization
 */

const MODELS = [
  {
    id: 'coffee',
    src: '/models/coffee_bag.glb',
    emoji: '☕',
    titleKey: 'model3d.gallery.coffee.title',
    descKey: 'model3d.gallery.coffee.desc',
    historyKey: 'model3d.gallery.coffee.history',
    color: '#5D4037',
    gradient: 'linear-gradient(135deg, #3E2723, #6D4C41)',
    tags: ['model3d.tag.organic', 'model3d.tag.artisan', 'model3d.tag.altitude'],
  },
  {
    id: 'banana',
    src: '/models/banana.glb',
    emoji: '🍌',
    titleKey: 'model3d.gallery.banana.title',
    descKey: 'model3d.gallery.banana.desc',
    historyKey: 'model3d.gallery.banana.history',
    color: '#F9A825',
    gradient: 'linear-gradient(135deg, #F57F17, #FDD835)',
    tags: ['model3d.tag.biodegradable', 'model3d.tag.sustainable', 'model3d.tag.organic'],
  },
  {
    id: 'banana-surprise',
    src: '/models/bananas_surprise.glb',
    emoji: '🍌',
    titleKey: 'model3d.gallery.surprise.title',
    descKey: 'model3d.gallery.surprise.desc',
    historyKey: 'model3d.gallery.surprise.history',
    color: '#2E7D32',
    gradient: 'linear-gradient(135deg, #1B5E20, #43A047)',
    tags: ['model3d.tag.biodegradable', 'model3d.tag.artisan', 'model3d.tag.qr'],
  },
];

export function renderModel3D() {
  return `
    <div class="page-content" style="position: relative;">
      <div class="ambient-blob ambient-blob--gold" style="top: 5%; left: -5%; width: 280px; height: 280px;"></div>
      <div class="ambient-blob ambient-blob--green" style="bottom: 20%; right: -8%; width: 320px; height: 320px;"></div>

      <main class="container" style="padding-top: 32px; padding-bottom: 80px; display: flex; flex-direction: column; gap: 48px;">

        <!-- Hero Header -->
        <section style="text-align: center; display: flex; flex-direction: column; gap: 14px; max-width: 620px; margin: 0 auto;">
          <p class="label-sm" style="color: var(--secondary); letter-spacing: 0.15em;">${t('model3d.badge')}</p>
          <h1 class="headline-xl gold-gradient-text">${t('model3d.gallery.title')}</h1>
          <p class="body-md" style="color: var(--on-surface-variant); line-height: 1.7;">
            ${t('model3d.gallery.subtitle')}
          </p>
        </section>

        <!-- 3D Models Gallery -->
        ${MODELS.map((model, idx) => `
          <section class="animate-fade-in-up stagger-${idx + 1}" style="opacity: 0;">
            <div class="card" style="overflow: hidden; padding: 0;">
              
              <!-- Section Header -->
              <div style="background: ${model.gradient}; padding: 20px 24px; display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 32px;">${model.emoji}</span>
                <div>
                  <h2 style="color: white; font-size: 20px; font-weight: 700; margin: 0;">${t(model.titleKey)}</h2>
                  <p style="color: rgba(255,255,255,0.8); font-size: 13px; margin: 4px 0 0;">${t(model.descKey)}</p>
                </div>
              </div>

              <!-- Model Viewer + Info Grid -->
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0;" class="model3d-grid">
                
                <!-- 3D Viewer -->
                <div class="model-viewer-container" style="height: 380px; border-radius: 0; border: none; box-shadow: none; background: var(--surface-container);">
                  <model-viewer
                    class="gallery-model-viewer"
                    src="${model.src}"
                    alt="${t(model.titleKey)}"
                    auto-rotate
                    camera-controls
                    touch-action="pan-y"
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    shadow-intensity="1"
                    shadow-softness="0.5"
                    exposure="1"
                    environment-image="neutral"
                    loading="lazy"
                    style="width: 100%; height: 100%; --poster-color: var(--surface-container);"
                  >
                    <div slot="poster" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 16px; background: var(--surface-container);">
                      <span class="material-symbols-outlined animate-float" style="font-size: 56px; color: var(--secondary); opacity: 0.5;">view_in_ar</span>
                      <p class="body-md" style="color: var(--on-surface-variant);">${t('model3d.loading')}</p>
                    </div>

                    <button slot="ar-button" style="position: absolute; bottom: 16px; right: 16px; background: var(--tertiary); color: var(--on-tertiary); border: none; padding: 10px 20px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: var(--shadow-md); transition: transform 0.2s;"
                      onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform=''">
                      <span class="material-symbols-outlined" style="font-size: 18px;">view_in_ar</span>
                      ${t('model3d.viewAR')}
                    </button>
                  </model-viewer>
                </div>

                <!-- Info Panel -->
                <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px; justify-content: center; background: var(--surface-container-low);">
                  <p class="body-md" style="color: var(--on-surface-variant); line-height: 1.8;">
                    ${t(model.historyKey)}
                  </p>
                  <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    ${model.tags.map(tag => `
                      <span style="background: var(--surface-container-highest); color: var(--on-surface-variant); padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600;">${t(tag)}</span>
                    `).join('')}
                  </div>

                  <!-- Controls -->
                  <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
                    <button class="btn btn-secondary model-rotate-toggle" data-model="${model.id}" style="padding: 8px 14px; font-size: 11px; border-radius: var(--radius-xl);">
                      <span class="material-symbols-outlined" style="font-size: 16px;">360</span>
                      ${t('model3d.autoRotate')}
                    </button>
                    <button class="btn btn-secondary model-reset-btn" data-model="${model.id}" style="padding: 8px 14px; font-size: 11px; border-radius: var(--radius-xl);">
                      <span class="material-symbols-outlined" style="font-size: 16px;">restart_alt</span>
                      ${t('model3d.resetView')}
                    </button>
                  </div>

                  <!-- Interaction hints -->
                  <div style="display: flex; gap: 16px; margin-top: 4px;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span class="material-symbols-outlined" style="font-size: 16px; color: var(--tertiary);">touch_app</span>
                      <span style="font-size: 11px; color: var(--on-surface-variant);">${t('model3d.dragToRotate')}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span class="material-symbols-outlined" style="font-size: 16px; color: var(--secondary);">pinch_zoom_in</span>
                      <span style="font-size: 11px; color: var(--on-surface-variant);">${t('model3d.pinchToZoom')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        `).join('')}

        <!-- Upload Custom Model -->
        <section style="max-width: 500px; margin: 0 auto; width: 100%;">
          <div class="card-flat" style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 16px;">
            <span class="material-symbols-outlined" style="font-size: 40px; color: var(--secondary);">upload_file</span>
            <h3 class="headline-md">${t('model3d.upload.title')}</h3>
            <p class="body-md" style="color: var(--on-surface-variant);">${t('model3d.upload.desc')}</p>
            <label class="btn btn-gold" style="padding: 12px 24px; border-radius: 9999px; cursor: pointer;">
              <span class="material-symbols-outlined" style="font-size: 18px;">upload_file</span>
              ${t('model3d.loadModel')}
              <input type="file" accept=".glb,.gltf" id="model-upload-custom" style="display: none;" />
            </label>
          </div>
        </section>

      </main>
    </div>
  `;
}

export function initModel3D() {
  loadModelViewer();
  injectModel3DStyles();

  // Auto-rotate toggles
  document.querySelectorAll('.model-rotate-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const viewers = document.querySelectorAll('.gallery-model-viewer');
      viewers.forEach(mv => {
        const isRotating = mv.hasAttribute('auto-rotate');
        if (isRotating) mv.removeAttribute('auto-rotate');
        else mv.setAttribute('auto-rotate', '');
      });
    });
  });

  // Reset buttons
  document.querySelectorAll('.model-reset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const viewers = document.querySelectorAll('.gallery-model-viewer');
      viewers.forEach(mv => {
        mv.cameraOrbit = 'auto auto auto';
        mv.fieldOfView = 'auto';
      });
    });
  });

  // Upload custom model
  document.getElementById('model-upload-custom')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      // Set it on the first model viewer
      const mv = document.querySelector('.gallery-model-viewer');
      if (mv) {
        mv.src = url;
        mv.dismissPoster?.();
        window.__components?.showToast?.('Modelo cargado exitosamente', 'success');
      }
    }
  });
}

async function loadModelViewer() {
  if (customElements.get('model-viewer')) return;
  try {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
    document.head.appendChild(script);
  } catch (e) {
    console.warn('Could not load model-viewer:', e);
  }
}

function injectModel3DStyles() {
  if (document.getElementById('model3d-gallery-styles')) return;
  const style = document.createElement('style');
  style.id = 'model3d-gallery-styles';
  style.textContent = `
    .model3d-grid {
      grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 768px) {
      .model3d-grid {
        grid-template-columns: 1fr !important;
      }
      .model3d-grid .model-viewer-container {
        height: 300px !important;
      }
    }
  `;
  document.head.appendChild(style);
}
