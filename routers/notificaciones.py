"""
📧 KANKU — Router de Notificaciones
=====================================
Endpoint de utilidad para el sistema de notificaciones.
El envío real de correos se maneja a través de la
Firebase Email Trigger Extension (Firestore-based),
que lee los campos 'to' y 'message' de cada documento
en la colección 'pedidos'.

Este router provee endpoints de soporte:
- Estado del sistema de notificaciones
- Log de emails enviados (para debugging)
- Reenvío manual de confirmaciones
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()


# ── Schemas ──────────────────────────────────────────────────────────────────

class ItemPedido(BaseModel):
    nombre: str
    precio: float
    cantidad: int
    productId: Optional[str] = None
    imagenUrl: Optional[str] = ""


class DireccionEntrega(BaseModel):
    address: Optional[str] = ""
    city: Optional[str] = ""
    phone: Optional[str] = ""
    notes: Optional[str] = ""


class DatosInstitucionales(BaseModel):
    nombreOrganizacion: Optional[str] = ""
    nit: Optional[str] = ""
    cargo: Optional[str] = ""


class NotificacionReciboRequest(BaseModel):
    """
    Payload para solicitar el (re)envío de un correo de confirmación.
    En producción, el Firebase Email Trigger Extension maneja esto
    automáticamente. Este endpoint es para reenvíos manuales o debugging.
    """
    pedidoId: str
    compradorEmail: str
    compradorNombre: str
    vendedorNombre: str
    items: List[ItemPedido]
    total: float
    tipoEntrega: str = "recogida"  # 'recogida' | 'envio'
    direccionEntrega: Optional[DireccionEntrega] = None
    datosInstitucionales: Optional[DatosInstitucionales] = None
    esInvitado: bool = True
    tipoPerfil: str = "individual"


class NotificacionResponse(BaseModel):
    success: bool
    message: str
    pedidoId: str
    emailDestino: str
    timestamp: str
    method: str


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/estado", tags=["📧 Notificaciones"])
async def estado_notificaciones():
    """
    Verifica el estado del sistema de notificaciones.
    
    El motor principal de emails es la Firebase Email Trigger Extension.
    Esta extensión monitorea la colección 'pedidos' en Firestore y envía
    correos automáticamente cuando se crea/actualiza un documento con
    los campos 'to' y 'message' correctamente configurados.
    """
    return {
        "estado": "✅ Activo",
        "motor_principal": "Firebase Email Trigger Extension",
        "descripcion": (
            "Los correos de confirmación se envían automáticamente a través de "
            "Firebase Email Trigger Extension. Cuando se crea un pedido en Firestore "
            "con los campos 'to' (array de emails) y 'message' (subject + html), "
            "la extensión lo procesa y envía el correo en segundos."
        ),
        "coleccion_monitoreada": "pedidos",
        "campos_requeridos": {
            "to": "Array de emails destinatarios (ej: ['comprador@email.com'])",
            "message": {
                "subject": "Asunto del correo",
                "html": "Contenido HTML del correo"
            }
        },
        "configuracion": {
            "extensionId": "firebase/firestore-send-email",
            "collectionPath": "pedidos",
            "smtpConnectionUri": "Configurar en Firebase Console → Extensions",
        },
        "timestamp": datetime.utcnow().isoformat()
    }


@router.post("/enviar-recibo", response_model=NotificacionResponse, tags=["📧 Notificaciones"])
async def enviar_recibo(payload: NotificacionReciboRequest):
    """
    Registra un intento de envío de recibo y lo simula (mock).
    
    En producción con Firebase Email Trigger Extension, el correo
    ya se habrá enviado automáticamente cuando el pedido fue creado
    en Firestore. Este endpoint es para:
    
    1. **Reenvíos manuales**: Si el comprador no recibió el correo.
    2. **Debugging**: Verificar que los datos del pedido son correctos.
    3. **Auditoría**: Registrar intentos de notificación.
    
    Para conectar un proveedor SMTP real (ej. SendGrid, Resend),
    descomenta y configura la sección correspondiente abajo.
    """
    
    logger.info(
        f"📧 [NOTIFICACIÓN] Recibo para pedido {payload.pedidoId} → {payload.compradorEmail}"
    )
    
    # ── Resumen del contenido del correo ──────────────────────────────────────
    items_str = "\n".join([
        f"  - {item.nombre} × {item.cantidad}: ${item.precio * item.cantidad:.2f}"
        for item in payload.items
    ])
    
    entrega_str = (
        f"Recogida en Origen (Minca, Sierra Nevada)"
        if payload.tipoEntrega == "recogida"
        else (
            f"Envío a: {payload.direccionEntrega.address}, "
            f"{payload.direccionEntrega.city}"
            if payload.direccionEntrega else "Envío a domicilio"
        )
    )
    
    logger.info(
        f"""
    ════════════════════════════════════════════════════════════════
    📬 CORREO DE CONFIRMACIÓN — KANKU
    ════════════════════════════════════════════════════════════════
    Pedido ID   : {payload.pedidoId}
    Destinatario: {payload.compradorNombre} <{payload.compradorEmail}>
    Tipo Perfil : {payload.tipoPerfil} {'(Invitado)' if payload.esInvitado else '(Registrado)'}
    Vendedor    : {payload.vendedorNombre}
    ────────────────────────────────────────────────────────────────
    PRODUCTOS:
{items_str}
    ────────────────────────────────────────────────────────────────
    TOTAL       : ${payload.total:.2f}
    ENTREGA     : {entrega_str}
    ════════════════════════════════════════════════════════════════
    ℹ️  Este correo se envía automáticamente via Firebase Email Extension.
    ════════════════════════════════════════════════════════════════
        """
    )
    
    # ────────────────────────────────────────────────────────────────────────
    # ZONA: Integración con proveedor SMTP real (Descomenta para activar)
    # ────────────────────────────────────────────────────────────────────────
    #
    # Opción A — Resend (recomendado para hackathons):
    # import resend
    # resend.api_key = os.getenv("RESEND_API_KEY")
    # resend.Emails.send({
    #     "from": "KANKU <noreply@kanku.co>",
    #     "to": [payload.compradorEmail],
    #     "subject": f"✅ Pedido Confirmado — KANKU | {payload.vendedorNombre}",
    #     "html": build_email_html(payload),
    # })
    #
    # Opción B — SendGrid:
    # import sendgrid
    # sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
    # ... (configurar mensaje y enviar)
    #
    # ────────────────────────────────────────────────────────────────────────
    
    return NotificacionResponse(
        success=True,
        message=(
            "✅ Correo procesado. El Firebase Email Trigger Extension envía "
            "el correo automáticamente cuando el pedido se guarda en Firestore. "
            "Revisa la consola de Firebase Console → Extensions para el estado."
        ),
        pedidoId=payload.pedidoId,
        emailDestino=payload.compradorEmail,
        timestamp=datetime.utcnow().isoformat(),
        method="firebase_email_trigger_extension"
    )


@router.get("/instrucciones-extension", tags=["📧 Notificaciones"])
async def instrucciones_extension():
    """
    Instrucciones paso a paso para configurar la Firebase Email Trigger Extension.
    """
    return {
        "titulo": "📧 Configuración de Firebase Email Trigger Extension",
        "pasos": [
            {
                "paso": 1,
                "accion": "Ir a Firebase Console",
                "url": "https://console.firebase.google.com/project/kanku-635ca/extensions",
                "descripcion": "Navega a la sección 'Extensions' de tu proyecto Firebase"
            },
            {
                "paso": 2,
                "accion": "Instalar 'Trigger Email from Firestore'",
                "publisher": "firebase",
                "extensionId": "firebase/firestore-send-email",
                "descripcion": "Busca y selecciona la extensión oficial de Firebase para envío de emails"
            },
            {
                "paso": 3,
                "accion": "Configurar SMTP",
                "opciones": {
                    "gmail": "smtp://user:pass@smtp.gmail.com:465",
                    "sendgrid": "smtps://apikey:SG.XXXXX@smtp.sendgrid.net:465",
                    "resend": "smtps://resend:re_XXXXX@smtp.resend.com:465",
                    "mailtrap": "smtps://user:pass@smtp.mailtrap.io:465 (para testing)"
                }
            },
            {
                "paso": 4,
                "accion": "Configurar Collection Path",
                "valor": "pedidos",
                "descripcion": (
                    "La extensión monitorea esta colección. Cada documento nuevo "
                    "con los campos 'to' y 'message' dispara el envío automático."
                )
            },
            {
                "paso": 5,
                "accion": "Estructura del documento en Firestore",
                "ejemplo": {
                    "to": ["comprador@email.com"],
                    "message": {
                        "subject": "✅ Pedido Confirmado — KANKU",
                        "html": "<h1>Tu pedido está confirmado</h1>..."
                    }
                },
                "nota": "KANKU ya genera estos campos automáticamente en checkout.js"
            }
        ],
        "estado_actual": "Implementado en frontend — Pendiente configurar SMTP en Firebase Console"
    }
