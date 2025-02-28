// api.ts

import axios from "axios";

// Instancia de Axios con configuración base
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // URL base general
});

// Interceptor de solicitudes: Agrega el token a cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas: Maneja errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);


