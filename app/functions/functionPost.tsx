// userService.ts
import { api } from './api'; // Importamos la instancia de Axios configurada
import { Usuario } from "../types";
import axios from 'axios';

// Función para crear un usuario
export const crearUsuario = async (usuarioData: Usuario): Promise<{ success: boolean; data?: any; error?: any }> => {
  try {
    let dataToSend: Partial<Usuario> = usuarioData;

    // Si el usuario es un vendedor, solo enviamos Nombre y Rol
    if (usuarioData.Rol === "vendedor") {
      dataToSend = { Nombre: usuarioData.Nombre, Rol: "vendedor" };
    }

    const response = await api.post('/users', dataToSend);

    // Si la creación es exitosa, devolvemos success: true y los datos del usuario
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error del servidor:', error.response?.data); // 👀 Mensaje detallado aquí
      // Devuelve success: false y el error del servidor
      return { success: false, error: error.response?.data };
    } else {
      console.error('Error inesperado:', error);
      // Devuelve success: false y el error inesperado
      return { success: false, error: "Error inesperado al crear el usuario" };
    }
  }
};
