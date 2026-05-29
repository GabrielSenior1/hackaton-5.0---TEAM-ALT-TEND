"""
Router de Productores — CRUD completo para los productores
de cacao de la Sierra Nevada del Magdalena.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.productor import Productor
from schemas.productor import ProductorCreate, ProductorUpdate, ProductorResponse
from auth import get_current_user

router = APIRouter()


@router.post("/", response_model=ProductorResponse, status_code=status.HTTP_201_CREATED)
def crear_productor(
    productor: ProductorCreate, 
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """Registra un nuevo productor de cacao."""
    # Verificar que la cédula no exista
    existente = db.query(Productor).filter(Productor.cedula == productor.cedula).first()
    if existente:
        raise HTTPException(
            status_code=400,
            detail=f"Ya existe un productor con la cédula {productor.cedula}",
        )

    db_productor = Productor(**productor.model_dump())
    db.add(db_productor)
    db.commit()
    db.refresh(db_productor)
    return db_productor


@router.get("/", response_model=List[ProductorResponse])
def listar_productores(
    skip: int = 0,
    limit: int = 100,
    activo: int = None,
    db: Session = Depends(get_db),
):
    """Lista todos los productores con paginación."""
    query = db.query(Productor)
    if activo is not None:
        query = query.filter(Productor.activo == activo)
    return query.offset(skip).limit(limit).all()


@router.get("/{productor_id}", response_model=ProductorResponse)
def obtener_productor(productor_id: int, db: Session = Depends(get_db)):
    """Obtiene un productor por su ID (incluye historia para turistas)."""
    productor = db.query(Productor).filter(Productor.id == productor_id).first()
    if not productor:
        raise HTTPException(status_code=404, detail="Productor no encontrado")
    return productor


@router.put("/{productor_id}", response_model=ProductorResponse)
def actualizar_productor(
    productor_id: int,
    datos: ProductorUpdate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """Actualiza los datos de un productor."""
    productor = db.query(Productor).filter(Productor.id == productor_id).first()
    if not productor:
        raise HTTPException(status_code=404, detail="Productor no encontrado")

    datos_actualizados = datos.model_dump(exclude_unset=True)
    for campo, valor in datos_actualizados.items():
        setattr(productor, campo, valor)

    db.commit()
    db.refresh(productor)
    return productor


@router.delete("/{productor_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_productor(
    productor_id: int, 
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user)
):
    """Desactiva un productor (soft delete)."""
    productor = db.query(Productor).filter(Productor.id == productor_id).first()
    if not productor:
        raise HTTPException(status_code=404, detail="Productor no encontrado")

    productor.activo = 0
    db.commit()
    return None
