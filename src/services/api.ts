import axios from "axios";
import { store } from "@/store/store";
import { logout } from "@/store/authSlice";

/**
 * Central Axios instance.
 * - Base URL from VITE_API_URL env var
 * - Request interceptor: attaches JWT from Redux store
 * - Response interceptor: handles 401 (auto-logout) and network errors
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach JWT Authorization header
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — force logout
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

/** Check if mock data should be used */
export const useMockData = (): boolean => {
  return import.meta.env.VITE_USE_MOCK_DATA === "true";
};

export default api;
