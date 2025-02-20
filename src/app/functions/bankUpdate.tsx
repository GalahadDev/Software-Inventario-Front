import { api } from '../functions/api';

export const updateBankData = async <T extends object>(data: T, endpoint: string): Promise<void> => {
    try {
        const response = await api.put(endpoint, data);
        console.log('Respuesta del servidor:', response.data);
        alert('Datos actualizados correctamente');
    } catch (error) {
        console.error('Error al actualizar los datos:', error);
        alert('Hubo un error al actualizar los datos');
    }
};
