"use client";

import Link from 'next/link';
import { useFetchData } from '../functions/axiosFunctionGet';
import { Vendedor } from "../types"






const OrdersPage = () => {
 

  // Llamada al hook con tipado explícito para los datos que devuelve
  const { data, error, loading } = useFetchData<Vendedor[]>("/users/vendedores");

  const errorMessage = typeof error === 'object' && error !== null && 'message' in error
    ? (error as { message: string }).message
    : "Ocurrió un error desconocido.";

  // Función para manejar el redireccionamiento
  const handleRedirect = (vendedorId: string) => {
   
    if (vendedorId) {
     
      return `/pedidos/${vendedorId}`;  // Retorna la URL formateada
    } else {
      console.error("ID del vendedor es inválido");
      return "#";  // Retorna una URL de fallback
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-1000 flex flex-col justify-start">
      <h1 className="text-3xl font-bold mb-6 text-center mt-16">
        Lista de Vendedores 
      </h1>

      {loading && <p>Cargando Vendedores...</p>}
      {error && <p className="text-red-500">Error al cargar los vendedores: {errorMessage}</p>}

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Lista de Vendedores</h1>

        {loading && <p>Cargando Vendedores...</p>}
        {error && <p className="text-red-500">Error al cargar los vendedores: {errorMessage}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((vendedor) => {
           
            return (
              <div key={vendedor.ID} className="bg-white shadow-md rounded-lg p-6">
                <p className="text-black text-lg text-center mb-4">{vendedor.Nombre}</p>
                <div className="flex justify-center">
                  {/* Usamos el handleRedirect para generar el href dinámico */}
                  <Link
                    href={handleRedirect(vendedor.ID)}  // Usamos 'ID' en lugar de 'id'
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center transition duration-300 ease-in-out"
                  >
                    Ver Pedidos
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
