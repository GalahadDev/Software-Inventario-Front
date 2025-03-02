"use client";

import React, { useEffect, useState } from 'react';
import { getUsers } from '../functions/usersFunctions';
import { deleteUser } from '../functions/deleteFunction';
import { Pencil, CreditCard, Banknote, Landmark, BadgeInfo, Trash2 } from 'lucide-react';
import { EditUserModal } from "../ReusableComponents/EditUserModal";
import { Header } from '../ReusableComponents/Header';
import { User } from "../types";
import { DeleteUserModal } from '../ReusableComponents/DeleteUserModal';

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getUsers();
        setUsers(userList);
      } catch (error) {
        setError('Error al cargar usuarios');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenDeleteModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.ID !== userId));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
    setIsDeleteModalOpen(false);
  };

  const handleSendToWhatsApp = (email: string) => {
    if (!email) {
      alert("No hay un correo electrónico para enviar.");
      return;
    }

    const mensaje = `Hola, este es tu Usuario: ${email}`;
    const mensajeCodificado = encodeURIComponent(mensaje);

    window.open(`https://api.whatsapp.com/send?text=${mensajeCodificado}`, "_blank");
  };

  const openModal = (user: User) => {
    console.log("Usuario seleccionado para edición:", user);
    if (user.Rol === "vendedor") {
      console.log("usuario Vendedor", user);
      setShowWarning(true);
      return;
    }

    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSave = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((user) => (user.ID === updatedUser.ID ? updatedUser : user))
    );
  };

  if (loading) return <div className="text-center p-8 text-gray-600">Cargando usuarios...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 min-h-screen flex flex-col">
      <Header navigation={ { name: "Ver Vendedores", href: "/listaVendedores" },
  { name: "Ver Pedidos", href: "/pedidosGenerales" },
  { name: "Crear Usuario", href: "/crearVendedor" },
  { name: "Crear Pedido", href: "/vendedorAdm" },
  { name: "Usuarios", href: "/listaUsuarios" },
  { name: "Galeria", href: "/galeria" }
];} />

      <h1 className="text-4xl font-extrabold text-gray-900 text-center mt-8 mb-8">
        Lista de Usuarios
      </h1>

      {showWarning && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p>Los vendedores no pueden ser editados.</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 pb-8">
          {users.map((user) => (
            <div
              key={user.ID}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">{user.Nombre}</h3>
                  <p className="text-gray-600">📧 {user.Email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendToWhatsApp(user.Email);
                    }}
                    className="bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <span>Enviar WhatsApp</span>
                  </button>
                  <button
                    onClick={() => openModal(user)}
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(user.ID)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      {isModalOpen && selectedUser && (
        <EditUserModal
          isOpen={isModalOpen}
          onClose={closeModal}
          user={selectedUser}
          onSave={handleSave}
        />
      )}

      {/* MODAL DE ELIMINACIÓN */}
      {isDeleteModalOpen && selectedUserId && (
  <DeleteUserModal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    userId={selectedUserId} // Ya no habrá error porque siempre será un string
    onConfirm={(deletedUserId) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.ID !== deletedUserId));
      setIsDeleteModalOpen(false);
    }}
  />
)}

    </div>
  );
}

export default UserList;
