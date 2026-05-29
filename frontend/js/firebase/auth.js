import { isFirebaseReady } from './config.js';

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
