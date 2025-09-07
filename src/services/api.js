import axios from 'axios';

// Get API base URL from environment variables
const getApiBaseUrl = () => {
  console.log('Environment check:', {
    PROD: import.meta.env.PROD,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    NODE_ENV: import.meta.env.NODE_ENV
  });
  
  // In production (Vercel), always use relative API URL since both frontend and backend are on same domain
  if (import.meta.env.PROD) {
    console.log('Production API URL: /api');
    return '/api';
  }
  // In development, use local backend
  const devUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  console.log('Development API URL:', devUrl);
  return devUrl;
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  createAdmin: (adminData) => api.post('/auth/create-admin', adminData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me/update', data),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products/new', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  placeBid: (id, amount) => api.post(`/products/${id}/bid`, { amount }),
  getSellerProducts: () => api.get('/products/seller/me'),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders/new', orderData),
  getMyOrders: () => api.get('/orders/me'),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

// Chat API
export const chatAPI = {
  getMyChats: () => api.get('/chat/my-chats'),
  getChat: (chatId) => api.get(`/chat/${chatId}`),
  startChat: (data) => api.post('/chat/start-chat', data),
  sendMessage: (chatId, message) => api.post(`/chat/${chatId}/send-message`, { message }),
  markAsRead: (chatId) => api.put(`/chat/${chatId}/mark-read`),
  closeChat: (chatId) => api.put(`/chat/${chatId}/close`),
};

// Individual chat functions for easier use
export const startChat = (data) => api.post('/chat/start-chat', data);
export const sendMessage = (chatId, message) => api.post(`/chat/${chatId}/send-message`, { message });
export const getChat = (chatId) => api.get(`/chat/${chatId}`);

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getProducts: (params) => api.get('/admin/products', { params }),
  createProduct: (formData) => api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProduct: (id, formData) => api.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  seedProducts: () => api.post('/admin/seed-products'),
  
  // Orders management
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  getOrderById: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  
  // Users management
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  suspendUser: (id) => api.put(`/admin/users/${id}/suspend`),
  activateUser: (id) => api.put(`/admin/users/${id}/activate`)
};

export default api;