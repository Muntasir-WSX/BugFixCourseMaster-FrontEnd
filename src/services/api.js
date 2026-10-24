import axios from "axios";
import { getToken, clearToken } from "../utils/auth";

const configuredBaseURL = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");
const baseURL = configuredBaseURL
  ? configuredBaseURL.endsWith("/api")
    ? configuredBaseURL
    : `${configuredBaseURL}/api`
  : "http://localhost:5000/api";

const api = axios.create({
  baseURL,
});

// Request interceptor - automatically add Bearer token (Fixed Bug-035)
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally (Fixed Bug-036: Loop prevention)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      // Prevent infinite redirect loop if already on /login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;