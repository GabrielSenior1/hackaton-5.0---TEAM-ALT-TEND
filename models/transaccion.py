"""
Modelo de Transacción — Registra pagos y compras de cacao
realizadas a través de la plataforma (Stripe).
"""

from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Transaccion(Base):
    __tablename__ = "transacciones"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    lote_id = Column(Integer, ForeignKey("lotes.id"), nullable=False)

    # ── Datos de la transacción ──────────────────────────
    tipo = Column(String(50), nullable=False)  # compra, exportacion, turismo
    monto_usd = Column(Float, nullable=False)
    monto_cop = Column(Float, nullable=True)
    moneda_origen = Column(String(10), default="USD")

    # ── Stripe ───────────────────────────────────────────
    stripe_payment_id = Column(String(200), nullable=True)
    stripe_session_id = Column(String(200), nullable=True)
    estado_pago = Column(
        String(50), default="pendiente"
    )  # pendiente, completado, fallido, reembolsado

    # ── Comprador ────────────────────────────────────────
    comprador_nombre = Column(String(200), nullable=True)
    comprador_email = Column(String(200), nullable=True)
    comprador_pais = Column(String(100), nullable=True)

    # ── Distribución de comisiones ───────────────────────
    comision_productor = Column(Float, nullable=True)  # % para el productor
    comision_operador = Column(Float, nullable=True)  # % para el operador turístico
    comision_plataforma = Column(Float, nullable=True)  # % para la plataforma

    notas = Column(Text, nullable=True)
    fecha_transaccion = Column(DateTime(timezone=True), server_default=func.now())

    # ── Relaciones ───────────────────────────────────────
    lote = relationship("Lote", back_populates="transacciones")
