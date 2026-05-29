/**
 * Script to create Firebase Auth users and upload logos to Storage
 * for the 3 initial company accounts.
 * 
 * Uses Firebase REST API for Auth user creation and
 * Firebase Storage REST API for logo uploads.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Firebase config
const API_KEY = 'AIzaSyACqc7-okw0dPfOU9CkTSL8ZECEZAwKazI';
const PROJECT_ID = 'kanku-635ca';
const STORAGE_BUCKET = 'kanku-635ca.firebasestorage.app';

const companies = [
  {
    name: 'Oro Verde del Caribe',
    email: 'contacto@oroverdedelcaribe.com',
    password: '12345678',
    logoFile: 'oro_verde.jpeg',
    geoLat: 10.7644,
    geoLng: -74.1594,
    ubicacion: 'Sevilla, Zona Bananera del Magdalena',
    producto: 'banano',
    descripcion: 'Asociación Bananera - Cajas de banano tipo exportación y snacks deshidratados',
    experiencia: 'Escaneo de Bienestar: el turista ve fotos reales de las zonas de lavado y comedores separados para trabajadores y trabajadoras.',
    certificaciones: [
      'Registro digital de entrega de EPP y bitácoras de capacitación en manejo de sustancias peligrosas',
      'Zonas de amortiguamiento de al menos 10 metros respecto a viviendas y fuentes hídricas',
      'Política de tolerancia cero al trabajo infantil con sistema de monitoreo'
    ]
  },
  {
    name: 'Cacao Ancestral del Tayrona',
    email: 'contacto@cacaoancestraltayrona.com',
    password: '12345678',
    logoFile: 'cacao_ancestral.jpeg',
    geoLat: 11.2417,
    geoLng: -73.7025,
    ubicacion: 'Cuenca del Río Don Diego, zona de amortiguación del Parque Tayrona',
    producto: 'cacao',
    descripcion: 'S.A.S. de Impacto - Barras de chocolate premium de origen único y nibs de cacao',
    experiencia: 'Taller de Transformación Sostenible: el turista verifica que la planta procesadora gestiona aguas residuales sin impactar la biodiversidad local.',
    certificaciones: [
      'Evaluación de Impacto Ambiental y Social (ESIA) independiente aprobada',
      'Trazabilidad de procesamiento: modelo de Balance de Masa verificado'
    ]
  },
  {
    name: 'Café Cumbre Nevada',
    email: 'contacto@cafecumbrenevada.com',
    password: '12345678',
    logoFile: 'cafe_cumbre.jpeg',
    geoLat: 11.1444,
    geoLng: -74.1186,
    ubicacion: 'Minca, estribaciones de la Sierra Nevada de Santa Marta',
    producto: 'cafe',
    descripcion: 'Cooperativa de Pequeños Productores - Café especial de altura (pergamino seco o tostado)',
    experiencia: 'Ruta de la Prima Fairtrade: un tour donde el turista visita la escuela local financiada con la Prima de Comercio Justo.',
    certificaciones: [
      'Libro de Registro de Compras que vincula cada lote con el productor, fecha y precio pagado',
      'Fichas digitales de monitoreo de plagas y enfermedades, priorizando métodos preventivos no químicos'
    ]
  },
  {
    name: 'ALBAMA: Alianza Bananera y Cacaotera del Magdalena',
    email: 'contacto@albama.com',
    password: '12345678',
    logoFile: 'albama.jpeg',
    geoLat: 10.5919,
    geoLng: -74.1919,
    ubicacion: 'Aracataca, zona baja del Magdalena',
    producto: 'banano',
    categorias: ['banano', 'cacao'],
    descripcion: 'Alianza productora de bananos tipo exportación y granos de cacao fermentados en seco',
    experiencia: '"El Legado del Río": un tour por canales de riego donde se explica la gestión de fuentes de agua y el uso de zonas de amortiguamiento para evitar que los plaguicidas contaminen los cauces.',
    certificaciones: [
      'Trazabilidad Diferenciada: separación física estricta para el banano en todas las etapas',
      'Cacao procesado bajo modelo de "Balance de Masa" verificado para producción de licor de cacao'
    ]
  },
  {
    name: 'Bosque Nublado: Coffee & Cocoa',
    email: 'contacto@bosquenublado.com',
    password: '12345678',
    logoFile: 'bosque_nublado.jpeg',
    geoLat: 10.9167,
    geoLng: -73.9833,
    ubicacion: 'San Pedro de la Sierra, Sierra Nevada de Santa Marta',
    producto: 'cafe',
    categorias: ['cafe', 'cacao'],
    descripcion: 'Café especial tostado (origen Sierra) y manteca de cacao orgánica',
    experiencia: '"Sinfonía Agroforestal": un recorrido donde el turista escanea códigos para ver cómo el cultivo de café y cacao bajo sombra contribuye al secuestro de carbono y a la protección de bosques y vegetación.',
    certificaciones: [
      'Verificación de Pequeño Productor: cada agricultor asociado no cultiva más de 30 hectáreas de café o cacao para mantener estatus de Comercio Justo',
      'Manejo de Suelos: historial de prácticas de prevención de la erosión y uso de fertilizantes orgánicos para mejorar la fertilidad del suelo'
    ]
  },
  {
    name: 'Triada Agrícola de la Sierra',
    email: 'contacto@triadaagricola.com',
    password: '12345678',
    logoFile: 'triada.jpeg',
    geoLat: 10.5189,
    geoLng: -74.1861,
    ubicacion: 'Zona rural de Fundación, transición hacia la montaña, Magdalena',
    producto: 'cacao',
    categorias: ['cafe', 'cacao', 'banano'],
    descripcion: 'Cestas de productos mixtos certificados y snacks deshidratados de café, cacao y banano',
    experiencia: '"Ruta de la Prima Fairtrade": el turista visita la cooperativa y ve el registro digital de cómo se invierte el dinero extra (Prima) en la salud y educación de la comunidad.',
    certificaciones: [
      'Protección de la Infancia: garantía de que no se emplea trabajo infantil (menores de 15 años), permitiendo solo labores ligeras fuera del horario escolar bajo supervisión directa',
      'Evaluación de Impacto (ESIA): cualquier expansión de infraestructura de procesamiento mayor a los umbrales definidos (descargas de agua >10,000 m³/año) requiere Evaluación de Impacto Ambiental y Social independiente'
    ]
  }
];

// ── Create Auth User via REST API ──
function createAuthUser(email, password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email,
      password,
      returnSecureToken: true
    });

    const options = {
      hostname: 'identitytoolkit.googleapis.com',
      path: `/v1/accounts:signUp?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          // If user already exists, try signing in instead
          if (parsed.error.message === 'EMAIL_EXISTS') {
            console.log(`  ⚠️  User ${email} already exists, signing in...`);
            signInUser(email, password).then(resolve).catch(reject);
          } else {
            reject(new Error(`Auth error: ${parsed.error.message}`));
          }
        } else {
          resolve({ uid: parsed.localId, idToken: parsed.idToken, email: parsed.email });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function signInUser(email, password) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      email,
      password,
      returnSecureToken: true
    });

    const options = {
      hostname: 'identitytoolkit.googleapis.com',
      path: `/v1/accounts:signInWithPassword?key=${API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          reject(new Error(`Sign-in error: ${parsed.error.message}`));
        } else {
          resolve({ uid: parsed.localId, idToken: parsed.idToken, email: parsed.email });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ── Upload logo to Firebase Storage via REST API ──
function uploadLogo(filePath, storagePath, idToken) {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(filePath);
    const encodedPath = encodeURIComponent(storagePath);
    
    const options = {
      hostname: 'firebasestorage.googleapis.com',
      path: `/v0/b/${STORAGE_BUCKET}/o/${encodedPath}?uploadType=media`,
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Length': fileBuffer.length,
        'Authorization': `Bearer ${idToken}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(`Storage error: ${JSON.stringify(parsed.error)}`));
          } else {
            const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${encodedPath}?alt=media&token=${parsed.downloadTokens}`;
            resolve(downloadUrl);
          }
        } catch(e) {
          reject(new Error(`Storage parse error: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(fileBuffer);
    req.end();
  });
}

// ── Create Firestore document via REST API ──
function createFirestoreDoc(collectionName, docId, fields, idToken) {
  return new Promise((resolve, reject) => {
    const firestoreFields = {};
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === 'string') {
        firestoreFields[key] = { stringValue: value };
      } else if (typeof value === 'number') {
        if (Number.isInteger(value)) {
          firestoreFields[key] = { integerValue: String(value) };
        } else {
          firestoreFields[key] = { doubleValue: value };
        }
      } else if (typeof value === 'boolean') {
        firestoreFields[key] = { booleanValue: value };
      } else if (Array.isArray(value)) {
        firestoreFields[key] = {
          arrayValue: {
            values: value.map(v => ({ stringValue: String(v) }))
          }
        };
      }
    }

    const postData = JSON.stringify({ fields: firestoreFields });

    const options = {
      hostname: 'firestore.googleapis.com',
      path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collectionName}/${docId}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${idToken}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(`Firestore error: ${JSON.stringify(parsed.error)}`));
          } else {
            resolve(parsed);
          }
        } catch(e) {
          reject(new Error(`Firestore parse error: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ── Main ──
async function main() {
  const logoDir = path.join(__dirname, 'public');
  const results = [];

  for (const company of companies) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`🏢 Processing: ${company.name}`);
    console.log(`${'═'.repeat(60)}`);

    // 1. Create Auth user
    console.log(`  📧 Creating auth user: ${company.email}`);
    let authResult;
    try {
      authResult = await createAuthUser(company.email, company.password);
      console.log(`  ✅ Auth user created — UID: ${authResult.uid}`);
    } catch (err) {
      console.error(`  ❌ Auth failed: ${err.message}`);
      continue;
    }

    // 2. Upload logo to Firebase Storage
    const logoPath = path.join(logoDir, company.logoFile);
    let logoUrl = '';
    if (fs.existsSync(logoPath)) {
      console.log(`  📸 Uploading logo: ${company.logoFile}`);
      try {
        logoUrl = await uploadLogo(logoPath, `logos/${company.logoFile}`, authResult.idToken);
        console.log(`  ✅ Logo uploaded: ${logoUrl.substring(0, 80)}...`);
      } catch (err) {
        console.error(`  ⚠️  Logo upload failed: ${err.message}`);
      }
    } else {
      console.log(`  ⚠️  Logo file not found: ${logoPath}`);
    }

    // 3. Create Firestore vendedor doc
    console.log(`  📝 Creating Firestore vendedor document...`);
    try {
      await createFirestoreDoc('vendedores', authResult.uid, {
        uid: authResult.uid,
        nombreMarca: company.name,
        nombre: company.name,
        email: company.email,
        ubicacion: company.ubicacion,
        latitud: company.geoLat,
        longitud: company.geoLng,
        producto: company.producto,
        descripcion: company.descripcion,
        experiencia: company.experiencia,
        logoUrl: logoUrl,
        categorias: company.categorias || [company.producto],
        certificaciones: company.certificaciones,
        activo: true
      }, authResult.idToken);
      console.log(`  ✅ Firestore vendedor created`);
    } catch (err) {
      console.error(`  ⚠️  Firestore error: ${err.message}`);
    }

    results.push({
      name: company.name,
      email: company.email,
      password: company.password,
      uid: authResult.uid,
      logoUrl
    });
  }

  // Summary
  console.log(`\n${'═'.repeat(60)}`);
  console.log('📋 RESUMEN DE CUENTAS CREADAS');
  console.log(`${'═'.repeat(60)}`);
  for (const r of results) {
    console.log(`\n🏢 ${r.name}`);
    console.log(`   📧 Email:    ${r.email}`);
    console.log(`   🔑 Password: ${r.password}`);
    console.log(`   🆔 UID:      ${r.uid}`);
    console.log(`   📸 Logo:     ${r.logoUrl ? 'Uploaded ✅' : 'Not uploaded ⚠️'}`);
  }
}

main().catch(console.error);
