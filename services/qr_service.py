"""
Servicio de QR — Genera códigos QR dinámicos para productores,
fincas y lotes de cacao. Los turistas escanean el QR para ver
la historia del productor y comprar directamente.
"""

import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import RadialGradiantColorMask
from PIL import Image
import os
import io
from typing import Optional

from config import get_settings

settings = get_settings()


def generar_qr_productor(
    productor_id: int,
    nombre_productor: str,
    formato: str = "png",
) -> str:
    """
    Genera un QR que enlaza a la página del productor.

    Args:
        productor_id: ID del productor en la BD.
        nombre_productor: Nombre para el archivo.
        formato: Formato de imagen (png, svg).

    Returns:
        Ruta relativa del archivo QR generado.
    """
    url = f"{settings.qr_base_url}/api/v1/productores/{productor_id}"
    nombre_archivo = f"productor_{productor_id}.{formato}"
    ruta_archivo = os.path.join(settings.qr_output_dir, nombre_archivo)

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    # Generar imagen con estilo premium
    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        color_mask=RadialGradiantColorMask(
            back_color=(255, 255, 255),
            center_color=(89, 60, 31),    # Marrón cacao oscuro
            edge_color=(139, 90, 43),      # Marrón cacao claro
        ),
    )

    os.makedirs(settings.qr_output_dir, exist_ok=True)
    img.save(ruta_archivo)

    return ruta_archivo


def generar_qr_lote(
    lote_codigo: str,
    hash_trazabilidad: str,
) -> str:
    """
    Genera un QR para un lote de cacao que incluye el hash de verificación.
    El comprador puede escanear para verificar la autenticidad.
    """
    url = f"{settings.qr_base_url}/api/v1/verificar/{lote_codigo}"
    nombre_archivo = f"lote_{lote_codigo}.png"
    ruta_archivo = os.path.join(settings.qr_output_dir, nombre_archivo)

    qr = qrcode.QRCode(
        version=2,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    # El QR contiene la URL de verificación + el hash
    datos_qr = f"{url}?hash={hash_trazabilidad}"
    qr.add_data(datos_qr)
    qr.make(fit=True)

    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        color_mask=RadialGradiantColorMask(
            back_color=(255, 255, 255),
            center_color=(34, 87, 46),     # Verde Rainforest
            edge_color=(76, 153, 0),        # Verde claro
        ),
    )

    os.makedirs(settings.qr_output_dir, exist_ok=True)
    img.save(ruta_archivo)

    return ruta_archivo


def generar_qr_ruta_turistica(ruta_id: int) -> str:
    """Genera un QR para una ruta turística."""
    url = f"{settings.qr_base_url}/api/v1/rutas/{ruta_id}"
    nombre_archivo = f"ruta_{ruta_id}.png"
    ruta_archivo = os.path.join(settings.qr_output_dir, nombre_archivo)

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        color_mask=RadialGradiantColorMask(
            back_color=(255, 255, 255),
            center_color=(0, 102, 153),    # Azul turismo
            edge_color=(0, 170, 204),       # Azul claro
        ),
    )

    os.makedirs(settings.qr_output_dir, exist_ok=True)
    img.save(ruta_archivo)

    return ruta_archivo


def generar_qr_bytes(data: str) -> bytes:
    """
    Genera un QR y retorna los bytes de la imagen (para respuesta HTTP directa).
    Útil para generar QR sin guardar en disco.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        color_mask=RadialGradiantColorMask(
            back_color=(255, 255, 255),
            center_color=(89, 60, 31),
            edge_color=(139, 90, 43),
        ),
    )

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)

    return buffer.getvalue()
