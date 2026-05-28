"""
Modelo de Productor — Representa a un productor de cacao
de la Sierra Nevada del Magdalena.
"""

from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class Productor(Base):
    __tablename__ = "productores"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(200), nullable=False, index=True)
    cedula = Column(String(20), unique=True, nullable=False)
    finca = Column(String(200), nullable=False)
    ubicacion = Column(String(300), nullable=False)  # Vereda / municipio
    latitud = Column(Float, nullable=True)
    longitud = Column(Float, nullable=True)
    altitud_msnm = Column(Integer, nullable=True)  # Metros sobre nivel del mar
    hectareas = Column(Float, nullable=True)
    variedad_cacao = Column(String(100), nullable=True)  # Criollo, Trinitario, etc.
    historia = Column(Text, nullable=True)  # Historia del productor para turistas
    telefono = Column(String(20), nullable=True)
    email = Column(String(200), nullable=True)
    foto_url = Column(String(500), nullable=True)
    activo = Column(Integer, default=1)  # 1 = activo, 0 = inactivo
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())

    # ── Relaciones ───────────────────────────────────────
    lotes = relationship("Lote", back_populates="productor")
    certificaciones = relationship("Certificacion", back_populates="productor")
