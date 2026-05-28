/**
 * 🎨 3D Model Viewer Page
 * Uses Google's <model-viewer> for interactive 3D product visualization
 */

export function renderModel3D() {
  return `
    <div class="page-content">
      <main class="container" style="padding-top: 40px; padding-bottom: 60px; display: flex; flex-direction: column; align-items: center; gap: 48px;">
        
        <!-- Header -->
        <section style="text-align: center; display: flex; flex-direction: column; gap: 16px; max-width: 520px;">
          <p class="label-sm" style="color: var(--secondary); letter-spacing: 0.15em;">EXPERIENCIA INMERSIVA</p>
          <h2 class="headline-xl gold-gradient-text">Explora en 3D</h2>
          <p class="body-md" style="color: var(--on-surface-variant);">
            Interactúa con nuestro producto. Rota, acerca y descubre cada detalle del empaque artesanal de Cacao de la Sierra.
          </p>
        </section>

        <!-- 3D Viewer Container -->
        <section style="width: 100%; max-width: 600px;">
          <div class="model-viewer-container" id="model-container">
            <model-viewer
              id="product-model"
              src=""
              alt="Cacao de la Sierra - Producto 3D"
              auto-rotate
              camera-controls
              touch-action="pan-y"
              ar
              ar-modes="webxr scene-viewer quick-look"
              shadow-intensity="1"
              shadow-softness="0.5"
              exposure="1"
              environment-image="neutral"
              style="width: 100%; height: 100%; --poster-color: var(--surface-container);"
            >
              <!-- Poster / Placeholder -->
              <div slot="poster" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 20px; background: var(--surface-container);">
                <span class="material-symbols-outlined animate-float" style="font-size: 64px; color: var(--secondary); opacity: 0.6;">view_in_ar</span>
                <p class="body-md" style="color: var(--on-surface-variant);">Cargando modelo 3D...</p>
                <p class="label-sm" style="color: var(--outline);">Agrega un archivo .GLB para visualizar</p>
              </div>

              <!-- AR Button -->
              <button slot="ar-button" style="position: absolute; bottom: 16px; right: 16px; background: var(--tertiary); color: var(--on-tertiary); border: none; padding: 10px 18px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; display: flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: var(--shadow-md);">
                <span class="material-symbols-outlined" style="font-size: 18px;">view_in_ar</span>
                VER EN AR
              </button>
            </model-viewer>
          </div>

          <!-- Controls -->
          <div style="display: flex; justify-content: center; gap: 12px; margin-top: 20px; flex-wrap: wrap;">
            <button class="btn btn-secondary" id="model-rotate-toggle" style="padding: 10px 18px; font-size: 11px; border-radius: var(--radius-xl);">
              <span class="material-symbols-outlined" style="font-size: 18px;">360</span>
              AUTO-ROTAR
            </button>
            <button class="btn btn-secondary" id="model-reset" style="padding: 10px 18px; font-size: 11px; border-radius: var(--radius-xl);">
              <span class="material-symbols-outlined" style="font-size: 18px;">restart_alt</span>
              REINICIAR VISTA
            </button>
            <label class="btn btn-gold" style="padding: 10px 18px; font-size: 11px; border-radius: var(--radius-xl); cursor: pointer;">
              <span class="material-symbols-outlined" style="font-size: 18px;">upload_file</span>
              CARGAR MODELO
              <input type="file" accept=".glb,.gltf" id="model-upload" style="display: none;" />
            </label>
          </div>
        </section>

        <!-- Info Cards -->
        <section style="width: 100%; max-width: 600px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="card-flat" style="text-align: center;">
            <span class="material-symbols-outlined" style="color: var(--tertiary); font-size: 32px; margin-bottom: 8px;">touch_app</span>
            <p class="label-sm" style="color: var(--on-surface-variant);">ARRASTRA PARA ROTAR</p>
          </div>
          <div class="card-flat" style="text-align: center;">
            <span class="material-symbols-outlined" style="color: var(--secondary); font-size: 32px; margin-bottom: 8px;">pinch_zoom_in</span>
            <p class="label-sm" style="color: var(--on-surface-variant);">PELLIZCA PARA ZOOM</p>
          </div>
        </section>

        <!-- Model Info -->
        <section style="width: 100%; max-width: 600px;">
          <div class="card-flat" style="display: flex; flex-direction: column; gap: 16px;">
            <h3 class="headline-md">Sobre el Empaque</h3>
            <p class="body-md" style="color: var(--on-surface-variant);">
              Nuestro empaque es elaborado con materiales 100% biodegradables, impresos con tintas a base de soya. Cada caja cuenta con un código QR único que enlaza la trazabilidad completa del lote, desde la finca hasta tu mesa.
            </p>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <span style="background: var(--tertiary-container); color: var(--on-tertiary-container); padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600;">♻️ Biodegradable</span>
              <span style="background: var(--secondary-container); color: var(--on-secondary-container); padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600;">🎨 Artesanal</span>
              <span style="background: var(--primary-fixed); color: var(--on-primary-fixed-variant); padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 600;">🔒 QR Integrado</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  `;
}

export function initModel3D() {
  // Load model-viewer web component
  loadModelViewer();

  // Auto-rotate toggle
  document.getElementById('model-rotate-toggle')?.addEventListener('click', () => {
    const mv = document.getElementById('product-model');
    if (mv) {
      const isRotating = mv.hasAttribute('auto-rotate');
      if (isRotating) {
        mv.removeAttribute('auto-rotate');
      } else {
        mv.setAttribute('auto-rotate', '');
      }
    }
  });

  // Reset camera
  document.getElementById('model-reset')?.addEventListener('click', () => {
    const mv = document.getElementById('product-model');
    if (mv) {
      mv.cameraOrbit = 'auto auto auto';
      mv.fieldOfView = 'auto';
    }
  });

  // Upload model file
  document.getElementById('model-upload')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const mv = document.getElementById('product-model');
      if (mv) {
        mv.src = url;
        mv.dismissPoster();
      }
    }
  });

  // Try to load a placeholder model
  loadPlaceholderModel();
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

function loadPlaceholderModel() {
  // Check for local model files
  const mv = document.getElementById('product-model');
  if (!mv) return;

  // Try to load from assets folder
  const possiblePaths = [
    '/assets/models/cacao.glb',
    '/assets/models/product.glb',
    '/assets/models/chocolate.glb',
  ];

  // For now, keep the poster visible (user can upload their own model)
  console.log('📦 3D Viewer ready. Upload a .GLB file to view it.');
}
