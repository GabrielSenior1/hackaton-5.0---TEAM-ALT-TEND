"""
Configuración central de la aplicación Cacao de la Sierra.
Carga las variables de entorno desde .env usando pydantic-settings.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Configuración de la aplicación cargada desde variables de entorno."""

    # ── App ──────────────────────────────────────────────
    app_name: str = "Cacao de la Sierra"
    app_version: str = "1.0.0"
    debug: bool = True

    # ── Database ─────────────────────────────────────────
    database_url: str = "sqlite:///./cacao_sierra.db"

    # ── Stripe ───────────────────────────────────────────
    stripe_secret_key: str = ""
    stripe_publishable_key: str = ""
    stripe_webhook_secret: str = ""

    # ── QR ───────────────────────────────────────────────
    qr_base_url: str = "http://localhost:8000"
    qr_output_dir: str = "static/qr_codes"

    # ── CORS ─────────────────────────────────────────────
    frontend_url: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Retorna la configuración cacheada (singleton)."""
    return Settings()
