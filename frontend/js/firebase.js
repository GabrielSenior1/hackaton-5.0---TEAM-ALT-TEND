/**
 * 🔥 KANKU — Firebase Integration
 * Firebase Auth, Firestore, and Storage
 * Supports: Vendedores, Compradores, Productos, Pedidos
 */

const firebaseConfig = {
  apiKey: "AIzaSyACqc7-okw0dPfOU9CkTSL8ZECEZAwKazI",
  authDomain: "kanku-635ca.firebaseapp.com",
  projectId: "kanku-635ca",
  storageBucket: "kanku-635ca.firebasestorage.app",
  messagingSenderId: "538016429417",
  appId: "1:538016429417:web:8952a62a56613bf3b979f8"
};

let firebaseApp = null;
let auth = null;
let db = null;
let storage = null;
let isFirebaseReady = false;

/**
 * Initialize Firebase SDK (lazy-loaded via CDN)
 */
export async function initFirebase() {
  if (isFirebaseReady) return { auth, db, storage };

  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } = 
      await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    const { getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy, limit, serverTimestamp } = 
      await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    const { getStorage, ref, uploadBytes, getDownloadURL } = 
      await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js');

    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    storage = getStorage(firebaseApp);
    isFirebaseReady = true;

    // Store utilities for external use
    window.__firebase = {
      auth, db, storage,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      onAuthStateChanged,
      collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
      onSnapshot, query, where, orderBy, limit, serverTimestamp,
      ref, uploadBytes, getDownloadURL,
    };

    console.log('🔥 Firebase initialized successfully');
    return { auth, db, storage };
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    return { auth: null, db: null, storage: null };
  }
}

// ═══════════════════════════════════════════════════════════
// AUTH HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Sign in with email & password
 */
export async function loginUser(email, password) {
  if (!isFirebaseReady || !window.__firebase) throw new Error('Firebase not initialized');
  const { signInWithEmailAndPassword, auth } = window.__firebase;
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Register a new user with email & password
 */
export async function registerUser(email, password) {
  if (!isFirebaseReady || !window.__firebase) throw new Error('Firebase not initialized');
  const { createUserWithEmailAndPassword, auth } = window.__firebase;
  return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out current user
 */
export async function logoutUser() {
  if (!isFirebaseReady || !window.__firebase) return;
  const { signOut, auth } = window.__firebase;
  return signOut(auth);
}

/**
 * Listen to auth state changes
 */
export function onAuthChange(callback) {
  if (!isFirebaseReady || !window.__firebase) {
    callback(null);
    return () => {};
  }
  const { onAuthStateChanged, auth } = window.__firebase;
  return onAuthStateChanged(auth, callback);
}

/**
 * Get current user
 */
export function getCurrentUser() {
  if (!isFirebaseReady || !window.__firebase) return null;
  return window.__firebase.auth.currentUser;
}

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

export async function getComprador(uid) {
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

/**
 * Sync local cart to Firestore for logged-in buyer
 */
export async function syncCartToFirestore(uid) {
  if (!isFirebaseReady) return;
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const { doc, updateDoc } = window.__firebase;
  return updateDoc(doc(db, 'compradores', uid), { carrito: cart });
}

/**
 * Load cart from Firestore for logged-in buyer
 */
export async function loadCartFromFirestore(uid) {
  const comprador = await getComprador(uid);
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

export async function getProductosByVendedor(vendedorUid) {
  if (!isFirebaseReady) return [];
  const { collection, query, where, getDocs } = window.__firebase;
  const q = query(collection(db, 'productos'), where('vendedorUid', '==', vendedorUid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
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
  return addDoc(collection(db, 'pedidos'), {
    ...data,
    estado: 'pendiente',
    creadoEn: serverTimestamp(),
  });
}

export async function getPedidosByVendedor(vendedorUid) {
  if (!isFirebaseReady) return [];
  const { collection, query, where, getDocs, orderBy } = window.__firebase;
  const q = query(
    collection(db, 'pedidos'),
    where('vendedorUid', '==', vendedorUid),
    orderBy('creadoEn', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getPedidosByComprador(compradorUid) {
  if (!isFirebaseReady) return [];
  const { collection, query, where, getDocs, orderBy } = window.__firebase;
  const q = query(
    collection(db, 'pedidos'),
    where('compradorUid', '==', compradorUid),
    orderBy('creadoEn', 'desc')
  );
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
  const q = query(
    collection(db, 'reviews'),
    where('productId', '==', productId),
    orderBy('fecha', 'desc')
  );
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
  const q = query(
    collection(db, 'reviews'),
    where('compradorUid', '==', compradorUid),
    where('productId', '==', productId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

// ═══════════════════════════════════════════════════════════
// FIREBASE STORAGE — Image upload
// ═══════════════════════════════════════════════════════════

export async function uploadPhoto(file, path) {
  if (!isFirebaseReady || !window.__firebase) {
    console.warn('⚠️ Firebase storage not ready, falling back to ImgBB...');
    const { api } = await import('./api.js');
    return api.uploadImage(file);
  }
  try {
    const { ref, uploadBytes, getDownloadURL, storage } = window.__firebase;
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  } catch (error) {
    console.warn('⚠️ Firebase storage upload failed, falling back to ImgBB:', error);
    const { api } = await import('./api.js');
    return api.uploadImage(file);
  }
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
  const { onSnapshot, collection, query, orderBy, limit, db } = window.__firebase;
  const q = query(collection(db, 'sensores'), orderBy('timestamp', 'desc'), limit(10));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
}

export function isConfigured() {
  return true;
}

export default {
  initFirebase,
  loginUser,
  registerUser,
  logoutUser,
  onAuthChange,
  getCurrentUser,
  createVendedor, getVendedor, updateVendedor,
  createComprador, getComprador, updateComprador,
  syncCartToFirestore, loadCartFromFirestore,
  createProducto, getProducto, getProductosByVendedor, getAllProductos, updateProducto, deleteProducto,
  createPedido, getPedidosByVendedor, getPedidosByComprador, updatePedido,
  createReview, getReviewsByProduct, getReviewsForProducts, getReviewByUserAndProduct,
  uploadPhoto,
  subscribeSensorData,
  isConfigured,
};
