
"use client";
import { useState, useEffect, useRef } from "react";
import { api } from "./api";
import { AxiosError } from "axios";

export function useFetchData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const abortController = useRef<AbortController | null>(null);

  const fetchData = async () => {
    abortController.current = new AbortController();
    
    try {
      setLoading(true);
      const response = await api.get<T>(url, {
        signal: abortController.current.signal
      });
      setData(response.data);
      setError(null);
    } catch (err) {
      const error = err as AxiosError;
      if (error.name !== 'CanceledError') {
        setError(error.message || "Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      if (abortController.current) {
        abortController.current.abort(); // ← Cancelar petición al desmontar
      }
    };
  }, [url]);

  return { data, error, loading, refetch: fetchData };
}