"use client";
import { useState, useEffect, useRef } from "react";
import { api } from "./api";
import { AxiosError } from "axios";

export function useFetchData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const abortController = useRef<AbortController | null>(null);

  // Obtener el token de localStorage y dejar de buscarlo si no existe
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkToken = setInterval(() => {
      const storedToken = localStorage.getItem("authToken");
     

      if (storedToken) {
        clearInterval(checkToken); // Detener la verificación cuando obtiene el token
        setToken(storedToken);
      } else if (token !== undefined) {
        clearInterval(checkToken); // Detener si el usuario se deslogueó
      }
    }, 1000); // Revisa cada segundo

    return () => clearInterval(checkToken);
  }, [token]); // Se ejecuta cuando `token` cambia

  useEffect(() => {
    if (token === undefined) return; // Espera hasta que el token esté definido

    abortController.current = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        

        const response = await api.get<T>(url, {
          signal: abortController.current!.signal,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

      
        setData(response.data);
        setError(null);
      } catch (err) {
        const error = err as AxiosError;

        if (error.response) {
          console.error("Error en la respuesta:", error.response.status, error.response.data);
          if (error.response.status === 401) {
            console.warn("Token inválido o expirado. Considera hacer logout.");
          }
        }

        if (error.name !== "CanceledError") {
          setError(error.message || "Error desconocido");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [url, token]); // Ejecutar cuando `token` cambie

  // Función para volver a hacer la petición
  const refetch = () => {
    setToken(localStorage.getItem("authToken") || null);
  };

  return { data, error, loading, refetch };
}
