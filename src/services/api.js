import axios from 'axios';

// Get API base URL from environment variables
const getApiBaseUrl = () => {
  console.log('Environment check:', {
    PROD: import.meta.env.PROD,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    NODE_ENV: import.meta.env.NODE_ENV
  });
  
  // In production (Vercel), use the Railway backend URL
  if (import.meta.env.PROD) {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      console.error('VITE_API_URL environment variable is not set for production!');
      throw new Error('API URL not configured for production');
    }
    console.log('Production API URL:', apiUrl);
    return apiUrl;
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
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  createAdmin: (adminData) => api.post('/api/auth/create-admin', adminData),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/me/update', data),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  create: (productData) => api.post('/api/products/new', productData),
  update: (id, productData) => api.put(`/api/products/${id}`, productData),
  delete: (id) => api.delete(`/api/products/${id}`),
  placeBid: (id, amount) => api.post(`/api/products/${id}/bid`, { amount }),
  getSellerProducts: () => api.get('/api/products/seller/me'),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/api/orders/new', orderData),
  getMyOrders: () => api.get('/api/orders/me'),
  getById: (id) => api.get(`/api/orders/${id}`),
  updateStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status }),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/api/users'),
  getById: (id) => api.get(`/api/users/${id}`),
  update: (id, userData) => api.put(`/api/users/${id}`, userData),
  delete: (id) => api.delete(`/api/users/${id}`),
};

// Chat API
export const chatAPI = {
  getMyChats: () => api.get('/api/chat/my-chats'),
  getChat: (chatId) => api.get(`/api/chat/${chatId}`),
  startChat: (data) => api.post('/api/chat/start-chat', data),
  sendMessage: (chatId, message) => api.post(`/api/chat/${chatId}/send-message`, { message }),
  markAsRead: (chatId) => api.put(`/api/chat/${chatId}/mark-read`),
  closeChat: (chatId) => api.put(`/api/chat/${chatId}/close`),
};

// Individual chat functions for easier use
export const startChat = (data) => api.post('/api/chat/start-chat', data);
export const sendMessage = (chatId, message) => api.post(`/api/chat/${chatId}/send-message`, { message });
export const getChat = (chatId) => api.get(`/api/chat/${chatId}`);

export default api; 