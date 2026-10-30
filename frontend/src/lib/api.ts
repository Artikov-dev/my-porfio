import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 30000, // 30s timeout to allow sleeping Render instances to cold-start
});

// Refresh tokens are single-use (rotated on every refresh), so parallel 401s must share one
// refresh call — a second call with the already-used token would log the admin out.
let refreshInFlight: Promise<unknown> | null = null;

export const refreshSession = () => {
  if (!refreshInFlight) {
    refreshInFlight = api.post('/auth/refresh').finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute = originalRequest?.url?.includes('/auth/login') ||
                        originalRequest?.url?.includes('/auth/refresh') ||
                        originalRequest?.url?.includes('/auth/logout');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        await refreshSession(); // Silent token refresh
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
