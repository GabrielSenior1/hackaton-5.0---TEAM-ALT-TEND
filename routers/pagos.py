"""
Router de Pagos — Integración con Stripe para compras
internacionales de cacao y experiencias turísticas.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.lote import Lote
from models.transaccion import Transaccion
from schemas.transaccion import (
    TransaccionCreate,
    TransaccionResponse,
    CheckoutSessionCreate,
    CheckoutSessionResponse,
)
from services.pago_service import (
    crear_checkout_session,
    verificar_pago,
    calcular_comisiones,
)

router = APIRouter()


@router.post("/checkout", response_model=CheckoutSessionResponse)
def crear_sesion_pago(datos: CheckoutSessionCreate, db: Session = Depends(get_db)):
    """
    Crea una sesión de Stripe Checkout para comprar cacao.
    Retorna la URL de pago donde el comprador completa la transacción.
    """
    # Verificar que el lote existe y está disponible
    lote = db.query(Lote).filter(Lote.id == datos.lote_id).first()
    if not lote:
        raise HTTPException(status_code=404, detail="Lote no encontrado")

    if lote.estado == "vendido":
        raise HTTPException(status_code=400, detail="Este lote ya fue vendido")

    # Calcular precio (ejemplo: precio por kg)
    precio_por_kg = 15.0  # USD por kg — ajustable
    monto_total = round(datos.cantidad_kg * precio_por_kg, 2)

    # Crear sesión en Stripe
    try:
        session = crear_checkout_session(
            monto_usd=monto_total,
            nombre_producto=f"Cacao {lote.variedad} — Lote {lote.codigo}",
            descripcion=f"Cacao orgánico de la Sierra Nevada del Magdalena. "
                        f"{datos.cantidad_kg}kg de variedad {lote.variedad}.",
            success_url=datos.success_url,
            cancel_url=datos.cancel_url,
            metadata={
                "lote_id": str(lote.id),
                "lote_codigo": lote.codigo,
                "cantidad_kg": str(datos.cantidad_kg),
                "comprador": datos.comprador_nombre,
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Registrar transacción como pendiente
    comisiones = calcular_comisiones(monto_total)
    transaccion = Transaccion(
        lote_id=lote.id,
        tipo="compra",
        monto_usd=monto_total,
        moneda_origen="USD",
        stripe_session_id=session["session_id"],
        estado_pago="pendiente",
        comprador_nombre=datos.comprador_nombre,
        comprador_email=datos.comprador_email,
        comprador_pais=datos.comprador_pais,
        comision_productor=comisiones["productor"],
        comision_operador=comisiones["operador"],
        comision_plataforma=comisiones["plataforma"],
    )
    db.add(transaccion)
    db.commit()

    return CheckoutSessionResponse(
        session_id=session["session_id"],
        checkout_url=session["checkout_url"],
        monto_usd=monto_total,
    )


@router.get("/verificar/{session_id}")
def verificar_estado_pago(session_id: str, db: Session = Depends(get_db)):
    """Verifica el estado de un pago en Stripe y actualiza la BD."""
    try:
        estado_stripe = verificar_pago(session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Actualizar transacción en la BD
    transaccion = (
        db.query(Transaccion)
        .filter(Transaccion.stripe_session_id == session_id)
        .first()
    )

    if transaccion and estado_stripe["estado"] == "paid":
        transaccion.estado_pago = "completado"

        # Actualizar estado del lote
        lote = db.query(Lote).filter(Lote.id == transaccion.lote_id).first()
        if lote:
            lote.estado = "vendido"

        db.commit()

    return estado_stripe


@router.get("/comisiones/{monto_usd}")
def calcular_distribucion(monto_usd: float):
    """
    Calcula la distribución de comisiones para un monto dado.
    - 70% productor rural
    - 15% operador turístico
    - 15% plataforma
    """
    return calcular_comisiones(monto_usd)


@router.get("/transacciones", response_model=list[TransaccionResponse])
def listar_transacciones(
    skip: int = 0,
    limit: int = 100,
    estado: str = None,
    db: Session = Depends(get_db),
):
    """Lista todas las transacciones con filtro opcional por estado."""
    query = db.query(Transaccion)
    if estado:
        query = query.filter(Transaccion.estado_pago == estado)
    return query.offset(skip).limit(limit).all()
