import axios from "axios";

// Instancia de Axios con configuración base
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // URL base general
});

// Interceptor de solicitudes: Agrega el token a cada solicitud
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor de respuestas: Maneja errores globalmente
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        console.warn("El token es inválido o ha expirado.");
        localStorage.removeItem("authToken");
        window.location.href = "/login"; // Redirige al inicio de sesión
    }
    return Promise.reject(error);
});

// Función para iniciar sesión. Devuelve el token generado por el backend.
export const login = async (data: { email: string; contrasena: string }) => {
    try {
        const response = await api.post("auth/login", data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 400) {
            throw new Error("Credenciales incorrectas. Por favor, verifica tu correo y contrasena.");
        }
        throw error;
    }
};

// Función para obtener datos protegidos
export const getProtectedData = async () => {
    return await api.get("/user/data");
};


type saleForm = {
    nombre:string,
    descripcion:string,
    precio:number,
    observaciones:string,
    forma_pago:string,
    direccion:string,
    imagen:string| null;
    usuario_id:string | null

}

export const sendSalesData = async (sales: saleForm) => {
  try {
      const formData = new FormData();

      // Agregar los datos del formulario al FormData
      formData.append("nombre", sales.nombre.toString());
      formData.append("descripcion", sales.descripcion.toString());
      formData.append("precio", sales.precio.toString()); // Asegúrate de que es un string
      formData.append("observaciones", sales.observaciones.toString());
      formData.append("forma_pago", sales.forma_pago.toString());

      if (sales.usuario_id) {
          formData.append("usuario_id", sales.usuario_id.toString());
      } else {
          throw new Error("El campo 'usuario_id' es obligatorio.");
      }

      if (sales.direccion && sales.direccion.trim() !== "") {
          formData.append("direccion", sales.direccion);
      } else {
          throw new Error("El campo 'direccion' es obligatorio.");
      }

      if (sales.imagen) {
          formData.append("imagen", sales.imagen);
      }

      // Imprime los datos para verificar
      console.log("Datos enviados al servidor:");
      for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
      }

      // Realizar la solicitud POST
      const response = await api.post("/pedidos", formData, {
          headers: {
              "Content-Type": "multipart/form-data",
          },
      });

      console.log("Respuesta del servidor:", response.data);
      alert("Datos enviados correctamente");
      return response.data;
  } catch (error: any) {
      console.error("Error al enviar los datos:", error);

      if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
              alert("Solicitud inválida: " + (data.message || "Revisa los datos enviados."));
          } else if (status === 500) {
              alert("Error en el servidor. Por favor, inténtalo más tarde.");
          } else {
              alert("Ocurrió un error inesperado.");
          }
      } else {
          alert("No se pudo conectar con el servidor.");
      }
      throw error;
  }
};
  