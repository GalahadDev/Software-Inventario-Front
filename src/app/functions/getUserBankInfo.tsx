import { api } from "./api";

export const getCurrentUser = async (url:string) => {
    try {
      // Hacer la petición GET a "/users/me"
      const response = await api.get(url);
     
      return response.data;
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
      throw error; 
    }
  };