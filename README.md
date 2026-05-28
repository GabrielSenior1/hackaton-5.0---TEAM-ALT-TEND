# 🌿 Cacao de la Sierra — API Backend

> Plataforma de trazabilidad, turismo y comercio para el cacao del Magdalena, Sierra Nevada de Santa Marta.

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com)

---

## 📖 Descripción

**Cacao de la Sierra** conecta la cadena de valor del cacao del Magdalena: desde el agricultor de la Sierra Nevada hasta el turista en Santa Marta y el comprador internacional.

### Características Principales

| Módulo | Descripción |
|--------|-------------|
| 🔒 **Trazabilidad SHA-256** | Cada lote de cacao tiene un hash inmutable que garantiza la autenticidad de certificaciones Fairtrade y Rainforest Alliance |
| 📱 **Códigos QR Dinámicos** | QR únicos por productor y lote para imprimir en etiquetas y menús de hoteles |
| 🗺️ **Rutas Turísticas** | Datos geográficos de fincas y rutas del Magdalena, listos para mapas interactivos |
| 💳 **Pagos con Stripe** | Compras internacionales con distribución automática de comisiones (70% productor, 15% operador, 15% plataforma) |
| 🏅 **Certificaciones** | Gestión de Fairtrade, Rainforest Alliance y orgánicas con hash de integridad |

---

## 🚀 Instalación Rápida

### Prerrequisitos
- Python 3.11+
- pip

### Setup

```bash
# 1. Clonar el repositorio
git clone https://github.com/GabrielSenior1/hackaton-5.0---TEAM-ALT-TEND.git
cd hackaton-5.0---TEAM-ALT-TEND

# 2. Crear entorno virtual
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar variables de entorno
copy .env.example .env
# Editar .env con tus claves de Stripe

# 5. Ejecutar el servidor
uvicorn main:app --reload
```

### 📋 Documentación Interactiva

Una vez ejecutando, visitar:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🏗️ Estructura del Proyecto

```
├── main.py                    # Punto de entrada FastAPI
├── config.py                  # Variables de entorno
├── database.py                # SQLite + SQLAlchemy
│
├── models/                    # Modelos de base de datos
│   ├── productor.py           # Productores de cacao
│   ├── lote.py                # Lotes con hash SHA-256
│   ├── certificacion.py       # Certificaciones Fairtrade/RA
│   ├── ruta_turistica.py      # Rutas del Magdalena
│   └── transaccion.py         # Pagos y comisiones
│
├── schemas/                   # Validación Pydantic
├── routers/                   # Endpoints de la API
│   ├── productores.py         # CRUD productores
│   ├── lotes.py               # Trazabilidad de lotes
│   ├── certificaciones.py     # Gestión certificaciones
│   ├── qr.py                  # Generación de QR
│   ├── rutas_turisticas.py    # Rutas + datos geográficos
│   ├── pagos.py               # Stripe checkout
│   └── verificacion.py        # Verificación de hashes
│
├── services/                  # Lógica de negocio
│   ├── hash_service.py        # SHA-256 inmutabilidad
│   ├── qr_service.py          # Generación de QR estilizados
│   ├── pago_service.py        # Integración Stripe
│   └── geo_service.py         # Datos geográficos
│
├── static/                    # Archivos estáticos
│   ├── geo_data/              # JSON de fincas y rutas
│   └── qr_codes/              # QR generados
│
└── tests/                     # Tests unitarios
```

---

## 🔌 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/v1/productores` | Listar productores |
| `POST` | `/api/v1/productores` | Registrar productor |
| `POST` | `/api/v1/lotes` | Crear lote con hash SHA-256 |
| `GET` | `/api/v1/verificar/{codigo}` | Verificar autenticidad de lote |
| `GET` | `/api/v1/qr/productor/{id}` | Generar QR de productor |
| `GET` | `/api/v1/qr/lote/{codigo}` | Generar QR de lote |
| `POST` | `/api/v1/pagos/checkout` | Crear sesión de pago Stripe |
| `GET` | `/api/v1/rutas` | Listar rutas turísticas |
| `GET` | `/api/v1/rutas/geo/fincas` | Datos geográficos de fincas |
| `GET` | `/api/v1/rutas/geo/cercanas` | Fincas cercanas a ubicación |

---

## 🧪 Tests

```bash
pytest tests/ -v
```

---

## 👥 Equipo

**TEAM ALT-TEND** — Hackaton 5.0

---

## 📄 Licencia

MIT License
