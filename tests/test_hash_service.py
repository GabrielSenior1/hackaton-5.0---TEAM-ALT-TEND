"""
Tests para el servicio de hashing SHA-256.
Verifica la generación y validación de hashes de trazabilidad.
"""

import pytest
from datetime import datetime
from services.hash_service import (
    generar_hash_lote,
    verificar_hash_lote,
    generar_hash_certificacion,
)


class TestHashLote:
    """Tests para hashes de lotes de cacao."""

    def test_generar_hash_retorna_hex_64_caracteres(self):
        """El hash SHA-256 debe tener exactamente 64 caracteres hexadecimales."""
        hash_hex, datos_json = generar_hash_lote(
            codigo="LOT-2026-001",
            productor_id=1,
            variedad="Criollo",
            peso_kg=50.0,
            fecha_cosecha=datetime(2026, 3, 15),
            origen="Minca, Sierra Nevada",
        )
        assert len(hash_hex) == 64
        assert all(c in "0123456789abcdef" for c in hash_hex)

    def test_generar_hash_retorna_datos_json(self):
        """Debe retornar el JSON de los datos usados para el hash."""
        _, datos_json = generar_hash_lote(
            codigo="LOT-2026-001",
            productor_id=1,
            variedad="Criollo",
            peso_kg=50.0,
            fecha_cosecha=datetime(2026, 3, 15),
        )
        assert "LOT-2026-001" in datos_json
        assert "Criollo" in datos_json

    def test_verificar_hash_valido(self):
        """Verificación debe retornar True si los datos no fueron alterados."""
        hash_hex, datos_json = generar_hash_lote(
            codigo="LOT-2026-002",
            productor_id=2,
            variedad="Trinitario",
            peso_kg=30.0,
            fecha_cosecha=datetime(2026, 4, 10),
        )
        assert verificar_hash_lote(datos_json, hash_hex) is True

    def test_verificar_hash_invalido(self):
        """Verificación debe retornar False si los datos fueron alterados."""
        _, datos_json = generar_hash_lote(
            codigo="LOT-2026-003",
            productor_id=3,
            variedad="Forastero",
            peso_kg=25.0,
            fecha_cosecha=datetime(2026, 5, 1),
        )
        hash_falso = "a" * 64
        assert verificar_hash_lote(datos_json, hash_falso) is False

    def test_datos_diferentes_producen_hash_diferente(self):
        """Lotes con datos diferentes deben tener hashes diferentes."""
        hash1, _ = generar_hash_lote(
            codigo="LOT-2026-A",
            productor_id=1,
            variedad="Criollo",
            peso_kg=50.0,
            fecha_cosecha=datetime(2026, 3, 15),
        )
        hash2, _ = generar_hash_lote(
            codigo="LOT-2026-B",
            productor_id=1,
            variedad="Criollo",
            peso_kg=50.0,
            fecha_cosecha=datetime(2026, 3, 15),
        )
        assert hash1 != hash2


class TestHashCertificacion:
    """Tests para hashes de certificaciones."""

    def test_generar_hash_certificacion(self):
        """El hash de certificación debe tener 64 caracteres."""
        hash_cert = generar_hash_certificacion(
            numero_certificado="FT-2026-COL-001",
            tipo="Fairtrade",
            entidad_certificadora="FLOCERT",
            fecha_emision=datetime(2026, 1, 1),
            productor_id=1,
        )
        assert len(hash_cert) == 64

    def test_mismos_datos_mismo_hash(self):
        """Los mismos datos deben producir el mismo hash."""
        params = {
            "numero_certificado": "RA-2026-001",
            "tipo": "Rainforest Alliance",
            "entidad_certificadora": "SAN",
            "fecha_emision": datetime(2026, 6, 1),
            "productor_id": 2,
        }
        hash1 = generar_hash_certificacion(**params)
        hash2 = generar_hash_certificacion(**params)
        assert hash1 == hash2
