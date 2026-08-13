import axios from 'axios';

/**
 * Axios instance pre-configured with the backend base URL.
 * Interceptors automatically attach JWT and handle 401 errors.
 */
// Build base URL:
// - In production: VITE_API_URL = https://your-backend.onrender.com  (no /api)
// - In dev: falls back to localhost:5000/api via proxy
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hcp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle global 401 — clear storage and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hcp_token');
      localStorage.removeItem('hcp_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
