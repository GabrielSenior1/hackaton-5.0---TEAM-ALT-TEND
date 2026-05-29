"""
Router de Lotes — Gestión de lotes de cacao con trazabilidad SHA-256.
Cada lote se registra con un hash inmutable para garantizar la autenticidad.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.lote import Lote
from models.productor import Productor
from schemas.lote import LoteCreate, LoteUpdate, LoteResponse
from services.hash_service import generar_hash_lote
from auth import get_current_user

router = APIRouter()


@router.post("/", response_model=LoteResponse, status_code=status.HTTP_201_CREATED)
def crear_lote(
    lote: LoteCreate, 
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """
    Registra un nuevo lote de cacao y genera su hash de trazabilidad SHA-256.
    Una vez generado, el hash no puede ser modificado.
    """
    # Verificar que el productor exista
    productor = db.query(Productor).filter(Productor.id == lote.productor_id).first()
    if not productor:
        raise HTTPException(status_code=404, detail="Productor no encontrado")

    # Verificar que el código no exista
    existente = db.query(Lote).filter(Lote.codigo == lote.codigo).first()
    if existente:
        raise HTTPException(
            status_code=400,
            detail=f"Ya existe un lote con el código {lote.codigo}",
        )

    # Generar hash de trazabilidad
    hash_trazabilidad, datos_hash = generar_hash_lote(
        codigo=lote.codigo,
        productor_id=lote.productor_id,
        variedad=lote.variedad,
        peso_kg=lote.peso_kg,
        fecha_cosecha=lote.fecha_cosecha,
        origen=lote.origen,
    )

    db_lote = Lote(
        **lote.model_dump(),
        hash_trazabilidad=hash_trazabilidad,
        datos_hash=datos_hash,
    )
    db.add(db_lote)
    db.commit()
    db.refresh(db_lote)
    return db_lote


@router.get("/", response_model=List[LoteResponse])
def listar_lotes(
    skip: int = 0,
    limit: int = 100,
    estado: str = None,
    productor_id: int = None,
    db: Session = Depends(get_db),
):
    """Lista lotes con filtros opcionales por estado y productor."""
    query = db.query(Lote)
    if estado:
        query = query.filter(Lote.estado == estado)
    if productor_id:
        query = query.filter(Lote.productor_id == productor_id)
    return query.offset(skip).limit(limit).all()


@router.get("/{lote_id}", response_model=LoteResponse)
def obtener_lote(lote_id: int, db: Session = Depends(get_db)):
    """Obtiene un lote por su ID incluyendo el hash de trazabilidad."""
    lote = db.query(Lote).filter(Lote.id == lote_id).first()
    if not lote:
        raise HTTPException(status_code=404, detail="Lote no encontrado")
    return lote


@router.get("/codigo/{codigo}", response_model=LoteResponse)
def obtener_lote_por_codigo(codigo: str, db: Session = Depends(get_db)):
    """Busca un lote por su código único."""
    lote = db.query(Lote).filter(Lote.codigo == codigo).first()
    if not lote:
        raise HTTPException(status_code=404, detail="Lote no encontrado")
    return lote


@router.put("/{lote_id}", response_model=LoteResponse)
def actualizar_lote(
    lote_id: int,
    datos: LoteUpdate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """
    Actualiza campos NO SENSIBLES del lote (estado, destino, notas).
    Los datos que generaron el hash NO pueden ser modificados.
    """
    lote = db.query(Lote).filter(Lote.id == lote_id).first()
    if not lote:
        raise HTTPException(status_code=404, detail="Lote no encontrado")

    datos_actualizados = datos.model_dump(exclude_unset=True)
    for campo, valor in datos_actualizados.items():
        setattr(lote, campo, valor)

    db.commit()
    db.refresh(lote)
    return lote
