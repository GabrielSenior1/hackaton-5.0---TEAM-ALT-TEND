"""
Servicio de Hashing — Genera y verifica hashes SHA-256
para la trazabilidad inmutable del cacao.

El hash se genera a partir de los datos críticos del lote:
productor, fecha cosecha, peso, variedad, origen.
Si cualquier dato cambia, el hash falla → inmutabilidad garantizada.
"""

import hashlib
import json
from datetime import datetime
from typing import Optional


def generar_hash_lote(
    codigo: str,
    productor_id: int,
    variedad: str,
    peso_kg: float,
    fecha_cosecha: datetime,
    origen: Optional[str] = None,
) -> tuple[str, str]:
    """
    Genera un hash SHA-256 a partir de los datos críticos de un lote.

    Returns:
        tuple: (hash_hex, datos_json) — El hash y el JSON de los datos usados.
    """
    datos = {
        "codigo": codigo,
        "productor_id": productor_id,
        "variedad": variedad,
        "peso_kg": peso_kg,
        "fecha_cosecha": fecha_cosecha.isoformat(),
        "origen": origen or "Sierra Nevada del Magdalena",
        "timestamp": datetime.utcnow().isoformat(),
    }

    datos_json = json.dumps(datos, sort_keys=True, ensure_ascii=False)
    hash_hex = hashlib.sha256(datos_json.encode("utf-8")).hexdigest()

    return hash_hex, datos_json


def verificar_hash_lote(datos_json: str, hash_almacenado: str) -> bool:
    """
    Verifica si el hash almacenado coincide con los datos originales.

    Args:
        datos_json: El JSON original de los datos del lote.
        hash_almacenado: El hash SHA-256 almacenado en la BD.

    Returns:
        True si el hash es válido (datos no alterados), False si no.
    """
    hash_calculado = hashlib.sha256(datos_json.encode("utf-8")).hexdigest()
    return hash_calculado == hash_almacenado


def generar_hash_certificacion(
    numero_certificado: str,
    tipo: str,
    entidad_certificadora: str,
    fecha_emision: datetime,
    productor_id: int,
) -> str:
    """
    Genera un hash SHA-256 para una certificación Fairtrade/Rainforest Alliance.
    """
    datos = {
        "numero_certificado": numero_certificado,
        "tipo": tipo,
        "entidad_certificadora": entidad_certificadora,
        "fecha_emision": fecha_emision.isoformat(),
        "productor_id": productor_id,
    }

    datos_json = json.dumps(datos, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(datos_json.encode("utf-8")).hexdigest()
