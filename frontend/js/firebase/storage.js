import { isFirebaseReady } from './config.js';

/**
 * Upload photo to Firebase Storage
 */
export async function uploadPhoto(file, path) {
  if (!isFirebaseReady || !window.__firebase) {
    console.warn('⚠️ Firebase storage not ready, falling back to ImgBB...');
    const { api } = await import('../api.js');
    return api.uploadImage(file);
  }
  try {
    const { ref, uploadBytes, getDownloadURL, storage } = window.__firebase;
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  } catch (error) {
    console.warn('⚠️ Firebase storage upload failed, falling back to ImgBB:', error);
    const { api } = await import('../api.js');
    return api.uploadImage(file);
  }
}
