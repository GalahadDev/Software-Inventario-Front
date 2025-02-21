"use client";

import React, { useState, useEffect } from 'react';
import { editUser } from '../functions/usersFunctions';
import { User } from "../types";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updatedUser: User) => void;
}

export function EditUserModal({ isOpen, onClose, user, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    Nombre: '',
    Contrasena: '',
    Email: '',
    Rol: ''
  });

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        Nombre: user.Nombre || '',
        Contrasena: user.Contrasena || '',
        Email: user.Email || '',
        Rol: user.Rol || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Bloquear edición de Email para vendedores
    if (name === "Email" && !['administrador', 'gestor'].includes(formData.Rol)) return;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const payload = {
        Nombre: formData.Nombre,
        Contrasena: formData.Contrasena,
        ...(['administrador', 'gestor'].includes(formData.Rol) && { Email: formData.Email }),
        Rol: formData.Rol
      };

      const updatedUser = await editUser(user.ID, payload);
      onSave(updatedUser);
      onClose();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-black">Editar Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Campo Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
              <input
                type="text"
                name="Nombre"
                value={formData.Nombre}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                required
              />
            </div>

            {/* Campo Email (solo para personal administrativo) */}
            {['administrador', 'gestor'].includes(formData.Rol) && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  required
                />
              </div>
            )}

            {/* Campo Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                name="Contrasena"
                value={formData.Contrasena}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>

            {/* Selector de Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <select
                name="Rol"
                value={formData.Rol}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                required
              >
                <option value="administrador">Administrador</option>
                <option value="gestor">Gestor</option>
                <option value="vendedor">Vendedor</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}