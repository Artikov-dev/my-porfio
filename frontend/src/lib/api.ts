import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 10000, // 10s timeout for fast responsiveness
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
        // If token refresh fails on an active admin page, check if offline
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

