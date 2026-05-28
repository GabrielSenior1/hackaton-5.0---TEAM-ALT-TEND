"""Schemas Pydantic para Transacción."""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TransaccionBase(BaseModel):
    """Campos base de una transacción."""
    lote_id: int
    tipo: str  # compra, exportacion, turismo
    monto_usd: float
    monto_cop: Optional[float] = None
    moneda_origen: str = "USD"
    comprador_nombre: Optional[str] = None
    comprador_email: Optional[str] = None
    comprador_pais: Optional[str] = None


class TransaccionCreate(TransaccionBase):
    """Schema para crear una transacción."""
    pass


class TransaccionResponse(TransaccionBase):
    """Schema de respuesta con datos de Stripe."""
    id: int
    stripe_payment_id: Optional[str] = None
    stripe_session_id: Optional[str] = None
    estado_pago: str
    comision_productor: Optional[float] = None
    comision_operador: Optional[float] = None
    comision_plataforma: Optional[float] = None
    notas: Optional[str] = None
    fecha_transaccion: datetime

    class Config:
        from_attributes = True


class CheckoutSessionCreate(BaseModel):
    """Schema para crear una sesión de pago en Stripe."""
    lote_id: int
    cantidad_kg: float
    comprador_nombre: str
    comprador_email: str
    comprador_pais: Optional[str] = None
    success_url: str = "http://localhost:3000/pago-exitoso"
    cancel_url: str = "http://localhost:3000/pago-cancelado"


class CheckoutSessionResponse(BaseModel):
    """Respuesta con la URL de checkout de Stripe."""
    session_id: str
    checkout_url: str
    monto_usd: float
