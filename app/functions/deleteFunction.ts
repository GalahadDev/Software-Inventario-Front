import { api } from "./api"; // Asegúrate de que la ruta sea correcta


export const deleteUser = async (endpoint: string): Promise<void> => {
  try {
    const response = await api.delete(endpoint);
    console.log("Usuario eliminado correctamente:", response.data);
  } catch (error: any) {
    console.error("Error al eliminar el usuario:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      endpoint,
    });
    throw new Error(error.response?.data?.message || "Error al eliminar el usuario");
  }
};