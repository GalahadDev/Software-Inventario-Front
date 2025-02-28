import React from 'react';
import { X } from 'lucide-react';
import { deleteUser } from 'app/functions/deleteFunction';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onConfirm: (userId: string) => void;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  userId,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      await deleteUser(`/users/${userId}`); // Asegúrate de que el endpoint es correcto
      onConfirm(userId); // Elimina al usuario de la lista en `UserList.tsx`
      onClose();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Confirmar eliminación</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="py-4">
          <p className="text-gray-700 text-center text-lg">
            ¿Desea borrar a este usuario?
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            No
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Sí
          </button>
        </div>
      </div>
    </div>
  );
};
