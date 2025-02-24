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
                <p className="text-gray-600">Estado de pago: {pedido.Pagado ? "Pagado" : "Pendiente"}</p>
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
  </div>
  );
};
