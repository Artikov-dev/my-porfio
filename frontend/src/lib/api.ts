import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh'); // Silent token refresh
        return api(originalRequest);
      } catch (err) {
        // Handle logout or redirect
        window.location.href = '/admin/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
