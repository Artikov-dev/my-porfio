import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 60000, // 60s to allow Render free tier cold starts
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute = originalRequest?.url?.includes('/auth/login') ||
                        originalRequest?.url?.includes('/auth/refresh') ||
                        originalRequest?.url?.includes('/auth/logout');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        await api.post('/auth/refresh'); // Silent token refresh
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('isAdmin');
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/aadminsecret';
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
