import { api } from '../functions/api';

export const updateBankData = async <T extends object>(data: T, endpoint: string): Promise<void> => {
    try {
        const response = await api.put(endpoint, data);
       
       
    } catch (error) {
        console.error('Error al actualizar los datos:', error);
        
    }
};
