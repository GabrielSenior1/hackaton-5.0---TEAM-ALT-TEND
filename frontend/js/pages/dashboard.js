/**
 * 📊 Dashboard Principal — Admin Panel
 * Full management dashboard with KPIs, tables, timeline, and QR generation
 */

import api from '../api.js';
import { subscribeSensorData } from '../firebase.js';

export function renderDashboard() {
  return `
    <div class="page-content">
      <main class="container" style="padding-top: 32px; padding-bottom: 60px; display: flex; flex-direction: column; gap: 28px;">
        
        <!-- Dashboard Header -->
        <section style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div>
            <h2 class="headline-lg" style="color: var(--on-background);">Dashboard</h2>
            <p class="body-md" style="color: var(--on-surface-variant); margin-top: 4px;">Panel de control — Cacao de la Sierra</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary" style="padding: 10px 18px; font-size: 11px; border-radius: var(--radius-xl);" id="btn-refresh-dashboard">
              <span class="material-symbols-outlined" style="font-size: 18px;">refresh</span>
              ACTUALIZAR
            </button>
            <button class="btn btn-primary" style="padding: 10px 18px; font-size: 11px; border-radius: var(--radius-xl);" data-nav="scanner">
              <span class="material-symbols-outlined" style="font-size: 18px;">qr_code_scanner</span>
              ESCANEAR
            </button>
          </div>
        </section>

        <!-- KPI Cards -->
        <section class="dashboard-grid" id="kpi-section">
          <div class="kpi-card animate-fade-in-up stagger-1" style="opacity: 0;">
            <div class="kpi-card__icon kpi-card__icon--green">
              <span class="material-symbols-outlined filled">group</span>
            </div>
            <div class="kpi-card__value" id="kpi-productores">—</div>
            <div class="kpi-card__label">Productores Activos</div>
            <div class="kpi-card__trend kpi-card__trend--up">
              <span class="material-symbols-outlined" style="font-size: 14px;">trending_up</span>
              Activos
            </div>
          </div>

          <div class="kpi-card animate-fade-in-up stagger-2" style="opacity: 0;">
            <div class="kpi-card__icon kpi-card__icon--gold">
              <span class="material-symbols-outlined filled">inventory_2</span>
            </div>
            <div class="kpi-card__value" id="kpi-lotes">—</div>
            <div class="kpi-card__label">Lotes Registrados</div>
            <div class="kpi-card__trend kpi-card__trend--up">
              <span class="material-symbols-outlined" style="font-size: 14px;">trending_up</span>
              Trazados
            </div>
          </div>

          <div class="kpi-card animate-fade-in-up stagger-3" style="opacity: 0;">
            <div class="kpi-card__icon kpi-card__icon--surface">
              <span class="material-symbols-outlined filled">verified</span>
            </div>
            <div class="kpi-card__value" id="kpi-certs">—</div>
            <div class="kpi-card__label">Certificaciones</div>
            <div class="kpi-card__trend kpi-card__trend--up">
              <span class="material-symbols-outlined" style="font-size: 14px;">check</span>
              Vigentes
            </div>
          </div>

          <div class="kpi-card animate-fade-in-up stagger-4" style="opacity: 0;">
            <div class="kpi-card__icon kpi-card__icon--green">
              <span class="material-symbols-outlined filled">sensors</span>
            </div>
            <div class="kpi-card__value" id="kpi-temp">—°C</div>
            <div class="kpi-card__label">Temperatura Actual</div>
            <div class="kpi-card__trend kpi-card__trend--up">
              <span class="material-symbols-outlined" style="font-size: 14px;">thermostat</span>
              <span id="kpi-humidity">— %H</span>
            </div>
          </div>
        </section>

        <!-- Main Content Grid -->
        <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">

          <!-- Lotes Table -->
          <section class="dashboard-section" style="grid-column: 1 / -1;">
            <div class="dashboard-section__header">
              <h3 class="dashboard-section__title">
                <span class="material-symbols-outlined" style="color: var(--secondary); vertical-align: middle; margin-right: 6px;">inventory_2</span>
                Lotes de Cacao
              </h3>
              <button class="btn btn-gold" style="padding: 8px 16px; font-size: 10px; border-radius: var(--radius-xl);" id="btn-new-lote">
                <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
                NUEVO LOTE
              </button>
            </div>
            <div style="overflow-x: auto; border-radius: var(--radius-lg);">
              <table class="data-table" id="lotes-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Variedad</th>
                    <th>Peso (kg)</th>
                    <th>Estado</th>
                    <th>Productor</th>
                    <th>Calidad</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody id="lotes-tbody">
                  <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                      <div class="spinner" style="margin: 0 auto 12px;"></div>
                      <p class="body-md" style="color: var(--on-surface-variant);">Cargando lotes...</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- 2-Column layout for smaller sections -->
          <div class="grid-12" style="grid-column: 1 / -1;">

            <!-- Productores List -->
            <div class="col-span-full md-col-6">
              <section class="dashboard-section" style="height: 100%;">
                <div class="dashboard-section__header">
                  <h3 class="dashboard-section__title">
                    <span class="material-symbols-outlined" style="color: var(--tertiary); vertical-align: middle; margin-right: 6px;">group</span>
                    Productores
                  </h3>
                </div>
                <div id="productores-list" style="display: flex; flex-direction: column; gap: 12px; max-height: 380px; overflow-y: auto;" class="hide-scrollbar">
                  <div style="text-align: center; padding: 32px;">
                    <div class="spinner" style="margin: 0 auto;"></div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Activity Timeline -->
            <div class="col-span-full md-col-6">
              <section class="dashboard-section" style="height: 100%;">
                <div class="dashboard-section__header">
                  <h3 class="dashboard-section__title">
                    <span class="material-symbols-outlined" style="color: var(--secondary); vertical-align: middle; margin-right: 6px;">history</span>
                    Actividad Reciente
                  </h3>
                </div>
                <div id="activity-timeline" class="timeline" style="max-height: 380px; overflow-y: auto;">
                  <div style="text-align: center; padding: 32px;">
                    <div class="spinner" style="margin: 0 auto;"></div>
                  </div>
                </div>
              </section>
            </div>

          </div>

          <!-- QR Generator -->
          <div class="grid-12" style="grid-column: 1 / -1;">
            <div class="col-span-full md-col-6">
              <section class="dashboard-section">
                <div class="dashboard-section__header">
                  <h3 class="dashboard-section__title">
                    <span class="material-symbols-outlined" style="color: var(--secondary); vertical-align: middle; margin-right: 6px;">qr_code_2</span>
                    Generador QR Rápido
                  </h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                  <div class="form-field">
                    <label class="form-field__label">Tipo</label>
                    <select class="form-field__select" id="qr-type" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);">
                      <option value="productor">Productor</option>
                      <option value="lote">Lote</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label class="form-field__label" id="qr-id-label">ID del Productor</label>
                    <input type="text" class="form-field__input" id="qr-id-input" placeholder="1" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);" />
                  </div>
                  <button class="btn btn-primary btn-full" id="btn-gen-qr" style="border-radius: var(--radius-xl);">
                    <span class="material-symbols-outlined">qr_code</span>
                    GENERAR QR
                  </button>
                </div>
              </section>
            </div>

            <!-- QR Result -->
            <div class="col-span-full md-col-6">
              <section class="dashboard-section" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 260px;" id="qr-result-section">
                <span class="material-symbols-outlined" style="font-size: 64px; color: var(--outline-variant); opacity: 0.5;">qr_code_2</span>
                <p class="body-md" style="color: var(--on-surface-variant); margin-top: 12px;">El QR aparecerá aquí</p>
              </section>
            </div>
          </div>

          <!-- Sensor Data (Firebase) -->
          <section class="dashboard-section" style="grid-column: 1 / -1;">
            <div class="dashboard-section__header">
              <h3 class="dashboard-section__title">
                <span class="material-symbols-outlined" style="color: var(--tertiary); vertical-align: middle; margin-right: 6px;">sensors</span>
                Datos de Sensores (Tiempo Real)
              </h3>
              <span class="label-sm" style="color: var(--tertiary); background: var(--tertiary-container); padding: 4px 12px; border-radius: 9999px;" id="sensor-status">🔴 Offline</span>
            </div>
            <div id="sensor-data-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;">
              <div class="card-flat" style="text-align: center; padding: 20px;">
                <p class="body-md" style="color: var(--on-surface-variant);">Conectando sensores...</p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  `;
}

export function initDashboard() {
  loadDashboardData();
  initQRGenerator();
  initSensorData();

  document.getElementById('btn-refresh-dashboard')?.addEventListener('click', () => {
    loadDashboardData();
  });
}

async function loadDashboardData() {
  try {
    const [productores, lotes, certs] = await Promise.allSettled([
      api.getProductores(),
      api.getLotes(),
      api.getCertificaciones(),
    ]);

    // Update KPIs
    const prodData = productores.status === 'fulfilled' ? productores.value : [];
    const loteData = lotes.status === 'fulfilled' ? lotes.value : [];
    const certData = certs.status === 'fulfilled' ? certs.value : [];

    animateKPI('kpi-productores', prodData.length);
    animateKPI('kpi-lotes', loteData.length);
    animateKPI('kpi-certs', certData.length);

    // Render Lotes Table
    renderLotesTable(loteData, prodData);

    // Render Productores List
    renderProductoresList(prodData);

    // Render Activity Timeline
    renderTimeline(loteData, prodData);

  } catch (e) {
    console.error('Dashboard data load error:', e);
    renderEmptyStates();
  }
}

function animateKPI(elementId, value) {
  const el = document.getElementById(elementId);
  if (!el) return;

  let current = 0;
  const target = typeof value === 'number' ? value : parseInt(value) || 0;
  const duration = 800;
  const steps = 30;
  const increment = target / steps;
  const stepTime = duration / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    if (elementId === 'kpi-temp') {
      el.textContent = `${Math.round(current)}°C`;
    } else {
      el.textContent = Math.round(current);
    }
  }, stepTime);
}

function renderLotesTable(lotes, productores) {
  const tbody = document.getElementById('lotes-tbody');
  if (!tbody) return;

  if (lotes.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="7" style="text-align: center; padding: 40px;">
        <span class="material-symbols-outlined" style="font-size: 48px; color: var(--outline-variant); opacity: 0.5;">inventory_2</span>
        <p class="body-md" style="color: var(--on-surface-variant); margin-top: 12px;">No hay lotes registrados</p>
        <p class="label-sm" style="color: var(--outline); margin-top: 4px;">Crea el primer lote desde la API</p>
      </td></tr>
    `;
    return;
  }

  const prodMap = {};
  productores.forEach(p => prodMap[p.id] = p.nombre);

  const statusClasses = {
    'registrado': 'status-badge--active',
    'en_proceso': 'status-badge--pending',
    'exportado': 'status-badge--exported',
    'vendido': 'status-badge--sold',
  };

  tbody.innerHTML = lotes.map(lote => `
    <tr>
      <td style="font-weight: 600; font-family: monospace; font-size: 13px;">${lote.codigo}</td>
      <td>${lote.variedad}</td>
      <td>${lote.peso_kg}</td>
      <td>
        <span class="status-badge ${statusClasses[lote.estado] || 'status-badge--active'}">
          ${lote.estado?.replace('_', ' ') || 'N/A'}
        </span>
      </td>
      <td>${prodMap[lote.productor_id] || `#${lote.productor_id}`}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 6px;">
          <div style="width: 48px; height: 5px; background: var(--surface-container-highest); border-radius: 9999px; overflow: hidden;">
            <div style="width: ${lote.puntaje_calidad || 0}%; height: 100%; background: ${(lote.puntaje_calidad || 0) > 80 ? 'var(--tertiary)' : 'var(--secondary)'}; border-radius: 9999px;"></div>
          </div>
          <span style="font-size: 12px; font-weight: 600; color: var(--on-surface-variant);">${lote.puntaje_calidad || '—'}</span>
        </div>
      </td>
      <td>
        <div style="display: flex; gap: 4px;">
          <button class="qr-lote-btn" data-codigo="${lote.codigo}" style="width: 32px; height: 32px; border-radius: 50%; background: var(--surface-container-highest); display: flex; align-items: center; justify-content: center; transition: all 0.2s;" title="Generar QR">
            <span class="material-symbols-outlined" style="font-size: 16px; color: var(--secondary);">qr_code</span>
          </button>
          <button style="width: 32px; height: 32px; border-radius: 50%; background: var(--surface-container-highest); display: flex; align-items: center; justify-content: center; transition: all 0.2s;" title="Ver detalles" data-nav="traceability">
            <span class="material-symbols-outlined" style="font-size: 16px; color: var(--primary);">visibility</span>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  // Add QR button handlers
  tbody.querySelectorAll('.qr-lote-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const codigo = btn.dataset.codigo;
      try {
        const result = await api.getQrLote(codigo);
        renderQRResult(`Lote: ${codigo}`, result.qr_url);
      } catch (e) {
        console.error('QR generation error:', e);
      }
    });
  });
}

function renderProductoresList(productores) {
  const container = document.getElementById('productores-list');
  if (!container) return;

  if (productores.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 32px;">
        <span class="material-symbols-outlined" style="font-size: 48px; color: var(--outline-variant); opacity: 0.5;">group</span>
        <p class="body-md" style="color: var(--on-surface-variant); margin-top: 12px;">No hay productores</p>
      </div>
    `;
    return;
  }

  container.innerHTML = productores.map(p => `
    <div style="display: flex; align-items: center; gap: 14px; padding: 14px; background: var(--surface-container-low); border-radius: var(--radius-xl); transition: all 0.2s; cursor: pointer;" 
         onmouseover="this.style.background='var(--surface-container-high)'; this.style.transform='translateX(4px)'"
         onmouseout="this.style.background='var(--surface-container-low)'; this.style.transform='translateX(0)'"
         data-nav="story">
      <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--tertiary-container); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <span class="material-symbols-outlined" style="color: var(--on-tertiary-container); font-size: 22px;">person</span>
      </div>
      <div style="flex: 1; min-width: 0;">
        <p style="font-weight: 600; font-size: 14px; color: var(--on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.nombre}</p>
        <p style="font-size: 12px; color: var(--on-surface-variant);">${p.finca} · ${p.ubicacion}</p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
        <span style="font-size: 11px; color: var(--outline);">${p.altitud_msnm ? p.altitud_msnm + ' msnm' : ''}</span>
        <span style="font-size: 11px; color: ${p.activo ? 'var(--tertiary)' : 'var(--error)'}; font-weight: 600;">${p.activo ? '● Activo' : '○ Inactivo'}</span>
      </div>
    </div>
  `).join('');
}

function renderTimeline(lotes, productores) {
  const container = document.getElementById('activity-timeline');
  if (!container) return;

  // Generate activity entries from lotes
  const activities = [];

  lotes.slice(0, 8).forEach(l => {
    activities.push({
      time: l.fecha_registro ? new Date(l.fecha_registro).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }) : 'Reciente',
      content: `Lote ${l.codigo} registrado`,
      detail: `${l.variedad} · ${l.peso_kg}kg · ${l.estado}`,
    });
  });

  productores.slice(0, 4).forEach(p => {
    activities.push({
      time: p.fecha_registro ? new Date(p.fecha_registro).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }) : 'Reciente',
      content: `Productor ${p.nombre} registrado`,
      detail: `${p.finca} · ${p.ubicacion}`,
    });
  });

  if (activities.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 32px;">
        <span class="material-symbols-outlined" style="font-size: 48px; color: var(--outline-variant); opacity: 0.5;">history</span>
        <p class="body-md" style="color: var(--on-surface-variant); margin-top: 12px;">Sin actividad reciente</p>
      </div>
    `;
    container.className = '';
    return;
  }

  container.innerHTML = activities.slice(0, 10).map((a, i) => `
    <div class="timeline__item" style="animation-delay: ${0.1 * (i + 1)}s;">
      <div class="timeline__time">${a.time}</div>
      <div class="timeline__content">${a.content}</div>
      <div class="timeline__detail">${a.detail}</div>
    </div>
  `).join('');
}

function initQRGenerator() {
  const typeSelect = document.getElementById('qr-type');
  const idLabel = document.getElementById('qr-id-label');
  const idInput = document.getElementById('qr-id-input');
  const genBtn = document.getElementById('btn-gen-qr');

  typeSelect?.addEventListener('change', () => {
    if (idLabel) {
      idLabel.textContent = typeSelect.value === 'productor' ? 'ID del Productor' : 'Código del Lote';
    }
    if (idInput) {
      idInput.placeholder = typeSelect.value === 'productor' ? '1' : 'LOT-2026-001';
    }
  });

  genBtn?.addEventListener('click', async () => {
    const type = typeSelect?.value;
    const id = idInput?.value;
    if (!id) return;

    genBtn.disabled = true;
    genBtn.innerHTML = '<div class="spinner" style="width: 18px; height: 18px; border-width: 2px;"></div> Generando...';

    try {
      let result;
      if (type === 'productor') {
        result = await api.getQrProductor(id);
        renderQRResult(`Productor #${id}`, result.qr_url);
      } else {
        result = await api.getQrLote(id);
        renderQRResult(`Lote: ${id}`, result.qr_url);
      }
    } catch (e) {
      const container = document.getElementById('qr-result-section');
      if (container) {
        container.innerHTML = `
          <span class="material-symbols-outlined" style="font-size: 48px; color: var(--error);">error</span>
          <p class="body-md" style="color: var(--error); margin-top: 12px;">${e.message}</p>
        `;
      }
    } finally {
      genBtn.disabled = false;
      genBtn.innerHTML = '<span class="material-symbols-outlined">qr_code</span> GENERAR QR';
    }
  });
}

function renderQRResult(title, qrUrl) {
  const container = document.getElementById('qr-result-section');
  if (!container) return;

  const imgSrc = qrUrl.startsWith('/') ? `http://localhost:8000${qrUrl}` : qrUrl;

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; animation: fadeInScale 0.4s ease;">
      <p class="label-sm" style="color: var(--secondary);">${title}</p>
      <div style="padding: 16px; background: white; border-radius: var(--radius-xl); box-shadow: var(--shadow-md);">
        <img src="${imgSrc}" alt="QR Code" style="width: 180px; height: 180px; image-rendering: pixelated;" onerror="this.parentElement.innerHTML='<div style=\\'width:180px;height:180px;display:flex;align-items:center;justify-content:center;background:var(--surface-container-highest);border-radius:8px;\\'>  <span class=\\'material-symbols-outlined\\' style=\\'font-size:48px;color:var(--outline);\\'>qr_code_2</span></div>'" />
      </div>
      <p class="label-sm" style="color: var(--on-surface-variant);">QR generado exitosamente</p>
    </div>
  `;
}

function initSensorData() {
  const statusEl = document.getElementById('sensor-status');
  const gridEl = document.getElementById('sensor-data-grid');

  subscribeSensorData((data) => {
    if (statusEl) {
      statusEl.textContent = '🟢 Conectado';
      statusEl.style.color = 'var(--tertiary)';
    }

    if (data && data.length > 0 && gridEl) {
      // Update KPI
      const firstSensor = data[0];
      animateKPI('kpi-temp', firstSensor.temperatura || 24);
      const humEl = document.getElementById('kpi-humidity');
      if (humEl) humEl.textContent = `${firstSensor.humedad || 72}% H`;

      gridEl.innerHTML = data.map(sensor => `
        <div class="card-flat" style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; font-size: 14px; color: var(--on-surface);">${sensor.parcela || 'Parcela'}</span>
            <span class="material-symbols-outlined" style="font-size: 18px; color: var(--tertiary);">sensors</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <p class="label-sm" style="color: var(--on-surface-variant);">TEMP</p>
              <p style="font-size: 24px; font-weight: 700; font-family: 'Playfair Display', serif; color: var(--on-surface);">${sensor.temperatura || '—'}°</p>
            </div>
            <div>
              <p class="label-sm" style="color: var(--on-surface-variant);">HUMEDAD</p>
              <p style="font-size: 24px; font-weight: 700; font-family: 'Playfair Display', serif; color: var(--tertiary);">${sensor.humedad || '—'}%</p>
            </div>
          </div>
          <div style="width: 100%; height: 4px; background: var(--surface-container-highest); border-radius: 9999px; overflow: hidden;">
            <div style="width: ${sensor.humedad || 0}%; height: 100%; background: linear-gradient(to right, var(--secondary), var(--tertiary)); border-radius: 9999px; transition: width 0.5s ease;"></div>
          </div>
        </div>
      `).join('');
    }
  });
}

function renderEmptyStates() {
  animateKPI('kpi-productores', 0);
  animateKPI('kpi-lotes', 0);
  animateKPI('kpi-certs', 0);
  renderLotesTable([], []);
  renderProductoresList([]);
  renderTimeline([], []);
}
