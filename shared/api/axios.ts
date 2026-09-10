import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

/**
 * Standard CoreGuard API Axios Client
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach bearer tokens if available in browser
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("coreguard_jwt_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardized error logging and format
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized: optional redirect or trigger refresh token
      console.warn("[API] 401 Unauthorized encountered:", error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
