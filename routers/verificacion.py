"""
Router de Verificación — Permite a compradores internacionales
verificar la autenticidad de un lote de cacao usando su hash SHA-256.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models.lote import Lote
from models.certificacion import Certificacion
from schemas.lote import LoteVerificacion, LoteVerificacionResponse
from services.hash_service import verificar_hash_lote

router = APIRouter()


@router.get("/{lote_codigo}")
def verificar_lote(
    lote_codigo: str,
    hash: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Verifica la autenticidad de un lote de cacao.

    Si se proporciona el parámetro 'hash', compara con el hash almacenado.
    Si no, retorna los datos del lote para inspección manual.

    Este endpoint es el destino de los códigos QR escaneados por compradores.
    """
    lote = db.query(Lote).filter(Lote.codigo == lote_codigo).first()
    if not lote:
        raise HTTPException(status_code=404, detail="Lote no encontrado")

    # Si se proporcionó un hash, verificar
    if hash:
        es_valido = hash == lote.hash_trazabilidad
        return {
            "codigo": lote.codigo,
            "es_valido": es_valido,
            "mensaje": (
                "✅ Lote verificado: los datos son auténticos y no han sido alterados."
                if es_valido
                else "❌ Verificación fallida: el hash no coincide. Los datos pueden haber sido alterados."
            ),
            "lote": {
                "variedad": lote.variedad,
                "peso_kg": lote.peso_kg,
                "estado": lote.estado,
                "origen": lote.origen,
                "hash_trazabilidad": lote.hash_trazabilidad,
            },
        }

    # Sin hash: retornar datos del lote para inspección
    return {
        "codigo": lote.codigo,
        "variedad": lote.variedad,
        "peso_kg": lote.peso_kg,
        "estado": lote.estado,
        "origen": lote.origen,
        "hash_trazabilidad": lote.hash_trazabilidad,
        "fecha_cosecha": lote.fecha_cosecha,
        "notas_cata": lote.notas_cata,
        "puntaje_calidad": lote.puntaje_calidad,
    }


@router.post("/validar")
def validar_integridad(datos: LoteVerificacion, db: Session = Depends(get_db)):
    """
    Endpoint POST para validación formal de integridad.
    El comprador envía el código del lote y el hash que tiene.
    """
    lote = db.query(Lote).filter(Lote.codigo == datos.codigo).first()
    if not lote:
        raise HTTPException(status_code=404, detail="Lote no encontrado")

    es_valido = datos.hash_proporcionado == lote.hash_trazabilidad

    return LoteVerificacionResponse(
        codigo=datos.codigo,
        es_valido=es_valido,
        hash_almacenado=lote.hash_trazabilidad,
        hash_proporcionado=datos.hash_proporcionado,
        mensaje=(
            "✅ Verificación exitosa: el lote es auténtico."
            if es_valido
            else "❌ Verificación fallida: el hash no coincide."
        ),
    )


@router.get("/certificacion/{numero_certificado}")
def verificar_certificacion(numero_certificado: str, db: Session = Depends(get_db)):
    """
    Verifica la autenticidad de una certificación Fairtrade o Rainforest Alliance.
    """
    cert = (
        db.query(Certificacion)
        .filter(Certificacion.numero_certificado == numero_certificado)
        .first()
    )
    if not cert:
        raise HTTPException(status_code=404, detail="Certificación no encontrada")

    return {
        "numero_certificado": cert.numero_certificado,
        "tipo": cert.tipo,
        "entidad_certificadora": cert.entidad_certificadora,
        "estado": cert.estado,
        "fecha_emision": cert.fecha_emision,
        "fecha_vencimiento": cert.fecha_vencimiento,
        "hash_integridad": cert.hash_certificacion,
        "es_vigente": cert.estado == "vigente",
    }
