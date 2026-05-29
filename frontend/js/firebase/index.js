export * from './config.js';
export * from './auth.js';
export * from './db.js';
export * from './storage.js';

import { initFirebase, isConfigured } from './config.js';
import { loginUser, registerUser, logoutUser, onAuthChange, getCurrentUser } from './auth.js';
import { 
  createVendedor, getVendedor, updateVendedor,
  createComprador, getCompradorLocal as getComprador, updateComprador,
  syncCartToFirestore, loadCartFromFirestore,
  createProducto, getProducto, getProductosByVendedor, getAllProductos, updateProducto, deleteProducto,
  createPedido, getPedidosByVendedor, getPedidosByComprador, getPedidosByEmail, getPedidosInstitucionales, updatePedido,
  createEmailNotification,
  createReview, getReviewsByProduct, getReviewsForProducts, getReviewByUserAndProduct,
  subscribeSensorData
} from './db.js';
import { uploadPhoto } from './storage.js';

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
  createPedido, getPedidosByVendedor, getPedidosByComprador, getPedidosByEmail, getPedidosInstitucionales, updatePedido,
  createEmailNotification,
  createReview, getReviewsByProduct, getReviewsForProducts, getReviewByUserAndProduct,
  uploadPhoto,
  subscribeSensorData,
  isConfigured,
};
