"use client";
import React from "react";
import { Pedido } from "app/types";
import { DollarSign, CreditCard, Truck, Package, MapPin, ClipboardList } from "lucide-react";

interface PedidosPagadosProps {
  pedidosPagados: Pedido[];
}

export const PedidosPagados: React.FC<PedidosPagadosProps> = ({ pedidosPagados }) => {
  const getStatusColor = (estado: string | undefined): string => {
    const statusColors: Record<string, string> = {
      Pendiente: "bg-yellow-400 text-white",
      Entregado: "bg-green-700 text-white",
      Cancelado: "bg-red-700 text-white",
    };
    return statusColors[estado ?? ""] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Pedidos Pagados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pedidosPagados.map((pedido) => (
          <div
            key={`${pedido.ID}-${pedido.Nombre}`}
            className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer bg-white"
          >
            <div className="relative">
              <img
                src={pedido.Imagen || "https://dummyimage.com/600x400/cccccc/ffffff.png&text=No+Image"}
                alt={`Pedido de ${pedido.Nombre}`}
                className="w-full h-48 object-cover"
              />
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pedido.Estado)}`}
              >
                {pedido.Estado || "Sin estado"}
              </div>
              <span className="flex items-center text-black font-semibold">Nro Pedido: {pedido.Pagado}</span>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{pedido.Nombre}</h2>
                <span className="flex items-center text-green-600 font-semibold">
                  <DollarSign className="w-5 h-5 mr-1" />
                  {isNaN(pedido.Precio) ? "0.00" : pedido.Precio.toFixed(2)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <Package className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">{pedido.Descripcion}</p>
                </div>

                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">{pedido.Direccion}</p>
                </div>

                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">{pedido.Forma_Pago}</p>
                </div>

                {pedido.Observaciones && (
                  <div className="flex items-start">
                    <ClipboardList className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-600">{pedido.Observaciones}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-gray-600">{pedido.Fletero || "Sin Asignar"}</span>
                  </div>
                  <span className="text-sm text-gray-500">Comisión: ${pedido.Monto || "0"}</span>
                  <span className="text-sm text-gray-600">Pagado: {pedido.Pagado}</span>
                </div>

                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">{new Date(pedido.FechaCreacion).toLocaleDateString("es-ES")}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};