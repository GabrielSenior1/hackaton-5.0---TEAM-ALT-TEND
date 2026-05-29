"""Migration script to add `producto` column to existing tables.

This script uses SQLAlchemy's metadata to issue ALTER TABLE statements if the
`producto` column does not exist. It sets a default value of "cacao" for all
existing rows to maintain backward compatibility.
"""

import os
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.exc import OperationalError

# Load settings from config (reuse existing get_settings function)
from config import get_settings

# Database file path (relative to project root)
settings = get_settings()
# Assuming the SQLite DB is located at the project root as defined in config.py
# If the settings provide DATABASE_URL, use it; otherwise fallback to default.
DATABASE_URL = getattr(settings, "database_url", "sqlite:///./cacao_sierra.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


def column_exists(table_name: str, column_name: str) -> bool:
    inspector = inspect(engine)
    columns = [col["name"] for col in inspector.get_columns(table_name)]
    return column_name in columns


def add_producto_column(table_name: str, default: str = "cacao"):
    if column_exists(table_name, "producto"):
        print(f"[✓] Column 'producto' already exists in {table_name}.")
        return
    try:
        with engine.begin() as conn:
            # SQLite does not support adding a column with a non‑NULL default directly.
            # We add the column as nullable, then populate it, then alter to NOT NULL if needed.
            conn.execute(text(f"ALTER TABLE {table_name} ADD COLUMN producto TEXT"))
            conn.execute(text(f"UPDATE {table_name} SET producto = :default WHERE producto IS NULL"), {"default": default})
        print(f"[+] Added 'producto' column to {table_name} and set default '{default}'.")
    except OperationalError as e:
        print(f"[!] Failed to alter {table_name}: {e}")


def main():
    print("--- Starting migration ---")
    add_producto_column("productores")
    add_producto_column("lotes")
    print("--- Migration completed ---")

if __name__ == "__main__":
    main()
