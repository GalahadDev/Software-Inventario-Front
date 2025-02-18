"use client";

import React, { useEffect, useState } from 'react';
import { getUsers } from '../functions/usersFunctions';
import { Pencil } from 'lucide-react';
import { EditUserModal } from "../ReusableComponents/EditUserModal"; 
import { Header } from '../ReusableComponents/Header';

// Definir la interfaz User
interface User {
  ID: string;
  Nombre: string;
  Email?: string;
  usuario?: string;
  Rol: string;
  Contrasena: string;
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showWarning, setShowWarning] = useState(false); // Estado para mostrar advertencia

  const navigation = [
    { name: 'Ver Vendedores', href: '/listaVendedores' },
    { name: 'Ver Pedidos', href: '/pedidosGenerales' },
    { name: 'Crear Usuario', href: '/crearVendedor' },
    { name: "Crear Pedido", href: "/vendedorAdm" },
    { name: "Usuarios", href: "/listaUsuarios" }, 
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await getUsers();
        setUsers(userList);
        console.log(userList);
      } catch (error) {
        setError('Error al cargar usuarios');
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const openModal = (user: User) => {
    if (user.Rol === "vendedor") {
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
      <Header navigation={navigation} />
  
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
          {users.map((user) => {
            console.log(user.Email); // Mover el console.log aquí
            return (
              <div
                key={user.ID}
                onClick={() => openModal(user)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">{user.Nombre}</h3>
                    <div className="text-sm space-y-1">
                      {/* Mostrar email o usuario según el rol */}
                      {user.Rol === "administrador" || user.Rol === "gestor" ? (
                        <>
                          {user.Email && <p className="text-gray-600">📧 {user.Email}</p>}
                          <p className="text-gray-500">🏷️ Rol: {user.Rol}</p>
                        </>
                      ) : (
                        <>
                          {user.Email && <p className="text-gray-600">👤 {user.Email}</p>}
                          <p className="text-gray-500">🏷️ Rol: {user.Rol}</p>
                        </>
                      )}
                    </div>
                  </div>
                  <Pencil className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
  
      <EditUserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={selectedUser}
        onSave={handleSave}
      />
    </div>
  );
}

export default UserList;