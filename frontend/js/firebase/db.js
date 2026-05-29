import { isFirebaseReady, db } from './config.js';

// ═══════════════════════════════════════════════════════════
// VENDEDORES CRUD (Firestore: "vendedores")
// ═══════════════════════════════════════════════════════════

export async function createVendedor(uid, data) {
  if (!isFirebaseReady) throw new Error('Firebase not ready');
  const { doc, setDoc, serverTimestamp } = window.__firebase;
  const vendedorRef = doc(db, 'vendedores', uid);
  return setDoc(vendedorRef, {
    ...data,
    uid,
    categorias: data.categorias || [],
    creadoEn: serverTimestamp(),
  });
}

export async function getVendedor(uid) {
  if (!isFirebaseReady) return null;
  const { doc, getDoc } = window.__firebase;
  const snap = await getDoc(doc(db, 'vendedores', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateVendedor(uid, data) {
  if (!isFirebaseReady) throw new Error('Firebase not ready');
  const { doc, updateDoc } = window.__firebase;
  return updateDoc(doc(db, 'vendedores', uid), data);
}

// ═══════════════════════════════════════════════════════════
// COMPRADORES (Firestore: "compradores")
// ═══════════════════════════════════════════════════════════

export async function createComprador(uid, data) {
  if (!isFirebaseReady) throw new Error('Firebase not ready');
  const { doc, setDoc, serverTimestamp } = window.__firebase;
  return setDoc(doc(db, 'compradores', uid), {
    ...data,
    uid,
    carrito: [],
    creadoEn: serverTimestamp(),
  });
}

export async function getCompradorLocal(uid) {
  if (!isFirebaseReady) return null;
  const { doc, getDoc } = window.__firebase;
  const snap = await getDoc(doc(db, 'compradores', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateComprador(uid, data) {
  if (!isFirebaseReady) throw new Error('Firebase not ready');
  const { doc, updateDoc } = window.__firebase;
  return updateDoc(doc(db, 'compradores', uid), data);
}

export async function syncCartToFirestore(uid) {
  if (!isFirebaseReady) return;
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const { doc, updateDoc } = window.__firebase;
  return updateDoc(doc(db, 'compradores', uid), { carrito: cart });
}

export async function loadCartFromFirestore(uid) {
  const comprador = await getCompradorLocal(uid);
  if (comprador && comprador.carrito && comprador.carrito.length > 0) {
    localStorage.setItem('cart', JSON.stringify(comprador.carrito));
    return comprador.carrito;
  }
  return [];
}

// ═══════════════════════════════════════════════════════════
// PRODUCTOS CRUD (Firestore: "productos")
// ═══════════════════════════════════════════════════════════

export async function createProducto(data) {
  if (!isFirebaseReady) throw new Error('Firebase not ready');
  const { collection, addDoc, serverTimestamp } = window.__firebase;
  return addDoc(collection(db, 'productos'), {
    ...data,
    activo: true,
    creadoEn: serverTimestamp(),
  });
}

export async function getProducto(id) {
  if (!isFirebaseReady) return null;
  const { doc, getDoc } = window.__firebase;
  const snap = await getDoc(doc(db, 'productos', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getProductosByVendedor(vendedorUid, limitCount = null, lastVisibleDoc = null) {
  if (!isFirebaseReady) return { data: [], lastVisible: null };
  const { collection, query, where, getDocs, limit, startAfter, orderBy } = window.__firebase;
  
  let qArgs = [collection(db, 'productos'), where('vendedorUid', '==', vendedorUid), orderBy('creadoEn', 'desc')];
  if (startAfter && lastVisibleDoc) qArgs.push(startAfter(lastVisibleDoc));
  if (limitCount) qArgs.push(limit(limitCount));
  
  const q = query(...qArgs);
  const snap = await getDocs(q);
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return {
    data,
    lastVisible: snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null
  };
}

export async function getAllProductos() {
  if (!isFirebaseReady) return [];
  const { collection, query, where, getDocs } = window.__firebase;
  const q = query(collection(db, 'productos'), where('activo', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateProducto(id, data) {
  if (!isFirebaseReady) throw new Error('Firebase not ready');
  const { doc, updateDoc } = window.__firebase;
  return updateDoc(doc(db, 'productos', id), data);
}

export async function deleteProducto(id) {
  if (!isFirebaseReady) throw new Error('Firebase not ready');
  const { doc, deleteDoc } = window.__firebase;
  return deleteDoc(doc(db, 'productos', id));
}

// ═══════════════════════════════════════════════════════════
// PEDIDOS CRUD (Firestore: "pedidos")
// ═══════════════════════════════════════════════════════════

export async function createPedido(data) {
  if (!isFirebaseReady) throw new Error('Firebase not ready');
  const { collection, addDoc, serverTimestamp } = window.__firebase;

  const pedidoDoc = {
    vendedorUid: data.vendedorUid || 'unknown',
    vendedorNombre: data.vendedorNombre || '',
    compradorUid: data.compradorUid || null,
    compradorEmail: data.compradorEmail || '',
    compradorNombre: data.compradorNombre || 'Invitado',
    esInvitado: data.esInvitado !== undefined ? data.esInvitado : true,
    tipoPerfil: data.tipoPerfil || 'individual',
    datosInstitucionales: data.datosInstitucionales || null,
    tipoEntrega: data.tipoEntrega || 'recogida',
    direccionEntrega: data.direccionEntrega || null,
    items: data.items || [],
    total: data.total || 0,
    estado: 'pendiente',
    creadoEn: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'pedidos'), pedidoDoc);
  return docRef;
}

export async function createEmailNotification({ to, message, pedidoId }) {
  if (!isFirebaseReady) return null;
  const { collection, addDoc } = window.__firebase;
  try {
    const docRef = await addDoc(collection(db, 'mail'), {
      to,
      message,
      pedidoId: pedidoId || null,
    });
    console.log('Queued email for delivery to "mail" collection!');
    return docRef;
  } catch (err) {
    console.error('Error sending to mail collection:', err);
    throw err;
  }
}

export async function getPedidosByVendedor(vendedorUid, limitCount = null, lastVisibleDoc = null) {
  if (!isFirebaseReady) return { data: [], lastVisible: null };
  const { collection, query, where, getDocs, orderBy, limit, startAfter } = window.__firebase;
  
  let qArgs = [collection(db, 'pedidos'), where('vendedorUid', '==', vendedorUid), orderBy('creadoEn', 'desc')];
  if (startAfter && lastVisibleDoc) qArgs.push(startAfter(lastVisibleDoc));
  if (limitCount) qArgs.push(limit(limitCount));
  
  const q = query(...qArgs);
  const snap = await getDocs(q);
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return {
    data,
    lastVisible: snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null
  };
}

export async function getPedidosByComprador(compradorUid) {
  if (!isFirebaseReady) return [];
  const { collection, query, where, getDocs, orderBy } = window.__firebase;
  const q = query(collection(db, 'pedidos'), where('compradorUid', '==', compradorUid), orderBy('creadoEn', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getPedidosByEmail(email) {
  if (!isFirebaseReady) return [];
  const { collection, query, where, getDocs, orderBy } = window.__firebase;
  const q = query(collection(db, 'pedidos'), where('compradorEmail', '==', email), orderBy('creadoEn', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getPedidosInstitucionales(vendedorUid) {
  if (!isFirebaseReady) return [];
  const { collection, query, where, getDocs, orderBy } = window.__firebase;
  const q = query(collection(db, 'pedidos'), where('vendedorUid', '==', vendedorUid), where('tipoPerfil', '==', 'institucional'), orderBy('creadoEn', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updatePedido(id, data) {
  if (!isFirebaseReady) throw new Error('Firebase not ready');
  const { doc, updateDoc } = window.__firebase;
  return updateDoc(doc(db, 'pedidos', id), data);
}

// ═══════════════════════════════════════════════════════════
// REVIEWS CRUD (Firestore: "reviews")
// ═══════════════════════════════════════════════════════════

export async function createReview(data) {
  if (!isFirebaseReady) throw new Error('Firebase not ready');
  const { collection, addDoc, serverTimestamp } = window.__firebase;
  return addDoc(collection(db, 'reviews'), {
    ...data,
    fecha: serverTimestamp(),
  });
}

export async function getReviewsByProduct(productId) {
  if (!isFirebaseReady) return [];
  const { collection, query, where, getDocs, orderBy } = window.__firebase;
  const q = query(collection(db, 'reviews'), where('productId', '==', productId), orderBy('fecha', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getReviewsForProducts(productIds) {
  if (!isFirebaseReady || productIds.length === 0) return {};
  const { collection, getDocs } = window.__firebase;
  const snap = await getDocs(collection(db, 'reviews'));
  const result = {};
  snap.docs.forEach(d => {
    const data = d.data();
    if (productIds.includes(data.productId)) {
      if (!result[data.productId]) result[data.productId] = [];
      result[data.productId].push(data.rating || 0);
    }
  });
  return result;
}

export async function getReviewByUserAndProduct(compradorUid, productId) {
  if (!isFirebaseReady) return null;
  const { collection, query, where, getDocs } = window.__firebase;
  const q = query(collection(db, 'reviews'), where('compradorUid', '==', compradorUid), where('productId', '==', productId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

// ═══════════════════════════════════════════════════════════
// SENSOR DATA (Firestore: "sensores") — Real-time
// ═══════════════════════════════════════════════════════════

export function subscribeSensorData(callback) {
  if (!isFirebaseReady || !window.__firebase) {
    callback([
      { parcela: 'El Mirador', humedad: 72, temperatura: 24, timestamp: new Date() },
      { parcela: 'La Esperanza', humedad: 68, temperatura: 26, timestamp: new Date() },
    ]);
    return () => {};
  }
  const { onSnapshot, collection, query, orderBy, limit, db: localDb } = window.__firebase;
  const q = query(collection(localDb, 'sensores'), orderBy('timestamp', 'desc'), limit(10));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
}
