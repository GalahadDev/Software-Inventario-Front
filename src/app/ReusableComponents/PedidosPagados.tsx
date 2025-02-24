"use client";
import React, { useState, useMemo } from "react";
import { Pedido } from "app/types";
import { DollarSign, CreditCard, Truck, Package, MapPin, ClipboardList } from "lucide-react";
import { ComisionModal } from "app/ReusableComponents/ModalTotalMonto";
import { toChileDate } from "app/functions/dateUtils";
import { SearchDate } from "app/ReusableComponents/SearchDate";
import { SearchBar } from "app/ReusableComponents/SearchBar";

interface PedidosPagadosProps {
  pedidosPagados: Pedido[];
  onBackToNoPagados: () => void; 
}

export const PedidosPagados: React.FC<PedidosPagadosProps> = ({ pedidosPagados, onBackToNoPagados }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para el buscador
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalComision, setTotalComision] = useState(0);
  const [totalComisionSugerida, setTotalComisionSugerida] = useState(0);

  // Función para formatear la fecha a Chile
  const formatDate = (fecha: string | Date): string => {
    return toChileDate(new Date(fecha)).toLocaleDateString("es-ES");
  };

  // Filtrar pedidos: incluye la lógica de fechas y búsqueda
  const filteredPedidos = useMemo(() => {
    if (!pedidosPagados) return [];
  
    const sortedPedidos = [...pedidosPagados].sort((a, b) =>
      toChileDate(new Date(b.FechaCreacion)).getTime() - toChileDate(new Date(a.FechaCreacion)).getTime()
    );
  
    return sortedPedidos.filter((pedido) => {
      const fechaPedido = toChileDate(new Date(pedido.FechaCreacion));
      if (isNaN(fechaPedido.getTime())) return false;
  
      // Si no se han seleccionado ambas fechas, se muestran todos
      const fechaInicio = startDate ? toChileDate(new Date(startDate)) : null;
      const fechaFin = endDate ? toChileDate(new Date(endDate)) : null;
      const inRange = fechaInicio && fechaFin ? (fechaPedido >= fechaInicio && fechaPedido <= fechaFin) : true;
  
      // Filtrar por búsqueda: se revisan todas las propiedades del pedido
      const matchesSearch = searchTerm
        ? Object.values(pedido)
            .filter((value) => value !== null && value !== undefined)
            .some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
  
      return inRange && matchesSearch;
    });
  }, [pedidosPagados, startDate, endDate, searchTerm]);

  const calcularComisiones = () => {
    if (!startDate || !endDate) {
      setErrorMessage("DEBE INGRESAR FECHA DE INICIO Y FECHA DE TÉRMINO");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
    if (startDate > endDate) {
      setErrorMessage("LA FECHA DE INICIO DEBE SER MENOR O IGUAL A LA FECHA DE TÉRMINO");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }
  
    const { totalComision, totalComisionSugerida } = filteredPedidos.reduce(
      (totales, pedido) => {
        totales.totalComision +=
          typeof pedido.Monto === "string"
            ? parseFloat(pedido.Monto)
            : Number(pedido.Monto) || 0;
        totales.totalComisionSugerida +=
          typeof pedido.Comision_Sugerida === "string"
            ? parseFloat(pedido.Comision_Sugerida)
            : Number(pedido.Comision_Sugerida) || 0;
        return totales;
      },
      { totalComision: 0, totalComisionSugerida: 0 }
    );
  
    setTotalComision(totalComision);
    setTotalComisionSugerida(totalComisionSugerida);
    setIsModalOpen(true);
    setErrorMessage("");
  };

  const getStatusColor = (estado: string | undefined): string => {
    const statusColors: Record<string, string> = {
      Pendiente: "bg-yellow-400 text-white",
      Entregado: "bg-green-700 text-white",
      Cancelado: "bg-red-700 text-white",
    };
    return statusColors[estado ?? ""] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Pedidos Pagados
      </h1>

      {/* Botón para volver a Pedidos No Pagados */}
      <div className="flex justify-center mb-8">
        <button
          onClick={onBackToNoPagados}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Ver Pedidos No Pagados
        </button>
      </div>

      {/* Controles de filtrado: fechas y búsqueda */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <SearchDate
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
        <SearchBar onSearch={setSearchTerm} placeholder="Buscar..." />
        <button
          onClick={calcularComisiones}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Calcular Comisiones
        </button>
        {errorMessage && (
          <p className="text-sm text-red-500 text-center">{errorMessage}</p>
        )}
      </div>

      {/* Lista de pedidos pagados filtrados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPedidos.map((pedido) => (
          <div
            key={pedido.ID}
            className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white"
          >
            <div className="relative">
              <img
                src={pedido.Imagen || "https://images.1sticket.com/landing_page_20191025154518_107273.png"}
                alt={`Pedido de ${pedido.Nombre}`}
                className="w-full h-48 object-cover"
              />
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pedido.Estado)}`}
              >
                {pedido.Estado || "Sin estado"}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {pedido.Nombre} <span className="text-sm text-gray-500">(ID: {pedido.ID})</span>
                </h2>
                <span className="flex items-center text-green-600 font-semibold">
                  <DollarSign className="w-5 h-5 mr-1" />
                  {pedido.Precio}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Package className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">Producto: {pedido.Descripcion}</p>
                </div>
                {pedido.Tela && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                    <p className="text-gray-600">Tela: {pedido.Tela}</p>
                  </div>
                )}
                {pedido.Color && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                    <p className="text-gray-600">Color: {pedido.Color}</p>
                  </div>
                )}
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">Dirección: {pedido.Direccion}</p>
                </div>
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">Forma de pago: {pedido.Forma_Pago}</p>
                </div>
                {pedido.Observaciones && (
                  <div className="flex items-start">
                    <ClipboardList className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-600">Observaciones: {pedido.Observaciones}</p>
                  </div>
                )}
                <div className="flex flex-col space-y-2 pt-3 border-t border-gray-100">
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-gray-600">Despacho: {pedido.Fletero || "Sin Asignar"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">Comisión: ${pedido.Monto || "0"}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">Comisión (Vendedor): ${pedido.Comision_Sugerida || "0"}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">Estado de pago: {pedido.Pagado ? "Pagado" : "Pendiente"}</p>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">{formatDate(pedido.FechaCreacion)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de comisiones */}
      {isModalOpen && (
        <ComisionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          totalMonto={totalComision}
          totalComisionSugerida={totalComisionSugerida}
          startDate={startDate}
          endDate={endDate}
          pedidosFiltrados={filteredPedidos.length}
          pedidosEntregados={filteredPedidos.filter(
            (pedido) => pedido.Estado === "Entregado"
          ).length}
        />
      )}
    </div>
  );
};

export default PedidosPagados;
