import { useUpdateData } from "./functionPut";

export const usePedidoActions = () => {
  const { updateData } = useUpdateData();

  const markAsAttended = async (pedidoId: number) => {
    try {
      // 1. Modificar para enviar solo el campo necesario
      return await updateData(`/pedidos/${pedidoId}`, { 
        atendido: true,
        // 2. Eliminar campos undefined
      });
    } catch (error) {
      // 3. Mejorar manejo de errores
      console.error("Error en markAsAttended:", {
        pedidoId,
        error: error instanceof Error ? error.message : "Error desconocido"
      });
      throw new Error("No se pudo marcar el pedido como atendido");
    }
  };

  return { markAsAttended };
};