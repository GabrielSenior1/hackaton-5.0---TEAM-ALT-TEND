// Re-export todo desde los nuevos submódulos
export * from './firebase/config.js';
export * from './firebase/auth.js';
export * from './firebase/db.js';
export * from './firebase/storage.js';

import firebaseDefault from './firebase/index.js';
export default firebaseDefault;
