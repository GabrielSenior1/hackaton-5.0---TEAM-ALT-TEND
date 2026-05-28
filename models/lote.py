"""
Modelo de Lote — Representa un lote de cacao con trazabilidad
inmutable mediante hash SHA-256.
"""

from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Lote(Base):
    __tablename__ = "lotes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    codigo = Column(String(50), unique=True, nullable=False, index=True)  # Ej: LOT-2026-001
    productor_id = Column(Integer, ForeignKey("productores.id"), nullable=False)

    # ── Datos del lote ───────────────────────────────────
    variedad = Column(String(100), nullable=False)  # Criollo, Trinitario, Forastero
    peso_kg = Column(Float, nullable=False)
    fecha_cosecha = Column(DateTime(timezone=True), nullable=False)
    fecha_fermentacion = Column(DateTime(timezone=True), nullable=True)
    fecha_secado = Column(DateTime(timezone=True), nullable=True)
    proceso = Column(String(100), nullable=True)  # Fermentado, lavado, natural
    notas_cata = Column(Text, nullable=True)  # Notas de sabor para el comprador
    puntaje_calidad = Column(Float, nullable=True)  # Puntaje de calidad (0-100)
    origen = Column(String(200), nullable=True)  # Ubicación específica de cosecha

    # ── Trazabilidad (inmutabilidad) ─────────────────────
    hash_trazabilidad = Column(String(64), unique=True, nullable=False)  # SHA-256
    datos_hash = Column(Text, nullable=True)  # JSON con los datos usados para el hash

    # ── Estado ───────────────────────────────────────────
    estado = Column(
        String(50), default="registrado"
    )  # registrado, en_proceso, exportado, vendido
    destino = Column(String(200), nullable=True)  # País/comprador de destino

    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())

    # ── Relaciones ───────────────────────────────────────
    productor = relationship("Productor", back_populates="lotes")
    transacciones = relationship("Transaccion", back_populates="lote")
