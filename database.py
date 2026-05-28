"""
Configuración de la base de datos SQLite con SQLAlchemy.
Provee la sesión de base de datos y el Base para los modelos.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config import get_settings

settings = get_settings()

# ── Engine ───────────────────────────────────────────────
# connect_args necesario para SQLite (permite uso multi-thread)
engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},
    echo=settings.debug,
)

# ── Session ──────────────────────────────────────────────
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ── Base ─────────────────────────────────────────────────
Base = declarative_base()


def get_db():
    """
    Dependency de FastAPI que provee una sesión de base de datos.
    Se cierra automáticamente al finalizar el request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
