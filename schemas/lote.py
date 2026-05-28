"""Schemas Pydantic para Lote de cacao."""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class LoteBase(BaseModel):
    """Campos base para un lote de cacao."""
    codigo: str
    productor_id: int
    variedad: str
    peso_kg: float
    fecha_cosecha: datetime
    fecha_fermentacion: Optional[datetime] = None
    fecha_secado: Optional[datetime] = None
    proceso: Optional[str] = None
    notas_cata: Optional[str] = None
    puntaje_calidad: Optional[float] = None
    origen: Optional[str] = None
    destino: Optional[str] = None


class LoteCreate(LoteBase):
    """Schema para crear un lote. El hash se genera automáticamente."""
    pass


class LoteUpdate(BaseModel):
    """Schema para actualizar un lote (campos no sensibles al hash)."""
    estado: Optional[str] = None
    destino: Optional[str] = None
    notas_cata: Optional[str] = None
    puntaje_calidad: Optional[float] = None


class LoteResponse(LoteBase):
    """Schema de respuesta con hash de trazabilidad."""
    id: int
    hash_trazabilidad: str
    datos_hash: Optional[str] = None
    estado: str
    fecha_registro: datetime
    fecha_actualizacion: Optional[datetime] = None

    class Config:
        from_attributes = True


class LoteVerificacion(BaseModel):
    """Schema para verificar la integridad de un lote."""
    codigo: str
    hash_proporcionado: str


class LoteVerificacionResponse(BaseModel):
    """Respuesta de la verificación de integridad."""
    codigo: str
    es_valido: bool
    hash_almacenado: str
    hash_proporcionado: str
    mensaje: str
