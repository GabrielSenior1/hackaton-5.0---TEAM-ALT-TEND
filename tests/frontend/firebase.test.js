import { loginUser, registerUser } from '../../frontend/js/firebase/auth.js';
import { isFirebaseReady } from '../../frontend/js/firebase/config.js';

// Mock the global firebase object
window.__firebase = {
  auth: {
    currentUser: { uid: 'test-user-123', email: 'test@example.com' }
  },
  signInWithEmailAndPassword: jest.fn().mockResolvedValue({ user: { uid: 'test-user-123' } }),
  createUserWithEmailAndPassword: jest.fn().mockResolvedValue({ user: { uid: 'new-user-456' } }),
};

// We must mock the config because it controls isFirebaseReady
jest.mock('../../frontend/js/firebase/config.js', () => ({
  isFirebaseReady: true,
  db: {},
  auth: {},
  storage: {}
}));

describe('Firebase Auth Module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('loginUser should call Firebase signInWithEmailAndPassword', async () => {
    const result = await loginUser('test@example.com', 'password123');
    expect(window.__firebase.signInWithEmailAndPassword).toHaveBeenCalledWith(
      window.__firebase.auth,
      'test@example.com',
      'password123'
    );
    expect(result.user.uid).toBe('test-user-123');
  });

  test('registerUser should call Firebase createUserWithEmailAndPassword', async () => {
    const result = await registerUser('new@example.com', 'password123');
    expect(window.__firebase.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      window.__firebase.auth,
      'new@example.com',
      'password123'
    );
    expect(result.user.uid).toBe('new-user-456');
  });
});
