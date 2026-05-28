/**
 * 🍫 Cacao de la Sierra — API Client
 * HTTP client for FastAPI backend communication
 */

const API_BASE = 'http://localhost:8000/api/v1';

class ApiClient {
  constructor(baseUrl = API_BASE) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(error.detail || `HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  }

  // ── Productores ─────────────────────────────────
  async getProductores(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/productores${query ? '?' + query : ''}`);
  }

  async getProductor(id) {
    return this.request(`/productores/${id}`);
  }

  async createProductor(data) {
    return this.request('/productores/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProductor(id, data) {
    return this.request(`/productores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ── Lotes ───────────────────────────────────────
  async getLotes(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/lotes${query ? '?' + query : ''}`);
  }

  async getLote(id) {
    return this.request(`/lotes/${id}`);
  }

  async getLoteByCodigo(codigo) {
    return this.request(`/lotes/codigo/${codigo}`);
  }

  async createLote(data) {
    return this.request('/lotes/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLote(id, data) {
    return this.request(`/lotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // ── Certificaciones ─────────────────────────────
  async getCertificaciones(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/certificaciones${query ? '?' + query : ''}`);
  }

  // ── QR ──────────────────────────────────────────
  async getQrProductor(id) {
    return this.request(`/qr/productor/${id}`);
  }

  async getQrLote(codigo) {
    return this.request(`/qr/lote/${codigo}`);
  }

  getQrProductorImageUrl(id) {
    return `${this.baseUrl}/qr/productor/${id}/imagen`;
  }

  getQrLoteImageUrl(codigo) {
    return `${this.baseUrl}/qr/lote/${codigo}/imagen`;
  }

  // ── Verificación ────────────────────────────────
  async verificarLote(codigo, hash = null) {
    const params = hash ? `?hash=${hash}` : '';
    return this.request(`/verificar/${codigo}${params}`);
  }

  async validarIntegridad(codigo, hashProporcionado) {
    return this.request('/verificar/validar', {
      method: 'POST',
      body: JSON.stringify({
        codigo,
        hash_proporcionado: hashProporcionado,
      }),
    });
  }

  // ── Rutas Turísticas ────────────────────────────
  async getRutas(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/rutas${query ? '?' + query : ''}`);
  }

  async getRuta(id) {
    return this.request(`/rutas/${id}`);
  }

  // ── Pagos ───────────────────────────────────────
  async crearPago(data) {
    return this.request('/pagos/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ── ImgBB Image Upload ──────────────────────────
  async uploadImage(file) {
    const apiKey = 'd59dc2c1d6a302c398363bf05f5b8628';
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`ImgBB upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      if (result && result.data && result.data.url) {
        return result.data.url; // Returns direct secure image link
      } else {
        throw new Error('Respuesta inválida de ImgBB');
      }
    } catch (error) {
      console.error('ImgBB Upload Error:', error);
      throw error;
    }
  }
}

/**
 * Formatea un precio en USD de acuerdo a la divisa seleccionada en localStorage
 * @param {number} priceInUSD El precio base en dólares
 * @returns {string} El precio formateado con el símbolo de divisa correspondiente
 */
export function formatPrice(priceInUSD) {
  const currency = localStorage.getItem('currency') || 'USD';
  
  // Tipos de cambio aproximados para demostración en local
  const rates = {
    'USD': 1.0,
    'COP': 4000.0,
    'EUR': 0.92,
  };
  
  const rate = rates[currency] || 1.0;
  const converted = priceInUSD * rate;
  
  if (currency === 'COP') {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  } else if (currency === 'EUR') {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(converted);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(converted);
  }
}

export const api = new ApiClient();
export default api;
