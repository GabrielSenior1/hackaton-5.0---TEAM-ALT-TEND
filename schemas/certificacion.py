"""Schemas Pydantic para Certificación."""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CertificacionBase(BaseModel):
    """Campos base de una certificación."""
    productor_id: int
    tipo: str  # Fairtrade, Rainforest Alliance, Orgánica, UTZ
    numero_certificado: str
    entidad_certificadora: str
    fecha_emision: datetime
    fecha_vencimiento: datetime
    documento_url: Optional[str] = None
    notas: Optional[str] = None


class CertificacionCreate(CertificacionBase):
    """Schema para crear una certificación."""
    pass


class CertificacionUpdate(BaseModel):
    """Schema para actualizar una certificación."""
    estado: Optional[str] = None
    fecha_vencimiento: Optional[datetime] = None
    documento_url: Optional[str] = None
    notas: Optional[str] = None


class CertificacionResponse(CertificacionBase):
    """Schema de respuesta."""
    id: int
    estado: str
    hash_certificacion: Optional[str] = None
    fecha_registro: datetime

    class Config:
        from_attributes = True
