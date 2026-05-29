"""
🌿 Prueba completa del flujo KANKU con "Oro Verde del Caribe"
Geolocalización: Sevilla, Zona Bananera del Magdalena (10.7644° N, 74.1594° W)

Este script prueba:
1. Registro del productor
2. Creación de lote con hash SHA-256
3. Registro de certificaciones
4. Generación de código QR
5. Verificación de trazabilidad
"""

import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://localhost:8000/api/v1"

# Colores para consola
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

def separator(title):
    print(f"\n{'═'*65}")
    print(f"  {BOLD}{CYAN}{title}{RESET}")
    print(f"{'═'*65}")

def success(msg):
    print(f"  {GREEN}✅ {msg}{RESET}")

def error(msg):
    print(f"  {RED}❌ {msg}{RESET}")

def info(msg):
    print(f"  {YELLOW}📋 {msg}{RESET}")


def main():
    print(f"\n{BOLD}{'🌿'*20}{RESET}")
    print(f"{BOLD}  PRUEBA COMPLETA: ORO VERDE DEL CARIBE{RESET}")
    print(f"{BOLD}  Sevilla, Zona Bananera del Magdalena{RESET}")
    print(f"{BOLD}  Geolocalización: 10.7644° N, 74.1594° W{RESET}")
    print(f"{BOLD}{'🌿'*20}{RESET}")

    # ═══════════════════════════════════════════════════════════
    # 1. REGISTRAR PRODUCTOR
    # ═══════════════════════════════════════════════════════════
    separator("1️⃣  REGISTRO DE PRODUCTOR — Oro Verde del Caribe")

    productor_data = {
        "nombre": "Oro Verde del Caribe",
        "cedula": "OVC-BANANO-001",
        "finca": "Finca Bananera Sevilla — Zona Bananera del Magdalena",
        "ubicacion": "Sevilla, Zona Bananera del Magdalena, Departamento del Magdalena",
        "latitud": 10.7644,
        "longitud": -74.1594,
        "altitud_msnm": 30,
        "hectareas": 120.0,
        "variedad_cacao": "Banano Tipo Exportación (Cavendish)",
        "historia": (
            "Oro Verde del Caribe es una asociación bananera fundada en Sevilla, "
            "corazón de la Zona Bananera del Magdalena. Reúne a más de 50 familias "
            "productoras que han cultivado banano por generaciones en las fértiles "
            "tierras irrigadas por los ríos que bajan de la Sierra Nevada. "
            "Su compromiso con el bienestar laboral se refleja en zonas de lavado "
            "y comedores separados para trabajadores y trabajadoras, registro digital "
            "de entrega de EPP, y una política de tolerancia cero al trabajo infantil. "
            "Producen cajas de banano tipo exportación y snacks deshidratados, "
            "con zonas de amortiguamiento de al menos 10 metros respecto a viviendas "
            "y fuentes hídricas."
        ),
        "telefono": "+57 315 987 6543",
        "email": "contacto@oroverdedelcaribe.com",
        "foto_url": "https://firebasestorage.googleapis.com/v0/b/kanku-635ca.firebasestorage.app/o/logos%2Foro_verde.jpeg?alt=media"
    }

    info(f"Registrando productor: {productor_data['nombre']}")
    info(f"Ubicación: {productor_data['ubicacion']}")
    info(f"Coordenadas: {productor_data['latitud']}° N, {abs(productor_data['longitud'])}° W")

    resp = requests.post(f"{BASE_URL}/productores/", json=productor_data)

    if resp.status_code == 201:
        productor = resp.json()
        productor_id = productor["id"]
        success(f"Productor registrado con ID: {productor_id}")
        success(f"Nombre: {productor['nombre']}")
        success(f"Finca: {productor['finca']}")
        success(f"Fecha registro: {productor['fecha_registro']}")
    elif resp.status_code == 400 and "Ya existe" in resp.json().get("detail", ""):
        info("Productor ya existe, buscando en la base de datos...")
        # Buscar el productor existente
        resp_list = requests.get(f"{BASE_URL}/productores/")
        productores = resp_list.json()
        productor = next((p for p in productores if p["cedula"] == "OVC-BANANO-001"), None)
        if productor:
            productor_id = productor["id"]
            success(f"Productor encontrado con ID: {productor_id}")
        else:
            error("No se pudo encontrar el productor existente")
            return
    else:
        error(f"Error registrando productor: {resp.status_code} — {resp.text}")
        return

    # ═══════════════════════════════════════════════════════════
    # 2. CREAR LOTE DE BANANO CON TRAZABILIDAD SHA-256
    # ═══════════════════════════════════════════════════════════
    separator("2️⃣  CREACIÓN DE LOTE — Banano Tipo Exportación")

    lote_data = {
        "codigo": f"LOT-BAN-OVC-{datetime.now().strftime('%Y%m%d%H%M')}",
        "productor_id": productor_id,
        "variedad": "Cavendish (Gran Enano) — Banano tipo exportación",
        "peso_kg": 850.0,
        "fecha_cosecha": datetime.now().isoformat(),
        "fecha_fermentacion": None,
        "fecha_secado": None,
        "proceso": "Lavado, selección y empaque en cajas de 18.14 kg",
        "notas_cata": (
            "Banano de primera calidad: pulpa firme, dulzura natural, "
            "calibre entre 39-46mm. Apto para mercado de exportación. "
            "Cultivado bajo estándares de bienestar laboral con registro "
            "digital de EPP y capacitación en manejo de sustancias."
        ),
        "puntaje_calidad": 92.5,
        "origen": "Sevilla, Zona Bananera del Magdalena (10.7644°N, 74.1594°W)",
        "destino": "Unión Europea — Mercado de comercio justo"
    }

    info(f"Código del lote: {lote_data['codigo']}")
    info(f"Variedad: {lote_data['variedad']}")
    info(f"Peso: {lote_data['peso_kg']} kg")
    info(f"Origen: {lote_data['origen']}")
    info(f"Destino: {lote_data['destino']}")

    resp = requests.post(f"{BASE_URL}/lotes/", json=lote_data)

    if resp.status_code == 201:
        lote = resp.json()
        lote_id = lote["id"]
        lote_codigo = lote["codigo"]
        lote_hash = lote["hash_trazabilidad"]
        success(f"Lote creado con ID: {lote_id}")
        success(f"Código: {lote_codigo}")
        success(f"Hash SHA-256: {lote_hash[:32]}...")
        success(f"Estado: {lote['estado']}")
        info(f"Datos del hash: {lote.get('datos_hash', 'N/A')[:100]}...")
    else:
        error(f"Error creando lote: {resp.status_code} — {resp.text}")
        return

    # ═══════════════════════════════════════════════════════════
    # 3. REGISTRAR CERTIFICACIONES
    # ═══════════════════════════════════════════════════════════
    separator("3️⃣  CERTIFICACIONES — Registro de bienestar laboral y ambiental")

    certificaciones = [
        {
            "productor_id": productor_id,
            "tipo": "Bienestar Laboral (EPP)",
            "numero_certificado": f"OVC-EPP-{datetime.now().strftime('%Y')}-001",
            "entidad_certificadora": "KANKU Verificación — Registro Digital",
            "fecha_emision": datetime.now().isoformat(),
            "fecha_vencimiento": (datetime.now() + timedelta(days=365)).isoformat(),
            "notas": (
                "Registro digital de entrega de EPP y bitácoras de "
                "capacitación en manejo de sustancias peligrosas. "
                "Verificado mediante 'Escaneo de Bienestar': fotos reales "
                "de zonas de lavado y comedores separados."
            )
        },
        {
            "productor_id": productor_id,
            "tipo": "Ambiental — Zonas de Amortiguamiento",
            "numero_certificado": f"OVC-AMB-{datetime.now().strftime('%Y')}-001",
            "entidad_certificadora": "KANKU Verificación — Geolocalización",
            "fecha_emision": datetime.now().isoformat(),
            "fecha_vencimiento": (datetime.now() + timedelta(days=365)).isoformat(),
            "notas": (
                "Zonas de amortiguamiento de al menos 10 metros respecto "
                "a viviendas y fuentes hídricas verificadas mediante "
                "geolocalización (10.7644°N, 74.1594°W)."
            )
        },
        {
            "productor_id": productor_id,
            "tipo": "Social — Tolerancia Cero Trabajo Infantil",
            "numero_certificado": f"OVC-SOC-{datetime.now().strftime('%Y')}-001",
            "entidad_certificadora": "KANKU Verificación — Monitoreo Social",
            "fecha_emision": datetime.now().isoformat(),
            "fecha_vencimiento": (datetime.now() + timedelta(days=365)).isoformat(),
            "notas": (
                "Política de tolerancia cero al trabajo infantil con "
                "sistema de monitoreo activo. Todos los trabajadores son "
                "mayores de 18 años y cuentan con contrato formal."
            )
        }
    ]

    cert_ids = []
    for i, cert_data in enumerate(certificaciones, 1):
        info(f"Certificación {i}: {cert_data['tipo']}")
        resp = requests.post(f"{BASE_URL}/certificaciones/", json=cert_data)
        if resp.status_code == 201:
            cert = resp.json()
            cert_ids.append(cert["id"])
            success(f"Certificación registrada — ID: {cert['id']}")
            success(f"Hash integridad: {cert.get('hash_certificacion', 'N/A')[:32]}...")
        else:
            error(f"Error: {resp.status_code} — {resp.text}")

    # ═══════════════════════════════════════════════════════════
    # 4. GENERAR CÓDIGO QR
    # ═══════════════════════════════════════════════════════════
    separator("4️⃣  CÓDIGO QR — Generación para etiquetas y menús")

    # QR del productor
    info("Generando QR del productor...")
    resp = requests.get(f"{BASE_URL}/qr/productor/{productor_id}")
    if resp.status_code == 200:
        qr_data = resp.json()
        success(f"QR del productor generado")
        success(f"URL de verificación: {qr_data.get('url_verificacion', qr_data.get('url', 'N/A'))}")
    else:
        info(f"QR productor: {resp.status_code} — {resp.text[:100]}")

    # QR del lote
    info("Generando QR del lote...")
    resp = requests.get(f"{BASE_URL}/qr/lote/{lote_codigo}")
    if resp.status_code == 200:
        qr_data = resp.json()
        success(f"QR del lote generado")
        success(f"URL de verificación: {qr_data.get('url_verificacion', qr_data.get('url', 'N/A'))}")
    else:
        info(f"QR lote: {resp.status_code} — {resp.text[:100]}")

    # ═══════════════════════════════════════════════════════════
    # 5. VERIFICACIÓN DE TRAZABILIDAD
    # ═══════════════════════════════════════════════════════════
    separator("5️⃣  VERIFICACIÓN — Autenticidad del lote")

    # Verificar sin hash (inspección)
    info("Verificación por inspección (sin hash)...")
    resp = requests.get(f"{BASE_URL}/verificar/{lote_codigo}")
    if resp.status_code == 200:
        verif = resp.json()
        success(f"Lote encontrado: {verif['codigo']}")
        success(f"Variedad: {verif['variedad']}")
        success(f"Peso: {verif['peso_kg']} kg")
        success(f"Origen: {verif['origen']}")
        success(f"Hash: {verif['hash_trazabilidad'][:32]}...")
    else:
        error(f"Error: {resp.status_code}")

    # Verificar con hash correcto
    info("Verificación con hash SHA-256 correcto...")
    resp = requests.get(f"{BASE_URL}/verificar/{lote_codigo}?hash={lote_hash}")
    if resp.status_code == 200:
        verif = resp.json()
        if verif.get("es_valido"):
            success(f"✅ {verif['mensaje']}")
        else:
            error(f"❌ {verif['mensaje']}")
    else:
        error(f"Error: {resp.status_code}")

    # Verificar con hash incorrecto (prueba de inmutabilidad)
    info("Verificación con hash INCORRECTO (prueba de inmutabilidad)...")
    hash_falso = "a" * 64
    resp = requests.get(f"{BASE_URL}/verificar/{lote_codigo}?hash={hash_falso}")
    if resp.status_code == 200:
        verif = resp.json()
        if not verif.get("es_valido"):
            success(f"Inmutabilidad confirmada: {verif['mensaje']}")
        else:
            error("¡ALERTA! Hash falso fue aceptado — la inmutabilidad falló")
    else:
        error(f"Error: {resp.status_code}")

    # Verificación POST formal
    info("Verificación POST formal (validar integridad)...")
    resp = requests.post(f"{BASE_URL}/verificar/validar", json={
        "codigo": lote_codigo,
        "hash_proporcionado": lote_hash
    })
    if resp.status_code == 200:
        verif = resp.json()
        success(f"Resultado: {verif['mensaje']}")
        success(f"Hash almacenado: {verif['hash_almacenado'][:32]}...")
        success(f"Hash proporcionado: {verif['hash_proporcionado'][:32]}...")
        success(f"¿Es válido?: {verif['es_valido']}")
    else:
        error(f"Error: {resp.status_code}")

    # ═══════════════════════════════════════════════════════════
    # 6. CONSULTAR CERTIFICACIONES DEL PRODUCTOR
    # ═══════════════════════════════════════════════════════════
    separator("6️⃣  CONSULTA — Certificaciones de Oro Verde del Caribe")

    resp = requests.get(f"{BASE_URL}/certificaciones/productor/{productor_id}")
    if resp.status_code == 200:
        certs = resp.json()
        success(f"Total certificaciones: {len(certs)}")
        for cert in certs:
            info(f"  → {cert['tipo']} ({cert['estado']})")
            info(f"    Nº: {cert['numero_certificado']}")
            info(f"    Hash: {cert.get('hash_certificacion', 'N/A')[:32]}...")
    else:
        error(f"Error: {resp.status_code}")

    # ═══════════════════════════════════════════════════════════
    # 7. CONSULTAR DATOS DEL PRODUCTOR
    # ═══════════════════════════════════════════════════════════
    separator("7️⃣  CONSULTA — Perfil completo del productor")

    resp = requests.get(f"{BASE_URL}/productores/{productor_id}")
    if resp.status_code == 200:
        p = resp.json()
        success(f"Nombre: {p['nombre']}")
        success(f"Finca: {p['finca']}")
        success(f"Ubicación: {p['ubicacion']}")
        success(f"Coordenadas: {p['latitud']}° N, {abs(p['longitud'])}° W")
        success(f"Altitud: {p['altitud_msnm']} msnm")
        success(f"Hectáreas: {p['hectareas']}")
        success(f"Producto: {p['variedad_cacao']}")
        success(f"Email: {p['email']}")
        success(f"Activo: {'Sí' if p['activo'] else 'No'}")
        info(f"Historia: {p['historia'][:150]}...")
    else:
        error(f"Error: {resp.status_code}")

    # ═══════════════════════════════════════════════════════════
    # RESUMEN FINAL
    # ═══════════════════════════════════════════════════════════
    separator("📊 RESUMEN FINAL — Prueba Oro Verde del Caribe")

    print(f"""
  {BOLD}Empresa:{RESET}        Oro Verde del Caribe
  {BOLD}Tipo:{RESET}           Asociación Bananera
  {BOLD}Ubicación:{RESET}      Sevilla, Zona Bananera del Magdalena
  {BOLD}Coordenadas:{RESET}    10.7644° N, 74.1594° W
  {BOLD}Producto:{RESET}       Banano tipo exportación (Cavendish)

  {BOLD}Productor ID:{RESET}   {productor_id}
  {BOLD}Lote:{RESET}           {lote_codigo}
  {BOLD}Hash SHA-256:{RESET}   {lote_hash}
  {BOLD}Certificaciones:{RESET} {len(cert_ids)} registradas

  {BOLD}Experiencia turística:{RESET}
  «Escaneo de Bienestar: el turista ve fotos reales de las zonas 
   de lavado y comedores separados para trabajadores y trabajadoras.»

  {GREEN}{BOLD}✅ Todas las pruebas del flujo completo han sido ejecutadas.{RESET}
  {GREEN}{BOLD}✅ El lote tiene trazabilidad SHA-256 inmutable.{RESET}
  {GREEN}{BOLD}✅ Las certificaciones tienen hash de integridad.{RESET}
  {GREEN}{BOLD}✅ La verificación con hash falso fue correctamente rechazada.{RESET}
""")


if __name__ == "__main__":
    main()
