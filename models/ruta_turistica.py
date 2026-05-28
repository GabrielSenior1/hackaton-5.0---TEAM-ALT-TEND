"""
Modelo de Ruta Turística — Rutas turísticas del Magdalena
que conectan con fincas de cacao.
"""

from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class RutaTuristica(Base):
    __tablename__ = "rutas_turisticas"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(200), nullable=False, index=True)
    descripcion = Column(Text, nullable=False)
    tipo = Column(String(100), nullable=False)  # cacao, cafe, mixta, naturaleza

    # ── Puntos geográficos ───────────────────────────────
    punto_inicio_lat = Column(Float, nullable=True)
    punto_inicio_lng = Column(Float, nullable=True)
    punto_fin_lat = Column(Float, nullable=True)
    punto_fin_lng = Column(Float, nullable=True)

    # ── Detalles de la ruta ──────────────────────────────
    duracion_horas = Column(Float, nullable=True)
    distancia_km = Column(Float, nullable=True)
    dificultad = Column(String(50), nullable=True)  # facil, moderada, dificil
    precio_cop = Column(Float, nullable=True)  # Precio en pesos colombianos
    precio_usd = Column(Float, nullable=True)  # Precio en dólares

    # ── Info turística ───────────────────────────────────
    fincas_incluidas = Column(Text, nullable=True)  # JSON con IDs de fincas
    puntos_interes = Column(Text, nullable=True)  # JSON con puntos de interés
    imagen_url = Column(String(500), nullable=True)
    activa = Column(Integer, default=1)

    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())
