import axios from 'axios';

const API_URL = import.meta.env.PROD
  ? '/api'  // Production: use relative path (Vercel rewrites handle it)
  : 'http://localhost:5000/api'; // Development: use local server

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
