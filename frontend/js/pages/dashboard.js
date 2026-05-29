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
            <h2 class="headline-lg" style="color: var(--on-background);">${t('dashboard.title')}</h2>
            <p class="body-md" style="color: var(--on-surface-variant); margin-top: 4px;">${t('dashboard.subtitle')}</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary" style="padding: 10px 18px; font-size: 11px; border-radius: var(--radius-xl);" id="btn-refresh-dashboard">
              <span class="material-symbols-outlined" style="font-size: 18px;">refresh</span>
              ${t('dashboard.refresh')}
            </button>
            <button class="btn btn-primary" style="padding: 10px 18px; font-size: 11px; border-radius: var(--radius-xl);" data-nav="scanner">
              <span class="material-symbols-outlined" style="font-size: 18px;">qr_code_scanner</span>
              ${t('dashboard.scan')}
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
            <div class="kpi-card__label">${t('dashboard.kpi.producers')}</div>
            <div class="kpi-card__trend kpi-card__trend--up">
              <span class="material-symbols-outlined" style="font-size: 14px;">trending_up</span>
              ${t('dashboard.kpi.active')}
            </div>
          </div>

          <div class="kpi-card animate-fade-in-up stagger-2" style="opacity: 0;">
            <div class="kpi-card__icon kpi-card__icon--gold">
              <span class="material-symbols-outlined filled">inventory_2</span>
            </div>
            <div class="kpi-card__value" id="kpi-lotes">—</div>
            <div class="kpi-card__label">${t('dashboard.kpi.batches')}</div>
            <div class="kpi-card__trend kpi-card__trend--up">
              <span class="material-symbols-outlined" style="font-size: 14px;">trending_up</span>
              ${t('dashboard.kpi.traced')}
            </div>
          </div>

          <div class="kpi-card animate-fade-in-up stagger-3" style="opacity: 0;">
            <div class="kpi-card__icon kpi-card__icon--surface">
              <span class="material-symbols-outlined filled">verified</span>
            </div>
            <div class="kpi-card__value" id="kpi-certs">—</div>
            <div class="kpi-card__label">${t('dashboard.kpi.certs')}</div>
            <div class="kpi-card__trend kpi-card__trend--up">
              <span class="material-symbols-outlined" style="font-size: 14px;">check</span>
              ${t('dashboard.kpi.valid')}
            </div>
          </div>

          <div class="kpi-card animate-fade-in-up stagger-4" style="opacity: 0;">
            <div class="kpi-card__icon kpi-card__icon--green">
              <span class="material-symbols-outlined filled">sensors</span>
            </div>
            <div class="kpi-card__value" id="kpi-temp">—°C</div>
            <div class="kpi-card__label">${t('dashboard.kpi.temp')}</div>
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
                ${t('dashboard.kpi.batches')}
              </h3>
              <button class="btn btn-gold" style="padding: 8px 16px; font-size: 10px; border-radius: var(--radius-xl);" id="btn-new-lote">
                <span class="material-symbols-outlined" style="font-size: 16px;">add</span>
                ${t('dashboard.saveBatch')}
              </button>
            </div>
            <div style="overflow-x: auto; border-radius: var(--radius-lg);">
              <table class="data-table" id="lotes-table">
                <thead>
                  <tr>
                    <th>${t('dashboard.table.code')}</th>
                    <th>${t('dashboard.table.variety')}</th>
                    <th>${t('dashboard.table.weight')}</th>
                    <th>${t('dashboard.table.status')}</th>
                    <th>${t('dashboard.table.producer')}</th>
                    <th>${t('dashboard.table.quality')}</th>
                    <th>${t('dashboard.table.actions')}</th>
                  </tr>
                </thead>
                <tbody id="lotes-tbody">
                  <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                      <div class="spinner" style="margin: 0 auto 12px;"></div>
                      <p class="body-md" style="color: var(--on-surface-variant);">${t('dashboard.loading')}</p>
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
                <div class="dashboard-section__header" style="display: flex; justify-content: space-between; align-items: center;">
                  <h3 class="dashboard-section__title">
                    <span class="material-symbols-outlined" style="color: var(--tertiary); vertical-align: middle; margin-right: 6px;">group</span>
                    ${t('dashboard.producers')}
                  </h3>
                  <button class="btn btn-primary" style="padding: 6px 12px; font-size: 10px; border-radius: var(--radius-xl); background: var(--tertiary); color: var(--on-tertiary);" id="btn-new-productor">
                    <span class="material-symbols-outlined" style="font-size: 14px;">person_add</span>
                    ${t('dashboard.new')}
                  </button>
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
                    ${t('dashboard.recentActivity')}
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
                    ${t('dashboard.qrGenerator')}
                  </h3>
                </div>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                  <div class="form-field">
                    <label class="form-field__label">${t('dashboard.qrType')}</label>
                    <select class="form-field__select" id="qr-type" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);">
                      <option value="productor">${t('dashboard.qrProducer')}</option>
                      <option value="lote">${t('dashboard.qrBatch')}</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label class="form-field__label" id="qr-id-label">${t('dashboard.qrProducerId')}</label>
                    <input type="text" class="form-field__input" id="qr-id-input" placeholder="1" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);" />
                  </div>
                  <button class="btn btn-primary btn-full" id="btn-gen-qr" style="border-radius: var(--radius-xl);">
                    <span class="material-symbols-outlined">qr_code</span>
                    ${t('dashboard.qrGenerate')}
                  </button>
                </div>
              </section>
            </div>

            <!-- QR Result -->
            <div class="col-span-full md-col-6">
              <section class="dashboard-section" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 260px;" id="qr-result-section">
                <span class="material-symbols-outlined" style="font-size: 64px; color: var(--outline-variant); opacity: 0.5;">qr_code_2</span>
                <p class="body-md" style="color: var(--on-surface-variant); margin-top: 12px;">${t('dashboard.qrPlaceholder')}</p>
              </section>
            </div>
          </div>

          <!-- Sensor Data (Firebase) -->
          <section class="dashboard-section" style="grid-column: 1 / -1;">
            <div class="dashboard-section__header">
              <h3 class="dashboard-section__title">
                <span class="material-symbols-outlined" style="color: var(--tertiary); vertical-align: middle; margin-right: 6px;">sensors</span>
                ${t('dashboard.sensors')}
              </h3>
              <span class="label-sm" style="color: var(--tertiary); background: var(--tertiary-container); padding: 4px 12px; border-radius: 9999px;" id="sensor-status">🔴 ${t('dashboard.sensorsOffline')}</span>
            </div>
            <div id="sensor-data-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px;">
              <div class="card-flat" style="text-align: center; padding: 20px;">
                <p class="body-md" style="color: var(--on-surface-variant);">${t('dashboard.sensorsConnecting')}</p>
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
  initDashboardModals();

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
        <p class="body-md" style="color: var(--on-surface-variant); margin-top: 12px;">${t('dashboard.noBatches')}</p>
        <p class="label-sm" style="color: var(--outline); margin-top: 4px;">${t('dashboard.createFirst')}</p>
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
        <p class="body-md" style="color: var(--on-surface-variant); margin-top: 12px;">${t('dashboard.noProducers')}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = productores.map(p => `
    <div style="display: flex; align-items: center; gap: 14px; padding: 14px; background: var(--surface-container-low); border-radius: var(--radius-xl); transition: all 0.2s; cursor: pointer;" 
         onmouseover="this.style.background='var(--surface-container-high)'; this.style.transform='translateX(4px)'"
         onmouseout="this.style.background='var(--surface-container-low)'; this.style.transform='translateX(0)'"
         data-nav="story">
      <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--tertiary-container); display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;">
        ${p.foto_url ? `<img src="${p.foto_url}" style="width: 100%; height: 100%; object-fit: cover;" />` : `<span class="material-symbols-outlined" style="color: var(--on-tertiary-container); font-size: 22px;">person</span>`}
      </div>
      <div style="flex: 1; min-width: 0;">
        <p style="font-weight: 600; font-size: 14px; color: var(--on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.nombre}</p>
        <p style="font-size: 12px; color: var(--on-surface-variant);">${p.finca} · ${p.ubicacion}</p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
        <span style="font-size: 11px; color: var(--outline);">${p.altitud_msnm ? p.altitud_msnm + ' msnm' : ''}</span>
        <span style="font-size: 11px; color: ${p.activo ? 'var(--tertiary)' : 'var(--error)'}; font-weight: 600;">${p.activo ? `● ${t('dashboard.activo')}` : `○ ${t('dashboard.inactivo')}`}</span>
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
      content: `Lote ${l.codigo} ${t('dashboard.registered')}`,
      detail: `${l.variedad} · ${l.peso_kg}kg · ${l.estado}`,
    });
  });

  productores.slice(0, 4).forEach(p => {
    activities.push({
      time: p.fecha_registro ? new Date(p.fecha_registro).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' }) : 'Reciente',
      content: `Productor ${p.nombre} ${t('dashboard.registered')}`,
      detail: `${p.finca} · ${p.ubicacion}`,
    });
  });

  if (activities.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 32px;">
        <span class="material-symbols-outlined" style="font-size: 48px; color: var(--outline-variant); opacity: 0.5;">history</span>
        <p class="body-md" style="color: var(--on-surface-variant); margin-top: 12px;">${t('dashboard.noActivity')}</p>
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
      idLabel.textContent = typeSelect.value === 'productor' ? t('dashboard.qrProducerId') : t('dashboard.qrBatchCode');
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
    genBtn.innerHTML = `<div class="spinner" style="width: 18px; height: 18px; border-width: 2px;"></div> ${t('dashboard.qrGenerating')}`;

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
      genBtn.innerHTML = `<span class="material-symbols-outlined">qr_code</span> ${t('dashboard.qrGenerate')}`;
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
      <p class="label-sm" style="color: var(--on-surface-variant);">${t('dashboard.qrSuccess')}</p>
    </div>
  `;
}

function initSensorData() {
  const statusEl = document.getElementById('sensor-status');
  const gridEl = document.getElementById('sensor-data-grid');

  subscribeSensorData((data) => {
    if (statusEl) {
      statusEl.textContent = `🟢 ${t('dashboard.sensorsConnected')}`;
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
              <p class="label-sm" style="color: var(--on-surface-variant);">${t('dashboard.temp')}</p>
              <p style="font-size: 24px; font-weight: 700; font-family: 'Playfair Display', serif; color: var(--on-surface);">${sensor.temperatura || '—'}°</p>
            </div>
            <div>
              <p class="label-sm" style="color: var(--on-surface-variant);">${t('dashboard.humidity')}</p>
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

function initDashboardModals() {
  // --- NUEVO PRODUCTOR MODAL ---
  document.getElementById('btn-new-productor')?.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.id = 'productor-modal';
    modal.style = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 12, 8, 0.7); backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999; padding: 20px; box-sizing: border-box;
      opacity: 0; transition: opacity 0.3s ease;
    `;

    modal.innerHTML = `
      <div style="
        background: var(--surface-container-high); border-radius: var(--radius-xl);
        padding: 32px; width: 100%; max-width: 600px; box-shadow: var(--shadow-lg);
        border: 1px solid var(--outline-variant); max-height: 90vh; overflow-y: auto;
        display: flex; flex-direction: column; gap: 24px;
        transform: scale(0.9); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      " class="hide-scrollbar">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--outline-variant); padding-bottom: 16px;">
          <h3 class="headline-md" style="color: var(--on-background); margin: 0; display: flex; align-items: center; gap: 10px;">
            <span class="material-symbols-outlined" style="color: var(--tertiary); font-size: 28px;">person_add</span>
            ${t('dashboard.registerProducer')}
          </h3>
          <button id="modal-close" style="background: none; border: none; color: var(--on-surface-variant); cursor: pointer;">
            <span class="material-symbols-outlined" style="font-size: 24px;">close</span>
          </button>
        </div>

        <form id="productor-form" style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-field">
              <label class="form-field__label">Nombre Completo *</label>
              <input type="text" id="prod-nombre" required class="form-field__input" placeholder="Gabriel Senior" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);" />
            </div>
            <div class="form-field">
              <label class="form-field__label">Cédula *</label>
              <input type="text" id="prod-cedula" required class="form-field__input" placeholder="100023456" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-field">
              <label class="form-field__label">Nombre de Finca *</label>
              <input type="text" id="prod-finca" required class="form-field__input" placeholder="Finca La Consentida" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);" />
            </div>
            <div class="form-field">
              <label class="form-field__label">Ubicación (Municipio / Vereda) *</label>
              <input type="text" id="prod-ubicacion" required class="form-field__input" placeholder="Minca, Santa Marta" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
            <div class="form-field">
              <label class="form-field__label">Altitud (msnm)</label>
              <input type="number" id="prod-altitud" class="form-field__input" placeholder="1200" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);" />
            </div>
            <div class="form-field">
              <label class="form-field__label">Hectáreas</label>
              <input type="number" step="0.1" id="prod-hectareas" class="form-field__input" placeholder="4.5" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);" />
            </div>
            <div class="form-field">
              <label class="form-field__label">Variedad de Cacao</label>
              <input type="text" id="prod-variedad" class="form-field__input" placeholder="Criollo / Trinitario" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-field">
              <label class="form-field__label">Teléfono</label>
              <input type="text" id="prod-telefono" class="form-field__input" placeholder="+57 300 123 4567" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);" />
            </div>
            <div class="form-field">
              <label class="form-field__label">Email</label>
              <input type="email" id="prod-email" class="form-field__input" placeholder="gabriel@cacao.com" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);" />
            </div>
          </div>

          <div class="form-field">
            <label class="form-field__label">Historia & Filosofía</label>
            <textarea id="prod-historia" rows="3" class="form-field__input" placeholder="Cuéntanos la historia del productor, su tradición cacaotera y compromiso con la Sierra..." style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg); font-family: inherit; resize: vertical;"></textarea>
          </div>

          <!-- ImgBB Image Upload field -->
          <div class="form-field" style="background: var(--surface-container-low); padding: 16px; border-radius: var(--radius-lg); border: 1px dashed var(--outline-variant); display: flex; flex-direction: column; gap: 12px;">
            <label class="form-field__label" style="display: flex; align-items: center; gap: 6px; font-weight: 600; color: var(--tertiary);">
              <span class="material-symbols-outlined">image</span>
              Foto del Productor (Subir a ImgBB)
            </label>
            <div style="display: flex; align-items: center; gap: 16px;">
              <label style="
                background: var(--tertiary-container); color: var(--on-tertiary-container);
                padding: 10px 16px; border-radius: var(--radius-xl); cursor: pointer;
                font-weight: 500; font-size: 11px; display: inline-flex; align-items: center; gap: 8px;
                transition: all 0.2s;
              " onmouseover="this.style.filter='brightness(0.95)'" onmouseout="this.style.filter='none'">
                <span class="material-symbols-outlined" style="font-size: 18px;">upload</span>
                SELECCIONAR FOTO
                <input type="file" id="prod-photo-file" accept="image/*" style="display: none;" />
              </label>
              <div id="upload-status" style="font-size: 12px; color: var(--on-surface-variant);">Ningún archivo seleccionado</div>
            </div>
            <div id="photo-preview-container" style="display: none; align-items: center; gap: 12px; background: var(--surface-container-highest); padding: 8px; border-radius: var(--radius-lg);">
              <img id="photo-preview" src="" style="width: 50px; height: 50px; object-fit: cover; border-radius: 50%; border: 2px solid var(--tertiary);" />
              <div style="flex: 1; min-width: 0;">
                <p style="font-size: 11px; font-weight: 600; color: var(--on-surface); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" id="preview-filename"></p>
                <p style="font-size: 10px; color: var(--tertiary); font-weight: 600;">⚡ URL Segura ImgBB Generada</p>
              </div>
            </div>
            <input type="hidden" id="prod-foto-url" value="" />
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid var(--outline-variant); padding-top: 16px; margin-top: 8px;">
            <button type="button" id="btn-cancel-productor" class="btn btn-secondary" style="border-radius: var(--radius-xl); padding: 10px 24px;">${t('dashboard.cancel')}</button>
            <button type="submit" id="btn-save-productor" class="btn btn-primary" style="background: var(--tertiary); color: var(--on-tertiary); border-radius: var(--radius-xl); padding: 10px 24px; display: inline-flex; align-items: center; gap: 8px;">
              <span class="material-symbols-outlined" style="font-size: 18px;">save</span>
              ${t('dashboard.saveProducer')}
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Fade and Scale Animate-In
    setTimeout(() => {
      modal.style.opacity = '1';
      modal.firstElementChild.style.transform = 'scale(1)';
    }, 10);

    const closeModal = () => {
      modal.style.opacity = '0';
      modal.firstElementChild.style.transform = 'scale(0.9)';
      setTimeout(() => modal.remove(), 300);
    };

    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.getElementById('btn-cancel-productor')?.addEventListener('click', closeModal);

    // ImgBB Upload Handler
    document.getElementById('prod-photo-file')?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const statusEl = document.getElementById('upload-status');
      const saveBtn = document.getElementById('btn-save-productor');
      const previewContainer = document.getElementById('photo-preview-container');
      const previewImg = document.getElementById('photo-preview');
      const filenameEl = document.getElementById('preview-filename');
      const fotoUrlInput = document.getElementById('prod-foto-url');

      if (statusEl) statusEl.innerHTML = '<span class="spinner" style="width: 14px; height: 14px; border-width: 2px; vertical-align: middle; margin-right: 6px;"></span> Subiendo imagen a ImgBB...';
      if (saveBtn) saveBtn.disabled = true;

      try {
        const imageUrl = await api.uploadImage(file);
        
        if (fotoUrlInput) fotoUrlInput.value = imageUrl;
        if (statusEl) statusEl.textContent = t('dashboard.imageUploaded');
        if (filenameEl) filenameEl.textContent = file.name;
        if (previewImg) previewImg.src = imageUrl;
        if (previewContainer) previewContainer.style.display = 'flex';
      } catch (err) {
        if (statusEl) statusEl.innerHTML = `<span style="color: var(--error);">❌ Error: ${err.message}</span>`;
      } finally {
        if (saveBtn) saveBtn.disabled = false;
      }
    });

    // Form submit handler
    document.getElementById('productor-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById('btn-save-productor');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span> Guardando...';
      }

      const payload = {
        nombre: document.getElementById('prod-nombre').value,
        cedula: document.getElementById('prod-cedula').value,
        finca: document.getElementById('prod-finca').value,
        ubicacion: document.getElementById('prod-ubicacion').value,
        altitud_msnm: parseInt(document.getElementById('prod-altitud').value) || null,
        hectareas: parseFloat(document.getElementById('prod-hectareas').value) || null,
        variedad_cacao: document.getElementById('prod-variedad').value || null,
        telefono: document.getElementById('prod-telefono').value || null,
        email: document.getElementById('prod-email').value || null,
        historia: document.getElementById('prod-historia').value || null,
        foto_url: document.getElementById('prod-foto-url').value || null,
      };

      try {
        await api.createProductor(payload);
        
        // Dynamic Toast Notification
        const toast = document.createElement('div');
        toast.style = `
          position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
          background: var(--tertiary); color: var(--on-tertiary); padding: 14px 28px;
          border-radius: var(--radius-xl); font-weight: 600; z-index: 10000; box-shadow: var(--shadow-lg);
          font-size: 13px; display: flex; align-items: center; gap: 8px; animation: fadeInScale 0.3s ease;
        `;
        toast.innerHTML = `<span class="material-symbols-outlined">check_circle</span> ${t('dashboard.producerSaved')}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);

        closeModal();
        loadDashboardData();
      } catch (err) {
        alert(`Error al registrar productor: ${err.message}`);
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size: 18px;">save</span> ${t('dashboard.saveProducer')}`;
        }
      }
    });
  });

  // --- NUEVO LOTE MODAL ---
  document.getElementById('btn-new-lote')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-new-lote');
    if (btn) btn.disabled = true;

    let productores = [];
    try {
      productores = await api.getProductores();
    } catch (e) {
      console.error(e);
    } finally {
      if (btn) btn.disabled = false;
    }

    if (productores.length === 0) {
      alert('Debes registrar al menos un productor antes de crear un lote.');
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'lote-modal';
    modal.style = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(15, 12, 8, 0.7); backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999; padding: 20px; box-sizing: border-box;
      opacity: 0; transition: opacity 0.3s ease;
    `;

    // Generate random lote code like LOT-2026-X
    const randCode = `LOT-2026-${Math.floor(100 + Math.random() * 900)}`;

    modal.innerHTML = `
      <div style="
        background: var(--surface-container-high); border-radius: var(--radius-xl);
        padding: 32px; width: 100%; max-width: 600px; box-shadow: var(--shadow-lg);
        border: 1px solid var(--outline-variant); max-height: 90vh; overflow-y: auto;
        display: flex; flex-direction: column; gap: 24px;
        transform: scale(0.9); transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      " class="hide-scrollbar">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--outline-variant); padding-bottom: 16px;">
          <h3 class="headline-md" style="color: var(--on-background); margin: 0; display: flex; align-items: center; gap: 10px;">
            <span class="material-symbols-outlined" style="color: var(--secondary); font-size: 28px;">inventory_2</span>
            ${t('dashboard.registerBatch')}
          </h3>
          <button id="modal-lote-close" style="background: none; border: none; color: var(--on-surface-variant); cursor: pointer;">
            <span class="material-symbols-outlined" style="font-size: 24px;">close</span>
          </button>
        </div>

        <form id="lote-form" style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-field">
              <label class="form-field__label">Código del Lote *</label>
              <input type="text" id="lote-codigo" required class="form-field__input" value="${randCode}" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg); font-family: monospace;" />
            </div>
            <div class="form-field">
              <label class="form-field__label">Productor *</label>
              <select id="lote-productor-id" required class="form-field__select" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg); height: 44px; width: 100%;">
                ${productores.map(p => `<option value="${p.id}">${p.nombre} (${p.finca})</option>`).join('')}
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-field">
              <label class="form-field__label">Variedad de Cacao *</label>
              <select id="lote-variedad" required class="form-field__select" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg); height: 44px; width: 100%;">
                <option value="Criollo">Criollo</option>
                <option value="Trinitario">Trinitario</option>
                <option value="Forastero">Forastero</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
            <div class="form-field">
              <label class="form-field__label">Peso (kg) *</label>
              <input type="number" step="0.1" id="lote-peso" required class="form-field__input" placeholder="45.5" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-field">
              <label class="form-field__label">Fecha de Cosecha *</label>
              <input type="date" id="lote-fecha-cosecha" required class="form-field__input" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);" />
            </div>
            <div class="form-field">
              <label class="form-field__label">Puntaje de Calidad (0-100)</label>
              <input type="number" id="lote-calidad" min="0" max="100" class="form-field__input" placeholder="85" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);" />
            </div>
          </div>

          <div class="form-field">
            <label class="form-field__label">Origen / Lote de Finca</label>
            <input type="text" id="lote-origen" class="form-field__input" placeholder="Lote Alto Minca" style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg);" />
          </div>

          <div class="form-field">
            <label class="form-field__label">Notas de Cata</label>
            <textarea id="lote-notas" rows="3" class="form-field__input" placeholder="Notas de sabor: cítrico, chocolate amargo, frutos rojos, nuez..." style="border: 1px solid var(--outline-variant); padding: 10px 12px; border-radius: var(--radius-lg); font-family: inherit; resize: vertical;"></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid var(--outline-variant); padding-top: 16px; margin-top: 8px;">
            <button type="button" id="btn-cancel-lote" class="btn btn-secondary" style="border-radius: var(--radius-xl); padding: 10px 24px;">${t('dashboard.cancel')}</button>
            <button type="submit" id="btn-save-lote" class="btn btn-primary" style="background: var(--secondary); color: var(--on-secondary); border-radius: var(--radius-xl); padding: 10px 24px; display: inline-flex; align-items: center; gap: 8px;">
              <span class="material-symbols-outlined" style="font-size: 18px;">save</span>
              ${t('dashboard.saveBatch')}
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Set default harvest date to today
    const dateInput = document.getElementById('lote-fecha-cosecha');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Fade and Scale Animate-In
    setTimeout(() => {
      modal.style.opacity = '1';
      modal.firstElementChild.style.transform = 'scale(1)';
    }, 10);

    const closeModal = () => {
      modal.style.opacity = '0';
      modal.firstElementChild.style.transform = 'scale(0.9)';
      setTimeout(() => modal.remove(), 300);
    };

    document.getElementById('modal-lote-close')?.addEventListener('click', closeModal);
    document.getElementById('btn-cancel-lote')?.addEventListener('click', closeModal);

    // Form submit handler
    document.getElementById('lote-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = document.getElementById('btn-save-lote');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<span class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></span> Registrando...';
      }

      const payload = {
        codigo: document.getElementById('lote-codigo').value,
        productor_id: parseInt(document.getElementById('lote-productor-id').value),
        variedad: document.getElementById('lote-variedad').value,
        peso_kg: parseFloat(document.getElementById('lote-peso').value),
        fecha_cosecha: new Date(document.getElementById('lote-fecha-cosecha').value).toISOString(),
        puntaje_calidad: parseFloat(document.getElementById('lote-calidad').value) || null,
        origen: document.getElementById('lote-origen').value || null,
        notas_cata: document.getElementById('lote-notas').value || null,
      };

      try {
        await api.createLote(payload);
        
        // Dynamic Toast Notification
        const toast = document.createElement('div');
        toast.style = `
          position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
          background: var(--secondary); color: var(--on-secondary); padding: 14px 28px;
          border-radius: var(--radius-xl); font-weight: 600; z-index: 10000; box-shadow: var(--shadow-lg);
          font-size: 13px; display: flex; align-items: center; gap: 8px; animation: fadeInScale 0.3s ease;
        `;
        toast.innerHTML = `<span class="material-symbols-outlined">check_circle</span> ${t('dashboard.batchSaved')}`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);

        closeModal();
        loadDashboardData();
      } catch (err) {
        alert(`Error al registrar lote: ${err.message}`);
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.innerHTML = `<span class="material-symbols-outlined" style="font-size: 18px;">save</span> ${t('dashboard.saveBatch')}`;
        }
      }
    });
  });
}
