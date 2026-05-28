/**
 * 🔥 Cacao de la Sierra — Firebase Integration
 * Firebase Auth, Firestore, and Storage initialization
 * 
 * SETUP: Replace the firebaseConfig below with your project's config
 * from the Firebase Console → Project Settings → Your apps → Web app
 */

// Firebase config — Replace with your actual config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
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

  // Check if config is set
  if (firebaseConfig.apiKey === "YOUR_API_KEY") {
    console.warn('⚠️ Firebase: Config not set. Using offline mode.');
    console.warn('📝 Edit frontend/js/firebase.js and add your Firebase config.');
    return { auth: null, db: null, storage: null };
  }

  try {
    // Dynamic import Firebase modules from CDN
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } = 
      await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    const { getFirestore, collection, doc, getDoc, getDocs, onSnapshot, query, orderBy, limit } = 
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
      signOut,
      onAuthStateChanged,
      collection, doc, getDoc, getDocs, onSnapshot, query, orderBy, limit,
      ref, uploadBytes, getDownloadURL,
    };

    console.log('🔥 Firebase initialized successfully');
    return { auth, db, storage };
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    return { auth: null, db: null, storage: null };
  }
}

/**
 * Sign in admin user
 */
export async function loginAdmin(email, password) {
  if (!isFirebaseReady || !window.__firebase) {
    throw new Error('Firebase not initialized');
  }
  const { signInWithEmailAndPassword, auth } = window.__firebase;
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out current user
 */
export async function logoutAdmin() {
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
 * Get real-time sensor data from Firestore
 * Collection: "sensores" → Documents with fields: humedad, temperatura, parcela, timestamp
 */
export function subscribeSensorData(callback) {
  if (!isFirebaseReady || !window.__firebase) {
    // Return mock data for offline mode
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

/**
 * Upload a photo to Firebase Storage
 */
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

export function isConfigured() {
  return firebaseConfig.apiKey !== "YOUR_API_KEY";
}

export default {
  initFirebase,
  loginAdmin,
  logoutAdmin,
  onAuthChange,
  subscribeSensorData,
  uploadPhoto,
  isConfigured,
};
