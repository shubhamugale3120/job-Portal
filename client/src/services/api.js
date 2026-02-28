import axios from 'axios';

const TOKEN_KEY = 'token';
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const normalizedBaseUrl = rawBaseUrl.replace(/\/api\/?$/i, '');

const api = axios.create({
  baseURL: normalizedBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error?.config?.url || '';
    const isAuthBootstrapCall = requestUrl.includes('/auth/me');

    if (error.response?.status === 401 && !isAuthBootstrapCall) {
      localStorage.removeItem(TOKEN_KEY);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default api;