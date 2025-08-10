import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  // baseURL: 'http://localhost:5000/api', // Original backend
  baseURL: 'http://localhost:5001/api', // Test server
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

export default api; 