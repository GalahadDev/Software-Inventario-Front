"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { Pedido } from "app/types";
import { DollarSign, CreditCard, Truck, Package, MapPin, ClipboardList } from "lucide-react";
import { ComisionModal } from "app/ReusableComponents/ModalTotalMonto";
import { toChileDate } from "app/functions/dateUtils";
import { SearchDate } from "app/ReusableComponents/SearchDate";
import { SearchBar } from "app/ReusableComponents/SearchBar";

// ... Otras importaciones y lógica (por ejemplo, uso de contextos, etc.)

const PedidosPage = () => {
  // Estados existentes
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // NUEVO: estado para la búsqueda
  // ... otros estados y lógica (por ejemplo, para modal, error, etc.)

  // Supongamos que tienes ya pedidosNoPagados de algún lado (filtrados del context o props)
  // const [pedidosNoPagados, setPedidosNoPagados] = useState<Pedido[]>([]);
  
  // Lógica de filtrado: ahora se tiene en cuenta el término de búsqueda
  const filteredPedidos = useMemo(() => {
    if (!pedidosNoPagados) return [];
    const sortedPedidos = [...pedidosNoPagados].sort((a, b) =>
      toChileDate(new Date(b.FechaCreacion)).getTime() -
      toChileDate(new Date(a.FechaCreacion)).getTime()
    );
    return sortedPedidos.filter((pedido) => {
      const fechaPedido = toChileDate(new Date(pedido.FechaCreacion));
      if (isNaN(fechaPedido.getTime())) return false;
  
      const fechaInicio = startDate ? toChileDate(new Date(startDate)) : null;
      const fechaFin = endDate ? toChileDate(new Date(endDate)) : null;
      const inRange = fechaInicio && fechaFin
        ? (fechaPedido >= fechaInicio && fechaPedido <= fechaFin)
        : true;
  
      // Filtrado por búsqueda: se revisan todas las propiedades del pedido
      const matchesSearch = searchTerm
        ? Object.values(pedido)
            .filter((value) => value !== null && value !== undefined)
            .some((value) =>
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        : true;
  
      return inRange && matchesSearch;
    });
  }, [pedidosNoPagados, startDate, endDate, searchTerm]);

  // ... resto de la lógica de la página (cálculo de comisiones, manejo de modales, etc.)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Aquí probablemente ya tienes tu header y demás */}
      <main className="flex-grow mt-[80px] px-4 py-8 container mx-auto">
        {/* Controles de filtrado: fechas y buscador */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <SearchDate
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <SearchBar onSearch={setSearchTerm} placeholder="Buscar..." />
          {/* Aquí podrías mantener tu botón para calcular comisiones */}
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

        {/* Lista de pedidos filtrados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-3">
          {filteredPedidos.map((pedido) => {
            const fecha = toChileDate(new Date(pedido.FechaCreacion)).toLocaleDateString("es-ES");
            return (
              <div
                key={`${pedido.ID}-${pedido.Nombre}`}
                className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform origin-center ${pedido.Atendido ? 'bg-white' : 'bg-yellow-200 animate-pulse-scale'}`}
                // ... onClick y demás props
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
                  {/* Aquí tu renderizado de datos del pedido */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {pedido.Nombre} <span className="text-sm text-gray-500">(ID: {pedido.ID})</span>
                    </h2>
                    <span className="flex items-center text-green-600 font-semibold">
                      <DollarSign className="w-5 h-5 mr-1" />
                      {isNaN(pedido.Precio) ? "0.00" : pedido.Precio.toFixed(2)}
                    </span>
                  </div>
                  {/* ... Resto de la información (Descripción, Direccion, etc.) */}
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                    <p className="text-gray-600">{fecha}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal de comisiones (si corresponde) */}
        {isModalOpen && (
          <ComisionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            totalMonto={totalComision}
            totalComisionSugerida={totalComisionSugerida}
            startDate={startDate}
            endDate={endDate}
            pedidosFiltrados={filteredPedidos.length}
            pedidosEntregados={filteredPedidos.filter((pedido) => pedido.Estado === "Entregado").length}
          />
        )}
      </main>
    </div>
  );
};

export default PedidosPage;
