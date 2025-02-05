'use client';

import { useState } from 'react';

interface ModalTotalMontoProps {
  totalMonto: number;
  onClose: () => void;
}

export const ModalTotalMonto: React.FC<ModalTotalMontoProps> = ({ totalMonto, onClose }: { totalMonto: number; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-bold mb-4">Total de Montos</h2>
        <p className="text-gray-700">
          El total de los montos de los pedidos es: <strong>${totalMonto.toFixed(2)}</strong>
        </p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};