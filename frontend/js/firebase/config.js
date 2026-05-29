/**
 * Configuración de Firebase y carga diferida (lazy load) de SDKs.
 */

export const firebaseConfig = {
  apiKey: "AIzaSyACqc7-okw0dPfOU9CkTSL8ZECEZAwKazI",
  authDomain: "kanku-635ca.firebaseapp.com",
  projectId: "kanku-635ca",
  storageBucket: "kanku-635ca.firebasestorage.app",
  messagingSenderId: "538016429417",
  appId: "1:538016429417:web:8952a62a56613bf3b979f8"
};

export let firebaseApp = null;
export let auth = null;
export let db = null;
export let storage = null;
export let isFirebaseReady = false;

export async function initFirebase() {
  if (isFirebaseReady) return { auth, db, storage };

  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } = 
      await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    const { getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, orderBy, limit, startAfter, serverTimestamp } = 
      await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    const { getStorage, ref, uploadBytes, getDownloadURL } = 
      await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js');

    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
    storage = getStorage(firebaseApp);
    isFirebaseReady = true;

    // Store utilities for external use (keeping compatibility)
    window.__firebase = {
      auth, db, storage,
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      onAuthStateChanged,
      collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
      onSnapshot, query, where, orderBy, limit, startAfter, serverTimestamp,
      ref, uploadBytes, getDownloadURL,
    };

    console.log('🔥 Firebase initialized successfully (Modular)');
    return { auth, db, storage };
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    return { auth: null, db: null, storage: null };
  }
}

export function isConfigured() {
  return true;
}
