"use client";
import React, { useState } from "react";
import { Pedido } from "app/types";
import { XIcon, Loader2Icon } from "lucide-react";

interface ModalProps {
  pedido: Pedido;
  onClose: () => void;
  onSave: (id: number, monto: number, fletero: string, estado: string, Atendido: boolean, pagado: string) => void;
  loading: boolean;
}

export const Modal: React.FC<ModalProps> = ({ pedido, onClose, onSave, loading }) => {
  const [monto, setMonto] = useState<number | null>(pedido.Monto || null);
  const [fletero, setFletero] = useState<string>(pedido.Fletero || "");
  const [estado, setEstado] = useState(pedido.Estado || "");
  const [Atendido, setAtendido] = useState(pedido.Atendido || false);
  const [pagado, setPagado] = useState(pedido.Pagado || "No Pagado");

  const handleSave = () => {
    onSave(pedido.ID, monto ?? 0, fletero, estado, Atendido, pagado);
  };

  // Verificar si el estado es "Entregado"
  const isEstadoEntregado = estado === "Entregado";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white text-black rounded-xl shadow-lg w-full max-w-md transform transition-all max-h-[70vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Encabezado */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Editar Pedido</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Imagen del pedido */}
          <div className="h-40 w-full overflow-hidden rounded-lg">
            <img
              className="w-full h-full object-cover"
              src={pedido.Imagen || "https://dummyimage.com/600x400/cccccc/ffffff.png&text=No+Image"}
              alt="Imagen del pedido"
            />
          </div>

          {/* Detalles del pedido */}
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cliente</span>
                  <span className="font-medium text-gray-900">{pedido.Nombre}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Descripción</span>
                  <span className="font-medium text-gray-900">{pedido.Descripcion}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Observaciones</span>
                  <span className="font-medium text-gray-900">{pedido.Observaciones}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Precio</span>
                  <span className="font-medium text-gray-900">${pedido.Precio}</span>
                </div>
              </div>
            </div>

            {/* Campos editables */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comisión</label>
                <input
                  type="number"
                  value={monto ?? ""}
                  onChange={(e) => setMonto(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Ingrese la comisión"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fletero</label>
                <input
                  type="text"
                  value={fletero}
                  onChange={(e) => setFletero(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isEstadoEntregado ? "bg-gray-100 cursor-not-allowed" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Ingrese el fletero"
                  disabled={isEstadoEntregado} // Deshabilitar si el estado es "Entregado"
                />
                {/* Mensaje de error si el estado es "Entregado" */}
                {isEstadoEntregado && (
                  <p className="text-sm text-red-500 mt-1">
                    No se puede modificar el fletero de un pedido entregado.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Entregado">Entregado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pagado</label>
                <select
                  value={pagado}
                  onChange={(e) => setPagado(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="No Pagado">No Pagado</option>
                  <option value="Pagado">Pagado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </div>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};