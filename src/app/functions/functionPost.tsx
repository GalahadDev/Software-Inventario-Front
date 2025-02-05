// userService.ts

import { api } from './api'; // Importamos la instancia de Axios configurada
import { Usuario } from "../types"



// Función para crear un usuario
export const crearUsuario = async (usuarioData: Usuario) => {
  try {
    // Realiza la solicitud POST para crear un nuevo usuario
    const response = await api.post('/users', usuarioData);
    return response.data; // Devuelve los datos de la respuesta (generalmente, el usuario creado)
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw error; // Propaga el error para ser manejado donde se llame a esta función
  }
};
