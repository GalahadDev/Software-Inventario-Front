"use client";

import Link from 'next/link';
import { useFetchData } from '../../functions/axiosFunctionGet';
import { Header } from '../../ReusableComponents/Header';
import { Vendedor } from "../../types";
import { Users } from "lucide-react";
import { useState } from 'react';


const navigation = [
  { name: 'Ver Vendedores', href: '/listaVendedores' },
  { name: 'Ver Pedidos', href: '/pedidosGenerales' },
  { name: 'Crear Vendedor', href: '/crearVendedor' },
  { name: "Crear Pedido", href: "/vendedorAdm" },
  {name: "Usuarios", href: "/listaUsuarios"}, 
];

const OrdersPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = await params;
  const { data, error, loading } = useFetchData<Vendedor[]>("/users/vendedores");
  const [searchTerm, setSearchTerm] = useState('');

  const errorMessage = typeof error === 'object' && error !== null && 'message' in error
    ? (error as { message: string }).message
    : "Ocurrió un error desconocido.";

  const handleRedirect = (vendedorId: string) => {
    if (vendedorId) {
      return `/pedidos/${vendedorId}`;
    } else {
      console.error("ID del vendedor es inválido");
      return "#";
    }
  };

  // Filtrar la lista de vendedores basado en el término de búsqueda
  const filteredVendedores = data?.filter(vendedor =>
    vendedor.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b bg-slate-50">
      <Header navigation={navigation} />

      <main className="container mx-auto px-4 py-12 mt-[80px]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4">
              Lista de Vendedores

            </h1>
            <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>

         
          <div className="mb-8">
            <input
              type="text"
              placeholder="Buscar vendedor por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          {loading && (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-8 rounded-r">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-200">
                    Error al cargar los vendedores: {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-3">
  {filteredVendedores?.map((vendedor) => (
    <div
      key={vendedor.ID}
      className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Users className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 dark:text-white text-center mb-6">
          {vendedor.Nombre}
        </h3>

        <div className="flex justify-center">
          <Link
            href={handleRedirect(vendedor.ID)}
            className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors duration-200 transform hover:scale-105"
          >
            Ver Pedidos
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  ))}
</div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;