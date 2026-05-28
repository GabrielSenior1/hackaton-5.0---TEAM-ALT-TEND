"""
🌿 Cacao de la Sierra — API Principal
=====================================
Plataforma de trazabilidad, turismo y comercio para el cacao
del Magdalena, Sierra Nevada de Santa Marta.

Ejecutar con:
    uvicorn main:app --reload
    
Documentación interactiva:
    http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from config import get_settings
from database import engine, Base

# ── Importar todos los modelos para que SQLAlchemy los registre ──
from models import productor, lote, certificacion, ruta_turistica, transaccion

# ── Importar routers ────────────────────────────────────
from routers import (
    productores,
    lotes,
    certificaciones,
    qr,
    rutas_turisticas,
    pagos,
    verificacion,
)

settings = get_settings()

# ── Crear la aplicación FastAPI ──────────────────────────
app = FastAPI(
    title=settings.app_name,
    description=(
        "API para la trazabilidad del cacao de la Sierra Nevada del Magdalena. "
        "Conecta productores, turistas, hoteles y compradores internacionales "
        "en una cadena de valor unificada con certificaciones Fairtrade y "
        "Rainforest Alliance verificables mediante hashes SHA-256."
    ),
    version=settings.app_version,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ─────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Archivos estáticos ──────────────────────────────────
os.makedirs("static/qr_codes", exist_ok=True)
os.makedirs("static/geo_data", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# ── Registrar routers ───────────────────────────────────
app.include_router(productores.router, prefix="/api/v1/productores", tags=["🌱 Productores"])
app.include_router(lotes.router, prefix="/api/v1/lotes", tags=["📦 Lotes & Trazabilidad"])
app.include_router(certificaciones.router, prefix="/api/v1/certificaciones", tags=["🏅 Certificaciones"])
app.include_router(qr.router, prefix="/api/v1/qr", tags=["📱 Códigos QR"])
app.include_router(rutas_turisticas.router, prefix="/api/v1/rutas", tags=["🗺️ Rutas Turísticas"])
app.include_router(pagos.router, prefix="/api/v1/pagos", tags=["💳 Pagos"])
app.include_router(verificacion.router, prefix="/api/v1/verificar", tags=["🔒 Verificación"])


# ── Crear tablas al iniciar ──────────────────────────────
@app.on_event("startup")
async def startup():
    """Crea todas las tablas en la base de datos al iniciar."""
    Base.metadata.create_all(bind=engine)


# ── Root endpoint ────────────────────────────────────────
@app.get("/", tags=["🏠 Inicio"])
async def root():
    """Endpoint raíz con información de la API."""
    return {
        "nombre": settings.app_name,
        "version": settings.app_version,
        "descripcion": "Plataforma de trazabilidad y comercio del cacao del Magdalena",
        "documentacion": "/docs",
        "estado": "✅ Activo",
        "endpoints": {
            "productores": "/api/v1/productores",
            "lotes": "/api/v1/lotes",
            "certificaciones": "/api/v1/certificaciones",
            "qr": "/api/v1/qr",
            "rutas_turisticas": "/api/v1/rutas",
            "pagos": "/api/v1/pagos",
            "verificacion": "/api/v1/verificar",
        },
    }
