"""
Utilidades generales para Cacao de la Sierra.
"""

from datetime import datetime
import re


def generar_codigo_lote(productor_id: int, secuencia: int) -> str:
    """
    Genera un código único para un lote de cacao.

    Formato: LOT-{AÑO}-{PRODUCTOR_ID}-{SECUENCIA}
    Ejemplo: LOT-2026-003-001
    """
    año = datetime.now().year
    return f"LOT-{año}-{productor_id:03d}-{secuencia:03d}"


def formatear_cop(monto_usd: float, tasa_cambio: float = 4200.0) -> str:
    """Convierte USD a COP y formatea como moneda colombiana."""
    cop = monto_usd * tasa_cambio
    return f"${cop:,.0f} COP"


def validar_cedula(cedula: str) -> bool:
    """Valida que una cédula colombiana tenga formato válido."""
    return bool(re.match(r"^\d{6,10}$", cedula.strip()))


def sanitizar_nombre_archivo(nombre: str) -> str:
    """Sanitiza un nombre para usarlo como nombre de archivo."""
    return re.sub(r"[^\w\-.]", "_", nombre.lower().strip())
