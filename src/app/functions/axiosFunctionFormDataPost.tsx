import { api } from "./api"; // Importa la instancia de Axios configurada
import { SaleForm } from "../types" 
import { useGlobalState } from '../Context/contextUser';




// Cambiar la definición de sendSalesData para aceptar 'usuario' como parámetro
export const sendSalesData = async (sales: SaleForm) => {
  try {
    const formData = new FormData();

    formData.append("nombre", sales.nombre.toString());
    formData.append("descripcion", sales.descripcion.toString());
    if (sales.precio !== null && sales.precio !== undefined) {
      formData.append("precio", sales.precio.toString());
    } else {
      throw new Error("El campo 'precio' es obligatorio.");
    }
    formData.append("observaciones", sales.observaciones.toString());
    formData.append("forma_pago", sales.forma_pago.toString());
    formData.append("nro_tlf", sales.nro_tlf.toString());
    formData.append("tela", sales.tela)
    formData.append("color", sales.color)
    formData.append("sub_vendedor", sales.subVendedor)
    formData.append("comision_sugerida",sales.Comision_Sugerida.toString()); 
    formData.append("fecha_entrega", sales.fecha_entrega)
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

    if (sales.imagen && typeof sales.imagen === "object") {
      formData.append("imagen", sales.imagen);
    }

    const response = await api.post("/pedidos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

   
    
  
    return response.data;
  } catch (error: any) {
    console.error("Error al enviar los datos:", error);
    throw error;
  }
};
