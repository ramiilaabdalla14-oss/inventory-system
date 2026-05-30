import axios from 'axios';

/** On Vercel, use /api proxy so browser never hits Render directly (ISP blocking). */
function resolveBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (import.meta.env.PROD && (!envUrl || envUrl.includes('onrender.com'))) {
    return '/api';
  }
  return envUrl || 'http://localhost:5026/api';
}

const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 120000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
