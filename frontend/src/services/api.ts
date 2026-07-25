import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081",
  headers: { "Content-Type": "application/json" },
});

// Token gardé en mémoire (pas de localStorage pour l'instant, cf discussion précédente)
let currentToken: string | null = null;

export function setAuthToken(token: string | null): void {
  currentToken = token;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null);
    }
    return Promise.reject(error);
  },
);

export default api;
