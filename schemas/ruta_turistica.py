"""Schemas Pydantic para Ruta Turística."""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RutaTuristicaBase(BaseModel):
    """Campos base de una ruta turística."""
    nombre: str
    descripcion: str
    tipo: str  # cacao, cafe, mixta, naturaleza
    punto_inicio_lat: Optional[float] = None
    punto_inicio_lng: Optional[float] = None
    punto_fin_lat: Optional[float] = None
    punto_fin_lng: Optional[float] = None
    duracion_horas: Optional[float] = None
    distancia_km: Optional[float] = None
    dificultad: Optional[str] = None
    precio_cop: Optional[float] = None
    precio_usd: Optional[float] = None
    fincas_incluidas: Optional[str] = None
    puntos_interes: Optional[str] = None
    imagen_url: Optional[str] = None


class RutaTuristicaCreate(RutaTuristicaBase):
    """Schema para crear una ruta turística."""
    pass


class RutaTuristicaUpdate(BaseModel):
    """Schema para actualizar una ruta turística."""
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    duracion_horas: Optional[float] = None
    precio_cop: Optional[float] = None
    precio_usd: Optional[float] = None
    fincas_incluidas: Optional[str] = None
    puntos_interes: Optional[str] = None
    imagen_url: Optional[str] = None
    activa: Optional[int] = None


class RutaTuristicaResponse(RutaTuristicaBase):
    """Schema de respuesta."""
    id: int
    activa: int
    fecha_registro: datetime
    fecha_actualizacion: Optional[datetime] = None

    class Config:
        from_attributes = True
