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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white text-black rounded-xl shadow-lg w-full max-w-md transform transition-all">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Editar Pedido</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="h-48 w-full overflow-hidden rounded-lg">
              <img
                className="w-full h-full object-cover"
                src={pedido.Imagen || "https://dummyimage.com/600x400/cccccc/ffffff.png&text=No+Image"}
                alt="Imagen del pedido"
              />
            </div>

            <div className="grid gap-2">
              <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cliente</span>
                  <span className="font-medium">{pedido.Nombre}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Descripción</span>
                  <span className="font-medium">{pedido.Descripcion}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Observaciones</span>
                  <span className="font-medium">{pedido.Observaciones}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Precio</span>
                  <span className="font-medium">${pedido.Precio}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Monto</label>
                  <input
                    type="number"
                    value={monto ?? ""}
                    onChange={(e) => setMonto(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Fletero</label>
                  <input
                    type="text"
                    value={fletero}
                    onChange={(e) => setFletero(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Pagado</label>
                  <select
                    value={pagado}
                    onChange={(e) => setPagado(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="No Pagado">No Pagado</option>
                    <option value="Pagado">Pagado</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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