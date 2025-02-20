import { api } from "./api";

export const login = async (data: { email: string; contrasena: string }) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      throw new Error("Credenciales incorrectas. Por favor, verifica tu correo y contrasena.");
    }
    throw error;
  }
};

export const loginVendedor = async (data: { nombre: string }) => {
  try {
    const response = await api.post("/auth/loginVendedor", data); // Cambia la ruta según tu API
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      throw new Error("Nombre incorrecto. Por favor, verifica tu nombre.");
    }
    throw error;
  }
};