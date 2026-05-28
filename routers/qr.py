"""
Router de QR — Genera códigos QR dinámicos para productores,
lotes y rutas turísticas. Listos para imprimir en etiquetas
o menús de hoteles.
"""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from database import get_db
from models.productor import Productor
from models.lote import Lote
from services.qr_service import (
    generar_qr_productor,
    generar_qr_lote,
    generar_qr_ruta_turistica,
    generar_qr_bytes,
)

router = APIRouter()


@router.get("/productor/{productor_id}")
def qr_productor(productor_id: int, db: Session = Depends(get_db)):
    """
    Genera un QR único para un productor.
    El turista escanea → ve la historia del productor → puede comprar.
    """
    productor = db.query(Productor).filter(Productor.id == productor_id).first()
    if not productor:
        raise HTTPException(status_code=404, detail="Productor no encontrado")

    ruta_qr = generar_qr_productor(
        productor_id=productor.id,
        nombre_productor=productor.nombre,
    )

    return {
        "productor_id": productor.id,
        "nombre": productor.nombre,
        "qr_url": f"/static/qr_codes/productor_{productor.id}.png",
        "qr_archivo": ruta_qr,
        "mensaje": "QR generado exitosamente. Listo para imprimir.",
    }


@router.get("/productor/{productor_id}/imagen")
def qr_productor_imagen(productor_id: int, db: Session = Depends(get_db)):
    """Retorna directamente la imagen QR del productor (para mostrar en el frontend)."""
    productor = db.query(Productor).filter(Productor.id == productor_id).first()
    if not productor:
        raise HTTPException(status_code=404, detail="Productor no encontrado")

    from config import get_settings
    settings = get_settings()
    url = f"{settings.qr_base_url}/api/v1/productores/{productor_id}"
    qr_bytes = generar_qr_bytes(url)

    return Response(content=qr_bytes, media_type="image/png")


@router.get("/lote/{lote_codigo}")
def qr_lote(lote_codigo: str, db: Session = Depends(get_db)):
    """
    Genera un QR de verificación para un lote de cacao.
    Incluye el hash de trazabilidad para que el comprador pueda verificar.
    """
    lote = db.query(Lote).filter(Lote.codigo == lote_codigo).first()
    if not lote:
        raise HTTPException(status_code=404, detail="Lote no encontrado")

    ruta_qr = generar_qr_lote(
        lote_codigo=lote.codigo,
        hash_trazabilidad=lote.hash_trazabilidad,
    )

    return {
        "lote_codigo": lote.codigo,
        "hash_trazabilidad": lote.hash_trazabilidad,
        "qr_url": f"/static/qr_codes/lote_{lote.codigo}.png",
        "qr_archivo": ruta_qr,
        "mensaje": "QR de verificación generado. El comprador puede escanear para verificar autenticidad.",
    }


@router.get("/lote/{lote_codigo}/imagen")
def qr_lote_imagen(lote_codigo: str, db: Session = Depends(get_db)):
    """Retorna directamente la imagen QR del lote."""
    lote = db.query(Lote).filter(Lote.codigo == lote_codigo).first()
    if not lote:
        raise HTTPException(status_code=404, detail="Lote no encontrado")

    from config import get_settings
    settings = get_settings()
    url = f"{settings.qr_base_url}/api/v1/verificar/{lote_codigo}?hash={lote.hash_trazabilidad}"
    qr_bytes = generar_qr_bytes(url)

    return Response(content=qr_bytes, media_type="image/png")


@router.get("/ruta/{ruta_id}")
def qr_ruta_turistica(ruta_id: int):
    """Genera un QR para una ruta turística del Magdalena."""
    ruta_qr = generar_qr_ruta_turistica(ruta_id)

    return {
        "ruta_id": ruta_id,
        "qr_url": f"/static/qr_codes/ruta_{ruta_id}.png",
        "qr_archivo": ruta_qr,
        "mensaje": "QR de ruta turística generado.",
    }
