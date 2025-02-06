// userService.ts

import { api } from './api'; // Importamos la instancia de Axios configurada
import { Usuario } from "../types"
import  axios  from 'axios';


// Función para crear un usuario
// userService.ts
export const crearUsuario = async (usuarioData: Usuario) => {
  try {
    const response = await api.post('/users', usuarioData);
    console.log('Usuario creado:', response.data); // ❌ Quita el .error (solo si la API lo incluye)
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error del servidor:', error.response?.data); // 👀 Mensaje detallado aquí
    } else {
      console.error('Error inesperado:', error);
    }
    throw error; // Propaga el error para manejarlo donde se llame a la función
  }
};