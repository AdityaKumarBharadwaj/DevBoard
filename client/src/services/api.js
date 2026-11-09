/**
 * Centralized API Client (Axios Instance)
 * ============================================================================
 * Configures the base Axios client used throughout the application.
 * 
 * Features:
 * 1. Base URL configuration via Vite environment variables (VITE_API_URL).
 * 2. Request Interceptor: Injects the stored JWT Bearer token into outgoing Authorization headers.
 * 3. Response Interceptor: Extracts payload data directly from responses, and automatically
 *    handles 401 Unauthorized errors by purging credentials and redirecting to /login.
 * ============================================================================
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

/**
 * Request Interceptor
 * Injects JWT token from localStorage into the Authorization header of every outgoing request.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('devboard_token');
  config.headers = config.headers || {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response Interceptor
 * Unwraps response data and handles global authentication errors.
 */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('devboard_token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data?.message || 'Something went wrong');
  }
);

export default api;
