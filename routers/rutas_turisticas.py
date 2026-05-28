"""
Router de Rutas Turísticas — Gestión de rutas y fincas
del Magdalena con datos geográficos.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models.ruta_turistica import RutaTuristica
from schemas.ruta_turistica import (
    RutaTuristicaCreate,
    RutaTuristicaUpdate,
    RutaTuristicaResponse,
)
from services.geo_service import (
    cargar_fincas,
    cargar_rutas_geo,
    obtener_finca_por_id,
    obtener_fincas_cercanas,
)

router = APIRouter()


# ══════════════════════════════════════════════════════════
# CRUD de Rutas Turísticas (Base de datos)
# ══════════════════════════════════════════════════════════


@router.post("/", response_model=RutaTuristicaResponse, status_code=status.HTTP_201_CREATED)
def crear_ruta(ruta: RutaTuristicaCreate, db: Session = Depends(get_db)):
    """Crea una nueva ruta turística en el Magdalena."""
    db_ruta = RutaTuristica(**ruta.model_dump())
    db.add(db_ruta)
    db.commit()
    db.refresh(db_ruta)
    return db_ruta


@router.get("/", response_model=List[RutaTuristicaResponse])
def listar_rutas(
    skip: int = 0,
    limit: int = 100,
    tipo: str = None,
    activa: int = None,
    db: Session = Depends(get_db),
):
    """Lista todas las rutas turísticas con filtros."""
    query = db.query(RutaTuristica)
    if tipo:
        query = query.filter(RutaTuristica.tipo == tipo)
    if activa is not None:
        query = query.filter(RutaTuristica.activa == activa)
    return query.offset(skip).limit(limit).all()


@router.get("/{ruta_id}", response_model=RutaTuristicaResponse)
def obtener_ruta(ruta_id: int, db: Session = Depends(get_db)):
    """Obtiene una ruta turística por su ID."""
    ruta = db.query(RutaTuristica).filter(RutaTuristica.id == ruta_id).first()
    if not ruta:
        raise HTTPException(status_code=404, detail="Ruta turística no encontrada")
    return ruta


@router.put("/{ruta_id}", response_model=RutaTuristicaResponse)
def actualizar_ruta(
    ruta_id: int,
    datos: RutaTuristicaUpdate,
    db: Session = Depends(get_db),
):
    """Actualiza una ruta turística."""
    ruta = db.query(RutaTuristica).filter(RutaTuristica.id == ruta_id).first()
    if not ruta:
        raise HTTPException(status_code=404, detail="Ruta turística no encontrada")

    datos_actualizados = datos.model_dump(exclude_unset=True)
    for campo, valor in datos_actualizados.items():
        setattr(ruta, campo, valor)

    db.commit()
    db.refresh(ruta)
    return ruta


# ══════════════════════════════════════════════════════════
# Datos Geográficos Estáticos
# ══════════════════════════════════════════════════════════


@router.get("/geo/fincas")
def listar_fincas_geo():
    """
    Retorna datos geográficos de las fincas de cacao (JSON estático).
    Ideal para el visor interactivo de mapas en el frontend.
    """
    fincas = cargar_fincas()
    return {
        "total": len(fincas),
        "fincas": fincas,
    }


@router.get("/geo/rutas")
def listar_rutas_geo():
    """Retorna datos geográficos de las rutas turísticas (JSON estático)."""
    rutas = cargar_rutas_geo()
    return {
        "total": len(rutas),
        "rutas": rutas,
    }


@router.get("/geo/fincas/{finca_id}")
def obtener_finca_geo(finca_id: int):
    """Obtiene datos geográficos de una finca específica."""
    finca = obtener_finca_por_id(finca_id)
    if not finca:
        raise HTTPException(status_code=404, detail="Finca no encontrada en datos geográficos")
    return finca


@router.get("/geo/cercanas")
def fincas_cercanas(
    latitud: float,
    longitud: float,
    radio_km: float = 50,
):
    """
    Busca fincas de cacao cercanas a una ubicación.
    Útil para turistas en hoteles de Santa Marta.

    Ejemplo: /geo/cercanas?latitud=11.2408&longitud=-74.1990&radio_km=30
    """
    fincas = obtener_fincas_cercanas(latitud, longitud, radio_km)
    return {
        "ubicacion_consulta": {"latitud": latitud, "longitud": longitud},
        "radio_km": radio_km,
        "total": len(fincas),
        "fincas": fincas,
    }
