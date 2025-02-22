"use client";

import React from "react";

interface ComisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalMonto: number;
  totalComisionSugerida: number; // Nueva prop para la comisión sugerida
  startDate: Date | null;
  endDate: Date | null;
  pedidosEntregados: number;
  pedidosFiltrados: number
}

export const ComisionModal: React.FC<ComisionModalProps> = ({
  isOpen,
  onClose,
  totalMonto,
  totalComisionSugerida, // Recibe la comisión sugerida
  startDate,
  endDate,
  pedidosEntregados,
  pedidosFiltrados
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        {/* Título */}
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
          Comisiones Calculadas
        </h3>

        {/* Monto total de comisión normal */}
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-700">Total Comisión:</p>
          <p className="text-3xl font-bold text-green-600 text-center">
            ${totalMonto.toFixed(2)}
          </p>
        </div>

        {/* Monto total de comisión sugerida */}
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-700">Total Comisión Sugerida:</p>
          <p className="text-3xl font-bold text-blue-600 text-center">
            ${totalComisionSugerida.toFixed(2)}
          </p>
        </div>

        {/* Detalles adicionales */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-500">
            Rango de fechas:{" "}
            {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">
            Pedidos entregados: {pedidosEntregados}
          </p>
        </div>

        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};