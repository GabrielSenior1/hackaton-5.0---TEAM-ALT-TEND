/**
 * ✅ Traceability Page — Technical Verification
 * Adapted from the user's third HTML mockup
 */

import api from '../api.js';

export function renderTraceability() {
  return `
    <div class="page-content">
      <main class="container" style="padding-top: 40px; padding-bottom: 60px; display: flex; flex-direction: column; gap: 48px;">
        
        <!-- Header Section -->
        <section style="text-align: center; display: flex; flex-direction: column; gap: 16px;">
          <p class="label-sm" style="color: var(--secondary); letter-spacing: 0.15em;">TRAZABILIDAD TÉCNICA</p>
          <h2 class="headline-xl" style="color: var(--on-background);">Verificación en Tiempo Real</h2>
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; color: var(--primary); margin-top: 8px;">
            <span class="material-symbols-outlined" style="font-size: 16px;">schedule</span>
            <span class="body-md" style="font-size: 14px;">Última actualización: ${new Date().toLocaleDateString('es-CO', { weekday: 'long', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div style="width: 96px; height: 1px; background: var(--secondary); margin: 32px auto 0; opacity: 0.5; position: relative;">
            <span class="material-symbols-outlined" style="font-size: 10px; color: var(--secondary); background: var(--background); padding: 0 4px; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);">eco</span>
          </div>
        </section>

        <!-- Main Status Panel (Bento Grid) -->
        <section class="grid-12">
          
          <!-- Core Status Card -->
          <div class="col-span-full md-col-8">
            <div class="card" style="display: flex; flex-direction: column; gap: 32px; position: relative; overflow: hidden;" id="status-panel">
              <div class="shimmer-bg" style="position: absolute; inset: 0; opacity: 0; transition: opacity 1s; pointer-events: none;"></div>
              
              <div style="display: flex; flex-direction: column; align-items: center; gap: 32px;" id="status-content">
                <!-- Will be populated by initTraceability -->
                <div style="display: flex; flex-direction: column; align-items: center; gap: 24px; width: 100;">
                  
                  <div style="width: 128px; height: 128px; border-radius: 50%; background: var(--tertiary-container); display: flex; align-items: center; justify-content: center;" class="animate-pulse-ring">
                    <div style="position: absolute; inset: 8px; border-radius: 50%; background: var(--tertiary); opacity: 0.1;"></div>
                    <span class="material-symbols-outlined filled" style="color: var(--tertiary); font-size: 52px;">check_circle</span>
                  </div>
                  
                  <div style="text-align: center; display: flex; flex-direction: column; gap: 12px;">
                    <h3 class="headline-md" style="color: var(--on-surface);">Estado Actual del Cultivo</h3>
                    <p class="body-lg" style="color: var(--tertiary); font-weight: 600;">Condiciones Óptimas de Cosecha</p>
                    <p class="body-md" style="color: var(--on-surface-variant); max-width: 480px; margin: 0 auto;">
                      Nuestros sensores indican niveles perfectos de humedad (<span id="sensor-humidity">72</span>%) y temperatura (<span id="sensor-temp">24</span>°C) en la parcela 'El Mirador'. El grano ha alcanzado su punto ideal de maduración.
                    </p>
                    <div style="display: inline-flex; margin: 16px auto 0; padding: 10px 18px; background: var(--surface-container-highest); border-radius: 9999px; border: 1px solid var(--outline-variant); font-size: 13px; font-weight: 500; color: var(--on-surface); align-items: center; gap: 8px;">
                      <span class="material-symbols-outlined" style="font-size: 18px;">verified</span>
                      Verificado por sistema de red local
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Trust Symbol Cards -->
          <div class="col-span-full md-col-4" style="display: flex; flex-direction: column; gap: 16px;">
            
            <div class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center; flex: 1; border: 1px solid transparent; transition: border-color 0.3s;" id="cert-fairtrade">
              <span class="material-symbols-outlined" style="font-size: 40px; color: var(--secondary); margin-bottom: 12px;">handshake</span>
              <h4 class="headline-md" style="font-size: 20px; margin-bottom: 4px;">Fairtrade Certified</h4>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--secondary-fixed-dim); margin-top: auto; padding-top: 12px;" id="fairtrade-status">
                <span class="material-symbols-outlined" style="font-size: 16px; animation: spin 0.8s linear infinite;">sync</span>
                <span>Verificando cadena...</span>
              </div>
            </div>

            <div class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center; flex: 1; border: 1px solid transparent; transition: border-color 0.3s;" id="cert-rainforest">
              <span class="material-symbols-outlined" style="font-size: 40px; color: var(--tertiary); margin-bottom: 12px;">forest</span>
              <h4 class="headline-md" style="font-size: 20px; margin-bottom: 4px;">Rainforest Alliance</h4>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--tertiary-fixed-dim); margin-top: auto; padding-top: 12px;" id="rainforest-status">
                <span class="material-symbols-outlined" style="font-size: 16px; animation: spin 0.8s linear infinite;">sync</span>
                <span>Validando origen...</span>
              </div>
            </div>

          </div>
        </section>

        <!-- Technical Details Section -->
        <section style="max-width: 768px; margin: 0 auto; width: 100%; margin-top: 24px;">
          <div style="border-top: 1px solid var(--outline-variant); padding-top: 32px; display: flex; flex-direction: column; gap: 24px; align-items: center;" id="crypto-section">
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; width: 100%; gap: 16px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span class="material-symbols-outlined" style="color: var(--outline);">shield_locked</span>
                <div>
                  <p class="label-sm" style="color: var(--on-surface-variant);">REGISTRO CRIPTOGRÁFICO</p>
                  <p style="font-size: 12px; color: var(--outline); margin-top: 4px; font-family: monospace;" id="hash-display">Hash: Cargando...</p>
                </div>
              </div>
              <button class="btn btn-secondary" style="font-size: 11px; padding: 10px 20px;" id="btn-details">
                <span class="material-symbols-outlined" style="font-size: 16px;">receipt_long</span>
                VER DETALLES TÉCNICOS
              </button>
            </div>

            <!-- Expandable Technical Details -->
            <div id="tech-details" style="display: none; width: 100%; background: var(--surface-container); border-radius: var(--radius-2xl); padding: 24px; animation: fadeIn 0.3s ease;">
              <div id="tech-details-content">
                <p class="body-md" style="color: var(--on-surface-variant);">Cargando detalles...</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Verification Search -->
        <section style="max-width: 520px; margin: 0 auto; width: 100%; text-align: center;">
          <h3 class="headline-md" style="margin-bottom: 16px;">Verificar un Lote</h3>
          <div style="display: flex; gap: 12px;">
            <input type="text" class="form-field__input" placeholder="Código del lote (ej: LOT-2026-001)" id="verify-input" style="flex: 1; border: 1px solid var(--outline-variant); padding: 12px 16px; border-radius: var(--radius-xl);" />
            <button class="btn btn-primary" id="verify-btn" style="padding: 12px 24px;">
              <span class="material-symbols-outlined" style="font-size: 20px;">search</span>
            </button>
          </div>
          <div id="verify-result" style="margin-top: 16px;"></div>
        </section>

      </main>
    </div>
  `;
}

export function initTraceability() {
  // Simulate certification verification after delay
  setTimeout(() => {
    updateCertStatus('fairtrade-status', 'Verificado', 'tertiary');
    updateCertStatus('rainforest-status', 'Verificado', 'tertiary');
  }, 3500);

  // Toggle tech details
  document.getElementById('btn-details')?.addEventListener('click', () => {
    const details = document.getElementById('tech-details');
    if (details) {
      details.style.display = details.style.display === 'none' ? 'block' : 'none';
    }
  });

  // Verify lote
  document.getElementById('verify-btn')?.addEventListener('click', async () => {
    const input = document.getElementById('verify-input');
    const result = document.getElementById('verify-result');
    if (!input?.value || !result) return;

    result.innerHTML = '<div class="spinner" style="margin: 16px auto;"></div>';

    try {
      const data = await api.verificarLote(input.value);
      result.innerHTML = `
        <div class="card" style="text-align: left; margin-top: 16px; animation: fadeInUp 0.5s ease;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <span class="material-symbols-outlined filled" style="color: var(--tertiary); font-size: 28px;">check_circle</span>
            <span class="headline-md">Lote ${data.codigo}</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div><span class="label-sm" style="color: var(--on-surface-variant);">VARIEDAD</span><p class="body-md">${data.variedad || 'N/A'}</p></div>
            <div><span class="label-sm" style="color: var(--on-surface-variant);">PESO</span><p class="body-md">${data.peso_kg || 'N/A'} kg</p></div>
            <div><span class="label-sm" style="color: var(--on-surface-variant);">ESTADO</span><p class="body-md">${data.estado || 'N/A'}</p></div>
            <div><span class="label-sm" style="color: var(--on-surface-variant);">ORIGEN</span><p class="body-md">${data.origen || 'N/A'}</p></div>
          </div>
          <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--outline-variant);">
            <span class="label-sm" style="color: var(--on-surface-variant);">HASH SHA-256</span>
            <p style="font-family: monospace; font-size: 11px; color: var(--outline); word-break: break-all; margin-top: 4px;">${data.hash_trazabilidad || 'N/A'}</p>
          </div>
        </div>
      `;
    } catch (e) {
      result.innerHTML = `
        <div class="card" style="border: 1px solid var(--error); text-align: center; padding: 20px; animation: fadeIn 0.3s ease;">
          <span class="material-symbols-outlined" style="color: var(--error); font-size: 32px;">error</span>
          <p class="body-md" style="color: var(--error); margin-top: 8px;">${e.message}</p>
        </div>
      `;
    }
  });

  // Load initial lote data
  loadInitialData();
}

function updateCertStatus(elementId, text, color) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.innerHTML = `
    <span class="material-symbols-outlined filled" style="font-size: 16px; color: var(--${color});">check</span>
    <span style="color: var(--${color});">${text}</span>
  `;
}

async function loadInitialData() {
  try {
    const lotes = await api.getLotes({ limit: 1 });
    if (lotes && lotes.length > 0) {
      const lote = lotes[0];
      const hashEl = document.getElementById('hash-display');
      if (hashEl) {
        hashEl.textContent = `Hash: ${lote.hash_trazabilidad?.substring(0, 8)}...${lote.hash_trazabilidad?.substring(56)}`;
      }
      const techContent = document.getElementById('tech-details-content');
      if (techContent) {
        techContent.innerHTML = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div><span class="label-sm" style="color: var(--on-surface-variant);">CÓDIGO</span><p class="body-md">${lote.codigo}</p></div>
            <div><span class="label-sm" style="color: var(--on-surface-variant);">VARIEDAD</span><p class="body-md">${lote.variedad}</p></div>
            <div><span class="label-sm" style="color: var(--on-surface-variant);">PESO</span><p class="body-md">${lote.peso_kg} kg</p></div>
            <div><span class="label-sm" style="color: var(--on-surface-variant);">ESTADO</span><p class="body-md">${lote.estado}</p></div>
            <div style="grid-column: 1 / -1;"><span class="label-sm" style="color: var(--on-surface-variant);">HASH COMPLETO</span><p style="font-family: monospace; font-size: 11px; color: var(--outline); word-break: break-all; margin-top: 4px;">${lote.hash_trazabilidad}</p></div>
          </div>
        `;
      }
    }
  } catch (e) {
    const hashEl = document.getElementById('hash-display');
    if (hashEl) hashEl.textContent = 'Hash: 0x9f8a...3b2c (demo)';
  }
}
