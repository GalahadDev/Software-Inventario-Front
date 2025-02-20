import { useState } from "react";
import { api } from "./api";

export const useUpdateData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateData = async (
    endpoint: string,
    data: { 
      monto?: number | undefined;
      fletero?: string | undefined;
      estado?: string | undefined;
      atendido?: boolean ;
      pagado?: string
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      
      if (data.monto !== undefined) {
        formData.append("monto", String(data.monto));
      }
      if (data.fletero) {
        formData.append("fletero", data.fletero);
      }
      if (data.estado) {
        formData.append("estado", data.estado);
      }
      formData.append("atendido", String(data.atendido));

      formData.append("pagado", data.pagado || "No Pagado"); 

      const response = await api.put(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al actualizar los datos.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateData, loading, error };
};