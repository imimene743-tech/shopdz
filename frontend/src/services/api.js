import axios from 'axios';
import toast from 'react-hot-toast';
import { API_URL } from '../utils/config';












const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopdzToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Une erreur est survenue';
    toast.error(message);

    if (error.response?.status === 401) {
      localStorage.removeItem('shopdzToken');
      localStorage.removeItem('shopdzUser');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ===== PRODUITS =====
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products/add', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ===== CATÉGORIES =====
export const getCategories = () => api.get('/categories');

// ===== PANIER =====
export const getCart = (userId) => api.get(`/cart/${userId}`);
export const addToCart = (data) => api.post('/cart', data);
export const updateCartItem = (id, data) => api.put(`/cart/${id}`, data);
export const removeFromCart = (id) => api.delete(`/cart/${id}`);

// ===== COMMANDES =====
export const createOrder = (data) => api.post('/orders', data);
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/details/${id}`);

// ===== WILAYAS =====
export const getWilayas = () => api.get('/wilayas');

// ===== AUTH =====
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getProfile = () => api.get('/auth/profile');

export default api;