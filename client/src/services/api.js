import axios from 'axios';

// API URL configuration for split deployment (Vercel frontend + Render backend)
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD
  ? 'https://task-tracker-qrv3.onrender.com/api'  // Production: Render backend
  : 'http://localhost:5000/api'); // Development: local server

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
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

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

// Tasks API
export const tasksAPI = {
  getAll: () => api.get('/tasks'),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  delete: (id) => api.delete(`/tasks/${id}`)
};

// OTP API
export const otpAPI = {
  send: (email, purpose) => api.post('/otp/send', { email, purpose }),
  verify: (email, otp, purpose) => api.post('/otp/verify', { email, otp, purpose }),
  resetPassword: (email, otp, newPassword) => api.post('/otp/reset-password', { email, otp, newPassword })
};

export default api;
