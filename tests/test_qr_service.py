"""
Tests para el servicio de generación de códigos QR.
"""

import pytest
import os
from services.qr_service import generar_qr_bytes


class TestQRService:
    """Tests para la generación de QR."""

    def test_generar_qr_bytes_retorna_png(self):
        """generar_qr_bytes debe retornar bytes de imagen PNG válidos."""
        qr_bytes = generar_qr_bytes("https://ejemplo.com/test")
        assert isinstance(qr_bytes, bytes)
        assert len(qr_bytes) > 0
        # Verificar que empieza con la firma PNG
        assert qr_bytes[:8] == b"\x89PNG\r\n\x1a\n"

    def test_qr_bytes_datos_diferentes(self):
        """QR con datos diferentes deben producir imágenes diferentes."""
        qr1 = generar_qr_bytes("https://ejemplo.com/productor/1")
        qr2 = generar_qr_bytes("https://ejemplo.com/productor/2")
        assert qr1 != qr2

    def test_qr_bytes_contenido_largo(self):
        """Debe manejar contenido largo (como URLs con hash)."""
        url_larga = "https://ejemplo.com/verificar/LOT-2026-001?hash=" + "a" * 64
        qr_bytes = generar_qr_bytes(url_larga)
        assert isinstance(qr_bytes, bytes)
        assert len(qr_bytes) > 0
