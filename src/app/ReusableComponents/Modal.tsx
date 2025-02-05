import React, { useState } from "react";
import { Pedido } from "../types";
import { ModalProps } from "../types"


export const Modal: React.FC<ModalProps> = ({ pedido, onClose, onSave, loading }) => {
  // Aquí, el estado 'monto' puede ser un número o null
  const [monto, setMonto] = useState<number | null>(pedido.Monto || null);
  const [fletero, setFletero] = useState<string>(pedido.Fletero || "");
  const [estado, setEstado] = useState(pedido.Estado || "");
  const [Atendido, setAtendido] = useState(pedido.atendido || false);
  
  const handleSave = () => {
    onSave(pedido.ID, monto ?? 0, fletero, estado, Atendido);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Editar Pedido</h2>

        <div>
          <img
          className="rounded-lg"
          src={pedido.Imagen || "https://dummyimage.com/150x150/cccccc/ffffff.png&text=No+Image"}/>
        </div>

        <div className="mb-4">
          <span className="text-sm text-black font-extrabold">Cliente: {pedido.Nombre}</span> <br/>
          <span className="text-sm text-black font-extrabold">Descipcion: {pedido.Descripcion}</span><br/>
          <span className="text-sm text-black font-extrabold">Observaciones: {pedido.Observaciones}</span><br/>
          <span className="text-sm text-black font-extrabold">Nombre: {pedido.Nombre}</span><br/>
          <span className="text-sm text-black font-extrabold">Precio: {pedido.Precio}</span>
        </div>

        <label className="block text-sm mb-2">Monto</label>
        <input
          type="number"
          value={monto ?? ""}  // Si monto es null, mostrar como una cadena vacía
          onChange={(e) => setMonto(e.target.value ? Number(e.target.value) : null)}  // Manejo de null si el campo está vacío
          className="border-blue-1000 w-full px-4 py-2 border rounded-lg"
        />

        <label className="block text-sm mb-2">Fletero</label>
        <input
          type="text"
          value={fletero}
          onChange={(e) => setFletero(e.target.value)}
          className="border-blue-1000 w-full px-4 py-2 border rounded-lg"
        />

<label className="block text-sm mb-2"></label>
<select
  value={estado}
  onChange={(e) => setEstado(e.target.value)}
  className="border-blue-1000 w-full px-4 py-2 border rounded-lg"
>
  <option value="Pendiente">Pendiente</option>
  <option value="Entregado">Entregado</option>
  <option value="Cancelado">Cancelado</option>
</select>

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};
