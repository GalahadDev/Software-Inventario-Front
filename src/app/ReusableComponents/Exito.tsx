import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function SuccessModal({ isOpen, onClose, message = '¡Operación exitosa!' }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm transform transition-all">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-green-100">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {message}
            </h3>
            <p className="text-sm text-gray-500">
              La operación se ha completado correctamente.
            </p>
          </div>

          {/* Button */}
          <button
            onClick={onClose}
            className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
