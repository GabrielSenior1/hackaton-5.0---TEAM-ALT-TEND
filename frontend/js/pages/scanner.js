/**
 * 📱 QR Scanner Page — Camera-based QR code scanning
 * Uses html5-qrcode library for camera access
 */

import api from '../api.js';

let html5QrCode = null;

export function renderScanner() {
  return `
    <div class="page-content">
      <main class="container" style="padding-top: 40px; padding-bottom: 60px; display: flex; flex-direction: column; align-items: center; gap: 40px;">
        
        <!-- Header -->
        <section style="text-align: center; display: flex; flex-direction: column; gap: 16px; max-width: 480px;">
          <div style="width: 80px; height: 80px; border-radius: 50%; background: var(--secondary-container); display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span class="material-symbols-outlined filled" style="color: var(--on-secondary-container); font-size: 36px;">qr_code_scanner</span>
          </div>
          <h2 class="headline-xl gold-gradient-text">Escanear QR</h2>
          <p class="body-md" style="color: var(--on-surface-variant);">
            Apunta la cámara al código QR en tu producto para verificar su origen y autenticidad.
          </p>
        </section>

        <!-- Scanner Container -->
        <section style="width: 100%; max-width: 500px;">
          <div class="qr-scanner-container" id="qr-reader" style="min-height: 350px; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center; padding: 40px; color: var(--inverse-on-surface);">
              <span class="material-symbols-outlined" style="font-size: 48px; opacity: 0.5; display: block; margin-bottom: 16px;">videocam</span>
              <p class="body-md" style="opacity: 0.7;">Presiona el botón para iniciar la cámara</p>
            </div>
          </div>
          
          <div style="display: flex; gap: 12px; margin-top: 20px;">
            <button class="btn btn-primary btn-full" id="start-scan" style="border-radius: var(--radius-xl);">
              <span class="material-symbols-outlined">photo_camera</span>
              INICIAR CÁMARA
            </button>
            <button class="btn btn-secondary" id="stop-scan" style="border-radius: var(--radius-xl); display: none; padding: 14px 20px;">
              <span class="material-symbols-outlined">stop</span>
            </button>
          </div>
        </section>

        <!-- Manual Input -->
        <section style="width: 100%; max-width: 500px;">
          <div style="position: relative; display: flex; align-items: center;">
            <div style="flex: 1; height: 1px; background: var(--outline-variant);"></div>
            <span class="label-sm" style="padding: 0 16px; color: var(--on-surface-variant);">O INGRESA EL CÓDIGO</span>
            <div style="flex: 1; height: 1px; background: var(--outline-variant);"></div>
          </div>
          <div style="display: flex; gap: 12px; margin-top: 20px;">
            <input type="text" class="form-field__input" placeholder="LOT-2026-001" id="manual-code" 
              style="flex: 1; border: 1px solid var(--outline-variant); padding: 14px 16px; border-radius: var(--radius-xl);" />
            <button class="btn btn-gold" id="manual-verify" style="padding: 14px 24px; border-radius: var(--radius-xl);">
              <span class="material-symbols-outlined">verified_user</span>
            </button>
          </div>
        </section>

        <!-- Scan Result -->
        <section style="width: 100%; max-width: 500px;" id="scan-result-container">
        </section>

      </main>
    </div>
  `;
}

export function initScanner() {
  const startBtn = document.getElementById('start-scan');
  const stopBtn = document.getElementById('stop-scan');
  const manualBtn = document.getElementById('manual-verify');
  const manualInput = document.getElementById('manual-code');

  startBtn?.addEventListener('click', startScanning);
  stopBtn?.addEventListener('click', stopScanning);
  
  manualBtn?.addEventListener('click', () => {
    if (manualInput?.value) {
      processCode(manualInput.value.trim());
    }
  });

  manualInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && manualInput.value) {
      processCode(manualInput.value.trim());
    }
  });
}

async function startScanning() {
  const startBtn = document.getElementById('start-scan');
  const stopBtn = document.getElementById('stop-scan');
  const readerEl = document.getElementById('qr-reader');

  if (!readerEl) return;

  // Load html5-qrcode dynamically
  if (!window.Html5Qrcode) {
    try {
      await loadScript('https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js');
    } catch (e) {
      showScanResult('error', 'Error', 'No se pudo cargar el escáner. Usa el campo manual.');
      return;
    }
  }

  try {
    readerEl.innerHTML = '';
    html5QrCode = new window.Html5Qrcode('qr-reader');
    
    await html5QrCode.start(
      { facingMode: 'environment' },
      {
        fps: 10,
        qrbox: { width: 220, height: 220 },
      },
      (decodedText) => {
        // Extract lote code from QR URL or plain text
        const code = extractCode(decodedText);
        stopScanning();
        processCode(code);
      },
      () => {} // ignore errors during scanning
    );

    if (startBtn) startBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'flex';
  } catch (err) {
    console.error('Scanner error:', err);
    showScanResult('error', 'Error de Cámara', 'No se pudo acceder a la cámara. Verifica los permisos o usa el campo manual.');
  }
}

async function stopScanning() {
  const startBtn = document.getElementById('start-scan');
  const stopBtn = document.getElementById('stop-scan');

  if (html5QrCode) {
    try {
      await html5QrCode.stop();
    } catch (e) { /* ignore */ }
    html5QrCode = null;
  }

  if (startBtn) startBtn.style.display = 'flex';
  if (stopBtn) stopBtn.style.display = 'none';
}

function extractCode(text) {
  // Try to extract lote code from URL patterns
  const urlMatch = text.match(/verificar\/([^?&]+)/);
  if (urlMatch) return urlMatch[1];
  
  const lotMatch = text.match(/LOT-\d{4}-\d{3}/i);
  if (lotMatch) return lotMatch[0];
  
  return text;
}

async function processCode(code) {
  const container = document.getElementById('scan-result-container');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center; padding: 32px;">
      <div class="spinner" style="margin: 0 auto 16px;"></div>
      <p class="body-md" style="color: var(--on-surface-variant);">Verificando lote ${code}...</p>
    </div>
  `;

  try {
    const data = await api.verificarLote(code);
    showScanResult('success', `Lote ${data.codigo} Verificado`, '', data);
  } catch (error) {
    showScanResult('error', 'No Encontrado', `No se pudo verificar el código "${code}". ${error.message}`);
  }
}

function showScanResult(type, title, message, data = null) {
  const container = document.getElementById('scan-result-container');
  if (!container) return;

  const isSuccess = type === 'success';
  const icon = isSuccess ? 'check_circle' : 'error';
  const color = isSuccess ? 'var(--tertiary)' : 'var(--error)';

  let detailsHtml = '';
  if (data) {
    detailsHtml = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--outline-variant);">
        <div><span class="label-sm" style="color: var(--on-surface-variant);">VARIEDAD</span><p class="body-md">${data.variedad || 'N/A'}</p></div>
        <div><span class="label-sm" style="color: var(--on-surface-variant);">PESO</span><p class="body-md">${data.peso_kg || 'N/A'} kg</p></div>
        <div><span class="label-sm" style="color: var(--on-surface-variant);">ESTADO</span><p class="body-md">${data.estado || 'N/A'}</p></div>
        <div><span class="label-sm" style="color: var(--on-surface-variant);">ORIGEN</span><p class="body-md">${data.origen || 'N/A'}</p></div>
      </div>
      <div style="margin-top: 16px; display: flex; gap: 8px;">
        <button class="btn btn-primary btn-full" style="border-radius: var(--radius-xl);" data-nav="traceability">
          <span class="material-symbols-outlined">verified_user</span>
          VER TRAZABILIDAD COMPLETA
        </button>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="card" style="animation: fadeInUp 0.5s ease; ${isSuccess ? '' : 'border: 1px solid var(--error);'}">
      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: ${data ? '0' : '8'}px;">
        <span class="material-symbols-outlined filled" style="color: ${color}; font-size: 32px;">${icon}</span>
        <div>
          <h3 class="headline-md" style="font-size: 20px;">${title}</h3>
          ${message ? `<p class="body-md" style="color: var(--on-surface-variant); margin-top: 4px;">${message}</p>` : ''}
        </div>
      </div>
      ${detailsHtml}
    </div>
  `;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function cleanupScanner() {
  stopScanning();
}
