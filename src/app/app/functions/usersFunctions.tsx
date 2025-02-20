import { api } from './api';

export const getUsers = async () => {
    try {
      const response = await api.get('/users'); 
    
      return response.data;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw error; 
    }
  };

  export const editUser = async (
    userId: string,
    updatedData: {
      Nombre?: string;
      Email?: string;
      Rol?: string;
    }
  ) => {
    try {
      
      console.log('Enviando datos de actualización:', {
        userId,
        updatedData
      });
  
      const response = await api.put(`/users/${userId}`, updatedData);
      return response.data;
    } catch (error) {
      console.error('Error detallado al editar usuario:', error);
      throw new Error('No se pudo actualizar el usuario. Verifique la consola para más detalles.');
    }
  };