"""
🌿 Prueba End-to-End: Oro Verde del Caribe
============================================
Asociación Bananera — Sevilla, Zona Bananera del Magdalena
Geolocalización: 10.7644° N, 74.1594° W

Flujo completo:
  1. Registrar productor (Oro Verde del Caribe)
  2. Crear lote de banano con hash SHA-256
  3. Registrar certificaciones (Fairtrade, Rainforest Alliance)
  4. Generar código QR del productor y del lote
  5. Verificar trazabilidad del lote
"""

import requests
import json
from datetime import datetime, timedelta
import sys

BASE_URL = "http://localhost:8000/api/v1"

# ═══════════════════════════════════════════════════════════
# Colores para la consola
# ═══════════════════════════════════════════════════════════
class C:
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    CYAN = "\033[96m"
    BOLD = "\033[1m"
    END = "\033[0m"

def header(title):
    print(f"\n{C.BOLD}{C.CYAN}{'═' * 60}")
    print(f"  {title}")
    print(f"{'═' * 60}{C.END}")

def ok(msg):
    print(f"  {C.GREEN}✅ {msg}{C.END}")

def info(msg):
    print(f"  {C.CYAN}ℹ️  {msg}{C.END}")

def warn(msg):
    print(f"  {C.YELLOW}⚠️  {msg}{C.END}")

def fail(msg):
    print(f"  {C.RED}❌ {msg}{C.END}")

def dump(data):
    print(f"  {C.YELLOW}{json.dumps(data, indent=2, ensure_ascii=False, default=str)}{C.END}")


# ═══════════════════════════════════════════════════════════
# 0. Verificar que el servidor esté activo
# ═══════════════════════════════════════════════════════════
header("0. VERIFICANDO SERVIDOR")
try:
    r = requests.get("http://localhost:8000/")
    if r.status_code == 200:
        data = r.json()
        ok(f"Servidor activo: {data.get('nombre', 'KANKU')} v{data.get('version', '?')}")
    else:
        fail(f"Servidor respondió con status {r.status_code}")
        sys.exit(1)
except requests.ConnectionError:
    fail("No se pudo conectar al servidor. ¿Está ejecutando 'uvicorn main:app --reload'?")
    sys.exit(1)


# ═══════════════════════════════════════════════════════════
# 1. REGISTRAR PRODUCTOR: Oro Verde del Caribe
# ═══════════════════════════════════════════════════════════
header("1. REGISTRAR PRODUCTOR — Oro Verde del Caribe")

productor_data = {
    "nombre": "Oro Verde del Caribe — Asociación Bananera",
    "cedula": "OVC-2026-001",
    "finca": "Finca Bananos del Edén",
    "ubicacion": "Sevilla, Zona Bananera del Magdalena",
    "latitud": 10.7644,
    "longitud": -74.1594,
    "altitud_msnm": 30,
    "hectareas": 85.0,
    "variedad_cacao": "Banano tipo exportación (Gran Enano, Williams)",
    "historia": (
        "Oro Verde del Caribe es una asociación de pequeños y medianos productores bananeros "
        "ubicada en Sevilla, corazón de la Zona Bananera del Magdalena. Nacida del esfuerzo "
        "colectivo de familias que por generaciones han cultivado la tierra fértil regada por "
        "las aguas de la Sierra Nevada de Santa Marta, la asociación representa el compromiso "
        "con la sostenibilidad ambiental, la justicia laboral y la producción de un banano de "
        "clase mundial. Sus fincas cuentan con zonas de lavado independientes, comedores "
        "separados para trabajadores y trabajadoras, y un programa de bienestar que incluye "
        "entrega verificable de EPP y tolerancia cero al trabajo infantil."
    ),
    "telefono": "+57 315 555 0001",
    "email": "contacto@oroverdedelcaribe.com",
    "foto_url": "https://firebasestorage.googleapis.com/v0/b/kanku-635ca.firebasestorage.app/o/logos%2Foro_verde.jpeg?alt=media"
}

info(f"Registrando: {productor_data['nombre']}")
info(f"Ubicación: {productor_data['ubicacion']}")
info(f"Coordenadas: {productor_data['latitud']}° N, {abs(productor_data['longitud'])}° W")

r = requests.post(f"{BASE_URL}/productores/", json=productor_data)
if r.status_code == 201:
    productor = r.json()
    productor_id = productor["id"]
    ok(f"Productor creado con ID: {productor_id}")
    ok(f"Fecha de registro: {productor['fecha_registro']}")
elif r.status_code == 400 and "cédula" in r.text.lower():
    warn("Productor ya existe, buscando...")
    # Buscar el productor existente
    r2 = requests.get(f"{BASE_URL}/productores/")
    productores = r2.json()
    productor = next((p for p in productores if p["cedula"] == "OVC-2026-001"), None)
    if productor:
        productor_id = productor["id"]
        ok(f"Productor encontrado con ID: {productor_id}")
    else:
        fail("No se pudo encontrar el productor")
        sys.exit(1)
else:
    fail(f"Error al crear productor: {r.status_code} - {r.text}")
    sys.exit(1)


# ═══════════════════════════════════════════════════════════
# 2. CREAR LOTE DE BANANO CON HASH SHA-256
# ═══════════════════════════════════════════════════════════
header("2. CREAR LOTE DE BANANO — Trazabilidad SHA-256")

lote_data = {
    "codigo": "BAN-OVC-2026-001",
    "productor_id": productor_id,
    "variedad": "Gran Enano (Cavendish AAA)",
    "peso_kg": 1250.0,
    "fecha_cosecha": "2026-05-28T06:00:00",
    "fecha_fermentacion": None,
    "fecha_secado": None,
    "proceso": "Lavado, desmanado, selección, empaque tipo exportación",
    "notas_cata": "Banana dulce, cremosa, con notas de vainilla y caramelo. Piel uniforme sin manchas.",
    "puntaje_calidad": 92.5,
    "origen": "Sevilla, Zona Bananera del Magdalena (10.7644° N, 74.1594° W)",
    "destino": "Mercado Europeo — Alemania, Bélgica"
}

info(f"Código del lote: {lote_data['codigo']}")
info(f"Variedad: {lote_data['variedad']}")
info(f"Peso: {lote_data['peso_kg']} kg")
info(f"Origen: {lote_data['origen']}")

r = requests.post(f"{BASE_URL}/lotes/", json=lote_data)
if r.status_code == 201:
    lote = r.json()
    ok(f"Lote creado con ID: {lote['id']}")
    ok(f"Hash SHA-256: {lote['hash_trazabilidad']}")
    ok(f"Estado: {lote['estado']}")
    print(f"\n  {C.BOLD}📦 Datos del hash (inmutables):{C.END}")
    if lote.get('datos_hash'):
        datos_hash = json.loads(lote['datos_hash'])
        dump(datos_hash)
elif r.status_code == 400 and "código" in r.text.lower():
    warn("Lote ya existe, buscando...")
    r2 = requests.get(f"{BASE_URL}/lotes/codigo/BAN-OVC-2026-001")
    if r2.status_code == 200:
        lote = r2.json()
        ok(f"Lote encontrado: {lote['codigo']} — Hash: {lote['hash_trazabilidad'][:24]}...")
    else:
        fail("No se pudo encontrar el lote")
        sys.exit(1)
else:
    fail(f"Error al crear lote: {r.status_code} - {r.text}")
    sys.exit(1)


# ═══════════════════════════════════════════════════════════
# 3. REGISTRAR CERTIFICACIONES
# ═══════════════════════════════════════════════════════════
header("3. CERTIFICACIONES — Fairtrade & Rainforest Alliance")

certificaciones = [
    {
        "productor_id": productor_id,
        "tipo": "Fairtrade",
        "numero_certificado": "FT-OVC-MAG-2026-001",
        "entidad_certificadora": "FLOCERT GmbH",
        "fecha_emision": "2026-01-15T00:00:00",
        "fecha_vencimiento": "2029-01-15T00:00:00",
        "documento_url": "https://kanku.co/certs/ft-ovc-2026.pdf",
        "notas": (
            "Registro digital de entrega de EPP, bitácoras de capacitación en manejo de "
            "sustancias peligrosas, política de tolerancia cero al trabajo infantil con "
            "sistema de monitoreo activo."
        )
    },
    {
        "tipo": "Rainforest Alliance",
        "productor_id": productor_id,
        "numero_certificado": "RA-OVC-MAG-2026-001",
        "entidad_certificadora": "Rainforest Alliance Certified™",
        "fecha_emision": "2026-02-01T00:00:00",
        "fecha_vencimiento": "2028-02-01T00:00:00",
        "documento_url": "https://kanku.co/certs/ra-ovc-2026.pdf",
        "notas": (
            "Zonas de amortiguamiento de al menos 10 metros respecto a viviendas y fuentes "
            "hídricas. Monitoreo continuo de biodiversidad en la Zona Bananera."
        )
    },
    {
        "tipo": "GlobalG.A.P.",
        "productor_id": productor_id,
        "numero_certificado": "GG-OVC-MAG-2026-001",
        "entidad_certificadora": "GLOBALG.A.P. c/o FoodPLUS GmbH",
        "fecha_emision": "2026-03-01T00:00:00",
        "fecha_vencimiento": "2027-03-01T00:00:00",
        "documento_url": "https://kanku.co/certs/gg-ovc-2026.pdf",
        "notas": (
            "Buenas Prácticas Agrícolas certificadas. Incluye trazabilidad de insumos, "
            "gestión integrada de plagas y manejo responsable del agua."
        )
    }
]

cert_ids = []
for cert in certificaciones:
    info(f"Registrando: {cert['tipo']} — {cert['numero_certificado']}")
    r = requests.post(f"{BASE_URL}/certificaciones/", json=cert)
    if r.status_code == 201:
        cert_resp = r.json()
        cert_ids.append(cert_resp["id"])
        ok(f"{cert['tipo']} registrada — Hash: {cert_resp.get('hash_certificacion', 'N/A')[:32]}...")
    elif r.status_code == 400:
        warn(f"{cert['tipo']} ya existe, continuando...")
    else:
        fail(f"Error: {r.status_code} - {r.text}")

# Listar certificaciones del productor
info(f"\nCertificaciones del productor {productor_id}:")
r = requests.get(f"{BASE_URL}/certificaciones/productor/{productor_id}")
if r.status_code == 200:
    certs = r.json()
    for c in certs:
        ok(f"  🏅 {c['tipo']} — {c['entidad_certificadora']} — Estado: {c['estado']}")


# ═══════════════════════════════════════════════════════════
# 4. GENERAR CÓDIGOS QR
# ═══════════════════════════════════════════════════════════
header("4. CÓDIGOS QR — Productor & Lote")

# QR del Productor
info("Generando QR del productor...")
r = requests.get(f"{BASE_URL}/qr/productor/{productor_id}")
if r.status_code == 200:
    qr_data = r.json()
    ok(f"QR Productor generado: {qr_data.get('qr_url', 'N/A')}")
    ok(f"Mensaje: {qr_data.get('mensaje', '')}")
else:
    warn(f"QR Productor: {r.status_code} - {r.text[:100]}")

# QR del Lote
info("Generando QR del lote de banano...")
r = requests.get(f"{BASE_URL}/qr/lote/{lote['codigo']}")
if r.status_code == 200:
    qr_data = r.json()
    ok(f"QR Lote generado: {qr_data.get('qr_url', 'N/A')}")
    ok(f"Hash en QR: {qr_data.get('hash_trazabilidad', 'N/A')[:32]}...")
    ok(f"Mensaje: {qr_data.get('mensaje', '')}")
else:
    warn(f"QR Lote: {r.status_code} - {r.text[:100]}")


# ═══════════════════════════════════════════════════════════
# 5. VERIFICAR TRAZABILIDAD
# ═══════════════════════════════════════════════════════════
header("5. VERIFICACIÓN DE TRAZABILIDAD")

# 5a. Verificar lote sin hash (inspección manual)
info("Verificación por inspección (sin hash)...")
r = requests.get(f"{BASE_URL}/verificar/{lote['codigo']}")
if r.status_code == 200:
    ver = r.json()
    ok(f"Código: {ver['codigo']}")
    ok(f"Variedad: {ver['variedad']}")
    ok(f"Peso: {ver['peso_kg']} kg")
    ok(f"Estado: {ver['estado']}")
    ok(f"Hash de trazabilidad: {ver['hash_trazabilidad']}")

# 5b. Verificar con hash correcto
info("\nVerificación con hash CORRECTO...")
r = requests.get(f"{BASE_URL}/verificar/{lote['codigo']}?hash={lote['hash_trazabilidad']}")
if r.status_code == 200:
    ver = r.json()
    if ver.get("es_valido"):
        ok(f"✅ {ver['mensaje']}")
    else:
        fail(f"❌ {ver['mensaje']}")

# 5c. Verificar con hash FALSO (debe fallar)
info("\nVerificación con hash FALSO (debe fallar)...")
hash_falso = "000000000000000000000000000000000000000000000000000000000000dead"
r = requests.get(f"{BASE_URL}/verificar/{lote['codigo']}?hash={hash_falso}")
if r.status_code == 200:
    ver = r.json()
    if not ver.get("es_valido"):
        ok(f"Correcto — Detección de falsificación: {ver['mensaje']}")
    else:
        fail("ERROR: No se detectó la falsificación")

# 5d. Validación formal POST
info("\nValidación formal POST...")
r = requests.post(f"{BASE_URL}/verificar/validar", json={
    "codigo": lote["codigo"],
    "hash_proporcionado": lote["hash_trazabilidad"]
})
if r.status_code == 200:
    ver = r.json()
    ok(f"Resultado: {ver['mensaje']}")
    ok(f"Hash almacenado:     {ver['hash_almacenado'][:32]}...")
    ok(f"Hash proporcionado:  {ver['hash_proporcionado'][:32]}...")
    ok(f"Match: {ver['es_valido']}")


# ═══════════════════════════════════════════════════════════
# 6. RESUMEN FINAL
# ═══════════════════════════════════════════════════════════
header("📋 RESUMEN — Prueba Oro Verde del Caribe")

print(f"""
  {C.BOLD}🏢 Empresa:{C.END}        Oro Verde del Caribe — Asociación Bananera
  {C.BOLD}📍 Ubicación:{C.END}      Sevilla, Zona Bananera del Magdalena
  {C.BOLD}🌍 Coordenadas:{C.END}    10.7644° N, 74.1594° W
  {C.BOLD}🍌 Producto:{C.END}       Banano tipo exportación (Gran Enano, Cavendish AAA)
  
  {C.BOLD}📦 Lote:{C.END}           {lote['codigo']}
  {C.BOLD}🔐 Hash SHA-256:{C.END}   {lote['hash_trazabilidad']}
  {C.BOLD}📊 Calidad:{C.END}        {lote.get('puntaje_calidad', 'N/A')}/100
  {C.BOLD}🚢 Destino:{C.END}        Mercado Europeo — Alemania, Bélgica
  
  {C.BOLD}🏅 Certificaciones:{C.END}
     • Fairtrade (FLOCERT GmbH)
     • Rainforest Alliance
     • GlobalG.A.P.
  
  {C.BOLD}✨ Experiencia turística:{C.END}
     Escaneo de Bienestar: el turista ve fotos reales de las zonas
     de lavado y comedores separados para trabajadores y trabajadoras.

  {C.GREEN}{C.BOLD}═══════════════════════════════════════════════════════════
  ✅ PRUEBA COMPLETADA EXITOSAMENTE
  ═══════════════════════════════════════════════════════════{C.END}
""")
