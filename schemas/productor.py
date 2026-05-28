"""Schemas Pydantic para Productor."""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class ProductorBase(BaseModel):
    """Campos compartidos para crear y leer un productor."""
    nombre: str
    cedula: str
    finca: str
    ubicacion: str
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    altitud_msnm: Optional[int] = None
    hectareas: Optional[float] = None
    variedad_cacao: Optional[str] = None
    historia: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    foto_url: Optional[str] = None


class ProductorCreate(ProductorBase):
    """Schema para crear un nuevo productor."""
    pass


class ProductorUpdate(BaseModel):
    """Schema para actualizar un productor (todos los campos opcionales)."""
    nombre: Optional[str] = None
    finca: Optional[str] = None
    ubicacion: Optional[str] = None
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    altitud_msnm: Optional[int] = None
    hectareas: Optional[float] = None
    variedad_cacao: Optional[str] = None
    historia: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[str] = None
    foto_url: Optional[str] = None
    activo: Optional[int] = None


class ProductorResponse(ProductorBase):
    """Schema de respuesta con campos generados por el servidor."""
    id: int
    activo: int
    fecha_registro: datetime
    fecha_actualizacion: Optional[datetime] = None

    class Config:
        from_attributes = True
