import { toChileDate } from "./dateUtils";

export const filtrarPedidos = (
    pedidos: any[], // Lista de pedidos
    startDate?: string | null, // Fecha de inicio (puede ser null)
    endDate?: string | null, // Fecha de fin (puede ser null)
    searchTerm?: string // Término de búsqueda
  ) => {
    if (!pedidos) return [];
  
    // Ordenar pedidos por fecha de creación en orden descendente
    const sortedPedidos = [...pedidos].sort((a, b) =>
      toChileDate(new Date(b.FechaCreacion)).getTime() -
      toChileDate(new Date(a.FechaCreacion)).getTime()
    );
  
    return sortedPedidos.filter((pedido) => {
      const fechaPedido = toChileDate(new Date(pedido.FechaCreacion));
      if (isNaN(fechaPedido.getTime())) return false;
  
      // Filtrar por rango de fechas
      const isInRange =
        (!startDate || !endDate) || // Si no hay fechas, incluir todo
        (fechaPedido >= toChileDate(new Date(startDate)) &&
          fechaPedido <= toChileDate(new Date(endDate)));
  
      // Filtrar por término de búsqueda
      const matchesSearch = searchTerm
        ? Object.values(pedido)
            .filter((value) => value !== null && value !== undefined) 
            .some((value) =>
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        : true;
  
      return isInRange && matchesSearch;
    });
  };
  