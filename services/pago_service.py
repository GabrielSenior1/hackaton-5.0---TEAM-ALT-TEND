"""
Servicio de Pagos — Integración con Stripe para pagos
internacionales de cacao y experiencias turísticas.

Distribuye comisiones automáticamente:
  - 70% para el productor rural
  - 15% para el operador turístico
  - 15% para la plataforma
"""

import stripe
from typing import Optional

from config import get_settings

settings = get_settings()

# ── Configurar Stripe ────────────────────────────────────
stripe.api_key = settings.stripe_secret_key

# ── Comisiones por defecto ───────────────────────────────
COMISION_PRODUCTOR = 0.70   # 70%
COMISION_OPERADOR = 0.15    # 15%
COMISION_PLATAFORMA = 0.15  # 15%


def crear_checkout_session(
    monto_usd: float,
    nombre_producto: str,
    descripcion: str,
    success_url: str,
    cancel_url: str,
    metadata: Optional[dict] = None,
) -> dict:
    """
    Crea una sesión de Stripe Checkout para el pago de cacao.

    Args:
        monto_usd: Monto en dólares americanos.
        nombre_producto: Nombre del producto (e.g., "Cacao Criollo - Lote LOT-2026-001").
        descripcion: Descripción del producto.
        success_url: URL de redirección tras pago exitoso.
        cancel_url: URL de redirección tras cancelación.
        metadata: Datos adicionales (lote_id, productor_id, etc.).

    Returns:
        dict con session_id y checkout_url.
    """
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            billing_address_collection="required",
            shipping_address_collection={
                "allowed_countries": ["CO", "US", "ES", "GB"],
            },
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": nombre_producto,
                            "description": descripcion,
                        },
                        "unit_amount": int(monto_usd * 100),  # Stripe usa centavos
                    },
                    "quantity": 1,
                },
            ],
            mode="payment",
            success_url=success_url + "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=cancel_url,
            metadata=metadata or {},
        )

        return {
            "session_id": session.id,
            "checkout_url": session.url,
            "monto_usd": monto_usd,
        }

    except stripe.error.StripeError as e:
        raise Exception(f"Error de Stripe: {str(e)}")


def crear_checkout_cart(
    items: list,
    comprador_email: str,
    success_url: str,
    cancel_url: str,
    metadata: Optional[dict] = None,
) -> dict:
    """
    Crea una sesión de Stripe Checkout para un carrito de compras genérico.
    Args:
        items: Lista de diccionarios con 'name', 'description', 'price' (USD) y 'quantity'.
        comprador_email: Email del comprador para prellenar Stripe.
        success_url: URL de redirección tras pago exitoso.
        cancel_url: URL de redirección tras cancelación.
    """
    try:
        line_items = []
        monto_usd = 0
        for item in items:
            line_items.append({
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": item.get("name", "Producto Kanku"),
                        "description": item.get("description", ""),
                    },
                    "unit_amount": int(float(item.get("price", 0)) * 100),
                },
                "quantity": int(item.get("quantity", 1)),
            })
            monto_usd += float(item.get("price", 0)) * int(item.get("quantity", 1))

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            billing_address_collection="required",
            shipping_address_collection={
                "allowed_countries": ["CO", "US", "ES", "GB"],
            },
            customer_email=comprador_email if comprador_email else None,
            line_items=line_items,
            mode="payment",
            success_url=success_url + "?session_id={CHECKOUT_SESSION_ID}",
            cancel_url=cancel_url,
            metadata=metadata or {},
        )

        return {
            "session_id": session.id,
            "checkout_url": session.url,
            "monto_usd": monto_usd,
        }

    except stripe.error.StripeError as e:
        raise Exception(f"Error de Stripe: {str(e)}")


def verificar_pago(session_id: str) -> dict:
    """
    Verifica el estado de un pago en Stripe.
    """
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        return {
            "session_id": session.id,
            "estado": session.payment_status,
            "monto": session.amount_total / 100 if session.amount_total else 0,
            "moneda": session.currency,
            "email_cliente": session.customer_details.email if session.customer_details else None,
        }
    except stripe.error.StripeError as e:
        raise Exception(f"Error al verificar pago: {str(e)}")


def calcular_comisiones(monto_total: float) -> dict:
    """
    Calcula la distribución de comisiones para una transacción.

    Returns:
        dict con las comisiones desglosadas.
    """
    return {
        "monto_total": monto_total,
        "productor": round(monto_total * COMISION_PRODUCTOR, 2),
        "operador": round(monto_total * COMISION_OPERADOR, 2),
        "plataforma": round(monto_total * COMISION_PLATAFORMA, 2),
    }
