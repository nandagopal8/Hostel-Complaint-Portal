import axios from 'axios';

/**
 * Axios instance pre-configured with the backend base URL.
 * Interceptors automatically attach JWT and handle 401 errors.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
