"""
Servicio Geográfico — Maneja datos de fincas y rutas turísticas.
Actualmente usa datos estáticos (JSON), preparado para migrar
a una API de mapas (Mapbox, Google Maps) en el futuro.
"""

import json
import os
from typing import Optional


# ── Rutas de datos estáticos ─────────────────────────────
GEO_DATA_DIR = os.path.join("static", "geo_data")
FINCAS_FILE = os.path.join(GEO_DATA_DIR, "fincas.json")
RUTAS_FILE = os.path.join(GEO_DATA_DIR, "rutas.json")


def cargar_fincas() -> list[dict]:
    """Carga los datos geográficos de las fincas desde el JSON estático."""
    try:
        with open(FINCAS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []


def cargar_rutas_geo() -> list[dict]:
    """Carga las rutas turísticas geográficas desde el JSON estático."""
    try:
        with open(RUTAS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []


def obtener_finca_por_id(finca_id: int) -> Optional[dict]:
    """Busca una finca por su ID en los datos estáticos."""
    fincas = cargar_fincas()
    for finca in fincas:
        if finca.get("id") == finca_id:
            return finca
    return None


def calcular_distancia_simple(
    lat1: float, lng1: float, lat2: float, lng2: float
) -> float:
    """
    Calcula una distancia aproximada entre dos puntos (fórmula Haversine simplificada).
    Para una implementación más precisa, se podría usar GeoPandas.

    Returns:
        Distancia aproximada en kilómetros.
    """
    from math import radians, sin, cos, sqrt, atan2

    R = 6371  # Radio de la Tierra en km

    dlat = radians(lat2 - lat1)
    dlng = radians(lng2 - lng1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return round(R * c, 2)


def obtener_fincas_cercanas(
    latitud: float, longitud: float, radio_km: float = 50
) -> list[dict]:
    """
    Retorna las fincas dentro de un radio dado desde un punto.
    Útil para mostrar fincas cercanas a un hotel en Santa Marta.
    """
    fincas = cargar_fincas()
    fincas_cercanas = []

    for finca in fincas:
        lat = finca.get("latitud")
        lng = finca.get("longitud")
        if lat and lng:
            distancia = calcular_distancia_simple(latitud, longitud, lat, lng)
            if distancia <= radio_km:
                finca["distancia_km"] = distancia
                fincas_cercanas.append(finca)

    return sorted(fincas_cercanas, key=lambda x: x.get("distancia_km", 0))


# ══════════════════════════════════════════════════════════
# PREPARADO PARA API DE MAPAS (futuro)
# ══════════════════════════════════════════════════════════
#
# Para migrar a una API de mapas, reemplazar las funciones
# de carga estática con llamadas a la API correspondiente:
#
# OPCIÓN 1: Mapbox
#   import requests
#   MAPBOX_TOKEN = settings.mapbox_token
#   def geocodificar(direccion: str):
#       url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{direccion}.json"
#       response = requests.get(url, params={"access_token": MAPBOX_TOKEN})
#       return response.json()
#
# OPCIÓN 2: Google Maps
#   from googlemaps import Client
#   gmaps = Client(key=settings.google_maps_key)
#   def geocodificar(direccion: str):
#       return gmaps.geocode(direccion)
#
# OPCIÓN 3: GeoPandas (procesamiento local)
#   import geopandas as gpd
#   gdf = gpd.read_file("static/geo_data/fincas.geojson")
# ══════════════════════════════════════════════════════════
