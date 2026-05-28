"""
Modelo de Certificación — Certificaciones Fairtrade,
Rainforest Alliance y orgánicas vinculadas a productores.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Certificacion(Base):
    __tablename__ = "certificaciones"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    productor_id = Column(Integer, ForeignKey("productores.id"), nullable=False)

    # ── Datos de la certificación ────────────────────────
    tipo = Column(
        String(100), nullable=False
    )  # Fairtrade, Rainforest Alliance, Orgánica, UTZ
    numero_certificado = Column(String(100), unique=True, nullable=False)
    entidad_certificadora = Column(String(200), nullable=False)
    fecha_emision = Column(DateTime(timezone=True), nullable=False)
    fecha_vencimiento = Column(DateTime(timezone=True), nullable=False)
    estado = Column(String(50), default="vigente")  # vigente, vencida, revocada
    documento_url = Column(String(500), nullable=True)  # URL del documento PDF
    notas = Column(Text, nullable=True)

    # ── Hash de integridad ───────────────────────────────
    hash_certificacion = Column(String(64), nullable=True)  # SHA-256 del certificado

    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())

    # ── Relaciones ───────────────────────────────────────
    productor = relationship("Productor", back_populates="certificaciones")
