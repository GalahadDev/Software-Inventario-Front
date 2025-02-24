"use client";
import React, { useState, useMemo } from "react";
import { Pedido } from "app/types";
import { DollarSign, CreditCard, Truck, Package, MapPin, ClipboardList } from "lucide-react"; // Importar los iconos
import { ComisionModal } from "app/ReusableComponents/ModalTotalMonto"; // Importar el modal de comisiones
import { toChileDate } from "app/functions/dateUtils";

interface PedidosPagadosProps {
  pedidosPagados: Pedido[];
  onBackToNoPagados: () => void; 
}

export const PedidosPagados: React.FC<PedidosPagadosProps> = ({ pedidosPagados, onBackToNoPagados }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalComision, setTotalComision] = useState(0);
  const [totalComisionSugerida, setTotalComisionSugerida] = useState(0);

  // Filtrar pedidos por fecha
  const filteredPedidos = useMemo(() => {
    if (!pedidosPagados) return [];
  
    // Ordenar pedidos de más reciente a más antiguo
    const sortedPedidos = [...pedidosPagados].sort((a, b) =>
      toChileDate(new Date(b.FechaCreacion)).getTime() - toChileDate(new Date(a.FechaCreacion)).getTime()
    );
  
    return sortedPedidos.filter((pedido) => {
      const fechaCreacionChile = toChileDate(new Date(pedido.FechaCreacion));
      if (isNaN(fechaCreacionChile.getTime())) return false;
  
      // Convertir startDate y endDate a horario de Chile (si existen)
      const fechaInicioChile = startDate ? toChileDate(new Date(startDate)) : null;
      const fechaTerminoChile = endDate ? toChileDate(new Date(endDate)) : null;
  
      console.log("Pedido (Chile):", fechaCreacionChile.toISOString().split("T")[0]);
      console.log("Inicio (Chile):", fechaInicioChile?.toISOString().split("T")[0]);
      console.log("Fin (Chile):", fechaTerminoChile?.toISOString().split("T")[0]);
  
      // Si no hay fechas, devolver todos los pedidos
      if (!fechaInicioChile || !fechaTerminoChile) return true;
  
      // Verificar si la fecha de creación está dentro del rango
      return fechaCreacionChile >= fechaInicioChile && fechaCreacionChile <= fechaTerminoChile;
    });
  }, [pedidosPagados, startDate, endDate]);
  
  
  
  
  

  const calcularComisiones = () => {
    if (!startDate || !endDate) {
      setErrorMessage("DEBE INGRESAR FECHA DE INICIO Y FECHA DE TERMINO");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    if (startDate > endDate) {
      setErrorMessage("LA FECHA DE INICIO DEBE SER MENOR O IGUAL A LA FECHA DE TÉRMINO");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    // Calcular las comisiones
    const { totalComision, totalComisionSugerida } = filteredPedidos.reduce(
      (totales, pedido) => {
        totales.totalComision += typeof pedido.Monto === "string"
          ? parseFloat(pedido.Monto)
          : Number(pedido.Monto) || 0;
        totales.totalComisionSugerida += typeof pedido.Comision_Sugerida === "string"
          ? parseFloat(pedido.Comision_Sugerida)
          : Number(pedido.Comision_Sugerida) || 0;
        return totales;
      },
      { totalComision: 0, totalComisionSugerida: 0 }
    );

    setTotalComision(totalComision);
    setTotalComisionSugerida(totalComisionSugerida);
    setIsModalOpen(true); // Abrir el modal de comisiones
    setErrorMessage(""); // Limpiar mensaje de error si las fechas son válidas
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

      {/* Filtrado por fecha y cálculo de comisiones */}
      <div className="mb-8">
        <div className="flex gap-4 justify-center mb-4">
          <input
            type="date"
            value={startDate?.toISOString().split("T")[0] || ""}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-black"
          />
          <input
            type="date"
            value={endDate?.toISOString().split("T")[0] || ""}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-black"
          />
          <button
            onClick={calcularComisiones}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Calcular Comisiones
          </button>
        </div>
        {errorMessage && (
          <p className="text-sm text-red-500 text-center mb-4">{errorMessage}</p>
        )}
      </div>

      {/* Lista de pedidos pagados */}
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
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium bg-green-700 text-white`}
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
                  {isNaN(pedido.Precio) ? "0.00" : pedido.Precio.toFixed(2)}
                </span>
              </div>

              <div className="space-y-3">
                {/* Descripción */}
                <div className="flex items-start">
                  <Package className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">Producto: {pedido.Descripcion}</p>
                </div>

                {/* Tela */}
                {pedido.Tela && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                    <p className="text-gray-600">Tela: {pedido.Tela}</p>
                  </div>
                )}

                {/* Color */}
                {pedido.Color && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                    <p className="text-gray-600">Color: {pedido.Color}</p>
                  </div>
                )}

                {/* Dirección */}
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">Direccion: {pedido.Direccion}</p>
                </div>

                {/* Forma de pago */}
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">Forma de pago: {pedido.Forma_Pago}</p>
                </div>

                {/* Observaciones */}
                {pedido.Observaciones && (
                  <div className="flex items-start">
                    <ClipboardList className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-600">Observaciones: {pedido.Observaciones}</p>
                  </div>
                )}

                {/* Fletero y comisiones */}
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

                {/* Estado de pago */}
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">Estado de pago: {pedido.Pagado}</p>
                </div>

                {/* Fecha */}
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">{new Date(pedido.FechaCreacion).toLocaleDateString("es-ES")}</p>
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