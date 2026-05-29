"""
Router de Certificaciones — Gestión de certificaciones Fairtrade,
Rainforest Alliance y orgánicas.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.certificacion import Certificacion
from models.productor import Productor
from schemas.certificacion import (
    CertificacionCreate,
    CertificacionUpdate,
    CertificacionResponse,
)
from services.hash_service import generar_hash_certificacion
from auth import get_current_user

router = APIRouter()


@router.post("/", response_model=CertificacionResponse, status_code=status.HTTP_201_CREATED)
def crear_certificacion(
    cert: CertificacionCreate, 
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """Registra una nueva certificación con hash de integridad."""
    # Verificar productor
    productor = db.query(Productor).filter(Productor.id == cert.productor_id).first()
    if not productor:
        raise HTTPException(status_code=404, detail="Productor no encontrado")

    # Generar hash de integridad
    hash_cert = generar_hash_certificacion(
        numero_certificado=cert.numero_certificado,
        tipo=cert.tipo,
        entidad_certificadora=cert.entidad_certificadora,
        fecha_emision=cert.fecha_emision,
        productor_id=cert.productor_id,
    )

    db_cert = Certificacion(
        **cert.model_dump(),
        hash_certificacion=hash_cert,
    )
    db.add(db_cert)
    db.commit()
    db.refresh(db_cert)
    return db_cert


@router.get("/", response_model=List[CertificacionResponse])
def listar_certificaciones(
    skip: int = 0,
    limit: int = 100,
    tipo: str = None,
    productor_id: int = None,
    db: Session = Depends(get_db),
):
    """Lista certificaciones con filtros."""
    query = db.query(Certificacion)
    if tipo:
        query = query.filter(Certificacion.tipo == tipo)
    if productor_id:
        query = query.filter(Certificacion.productor_id == productor_id)
    return query.offset(skip).limit(limit).all()


@router.get("/{cert_id}", response_model=CertificacionResponse)
def obtener_certificacion(cert_id: int, db: Session = Depends(get_db)):
    """Obtiene una certificación por su ID."""
    cert = db.query(Certificacion).filter(Certificacion.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificación no encontrada")
    return cert


@router.put("/{cert_id}", response_model=CertificacionResponse)
def actualizar_certificacion(
    cert_id: int,
    datos: CertificacionUpdate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """Actualiza campos administrativos de una certificación."""
    cert = db.query(Certificacion).filter(Certificacion.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificación no encontrada")

    datos_actualizados = datos.model_dump(exclude_unset=True)
    for campo, valor in datos_actualizados.items():
        setattr(cert, campo, valor)

    db.commit()
    db.refresh(cert)
    return cert


@router.get("/productor/{productor_id}", response_model=List[CertificacionResponse])
def certificaciones_por_productor(productor_id: int, db: Session = Depends(get_db)):
    """Obtiene todas las certificaciones de un productor."""
    certs = (
        db.query(Certificacion)
        .filter(Certificacion.productor_id == productor_id)
        .all()
    )
    return certs
