"use client"
import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useFetchData } from '../../functions/axiosFunctionGet';
import { Modal } from "../../ReusableComponents/Modal";
import { useUpdateData } from 'app/functions/functionPut';
import { Pedido } from "app/types";
import { DollarSign, CreditCard, Truck, Package, MapPin, ClipboardList } from "lucide-react";
import { SearchDate } from "../../ReusableComponents/SearchDate";
import { Header } from "../../ReusableComponents/Header";
import { ModalTotalMonto } from "app/ReusableComponents/ModalTotalMonto";
import { PageProps } from '../../types';

const PedidosPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
 const [startDate, setStartDate] = useState<Date | null>(null);
const [endDate, setEndDate] = useState<Date | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [totalMonto, setTotalMonto] = useState(0);
  const { updateData, loading: updateLoading } = useUpdateData();

  const params = useParams<{ id: string }>();
  const vendedorId = params?.id

  const navigation = [
    { name: 'Ver Vendedores', href: '/listaVendedores' },
    { name: 'Ver Pedidos', href: '/pedidosGenerales' },
    { name: 'Crear Vendedor', href: '/crearVendedor' },
    { name: "Crear Pedido", href: "/vendedorAdm" },
    {name: "Usuarios", href: "/listaUsuarios"}, 
  ];

  const { data, error, loading } = useFetchData<Pedido[]>(`/usuarios/${vendedorId}/pedidos`);

  const calcularTotalMonto = () => {
    const total = filteredPedidos
      .filter((pedido) => pedido.Estado === "Entregado") // Filtra solo los pedidos con estado "Entregado"
      .reduce((sum, pedido) => sum + (pedido.Monto ?? 0), 0); // Suma los montos de los pedidos filtrados
    
    setTotalMonto(total);
    setIsModalOpen(true); // Abre el modal
  };

  const filteredPedidos = useMemo(() => {
    if (!data) return [];
    
    return data.filter((pedido) => {
      const fechaCreacion = new Date(pedido.FechaCreacion);
      if (isNaN(fechaCreacion.getTime())) return false;
      
      const isInRange =
      (!startDate || (startDate instanceof Date && fechaCreacion >= startDate)) &&
      (!endDate || (endDate instanceof Date && fechaCreacion <= endDate));
      return isInRange;
    });
  }, [data, startDate, endDate]);
  
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-4">
      Error al cargar los pedidos: {error}
    </div>
  );

  if (!data || data.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        No se encontraron pedidos.
      </div>
    );
  }

  const handleCardClick = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setShowModal(true);
    console.log(pedido)
  };

  const cleanUrl = (url: string): string => {

  const baseUrl = url.split('?')[0];  
  return baseUrl;
};


const handleSendToWhatsApp = (pedido: Pedido) => {
 
  const imagenLimpia = pedido.Imagen ? cleanUrl(pedido.Imagen) : "Sin imagen disponible";

  
  const mensaje = `Pedido: ${pedido.Nombre}\nDescripción: ${pedido.Descripcion}\nObservaciones: ${pedido.Observaciones}\nImagen: ${imagenLimpia}`;
  
  const mensajeCodificado = encodeURIComponent(mensaje);


  const grupoWhatsApp = "https://chat.whatsapp.com/Dxiz1ImYMJaCg9ibEN58ay";

  // Abrir WhatsApp con el mensaje predefinido
  window.open(`https://api.whatsapp.com/send?text=${mensajeCodificado}&link=${grupoWhatsApp}`, "_blank");
};


  const updateMonto = async (id: number, monto: number, fletero: string, estado:string) => {
    try {
      // Llama a la función updateData con el endpoint y los datos necesarios
      await updateData(`/pedidos/${id}`, {
        monto: monto,
        fletero: fletero,
        estado: estado,
        atendido: true,
      });
      setShowModal(false); 
    } catch (error) {
      console.error("Error al actualizar el monto:", error);
    }
  };

  const getStatusColor = (estado: string | undefined): string => {
    console.log("Estado recibido:", estado); // Depuración: Verifica el valor de `estado`
  
    if (!estado) {
      console.log("Estado indefinido o vacío, aplicando clase por defecto.");
      return "bg-gray-100 text-gray-800"; // Clase por defecto
    }
  
    // Definir las clases para cada estado
    const statusColors: Record<string, string> = {
      Pendiente: "bg-yellow-400 text-white",
      Entregado: "bg-green-700 text-white",
      Cancelado: "bg-red-700 text-white",
    };
  
    // Devuelve la clase correspondiente, o la clase por defecto si no se encuentra el estado
    return statusColors[estado] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
    <header className="w-full fixed top-0 left-0 bg-white shadow-lg z-10">
      <Header navigation={navigation} />
    </header>
  
    
    <main className="flex-grow mt-[80px] px-4 py-8 container mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Pedidos</h1>
  
      <div className="mb-8">
        <SearchDate
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
         <div>
      {/* Tu código existente aquí */}

      {/* Botón para calcular y mostrar el total */}
      <div className="mt-6">
        <button
          onClick={calcularTotalMonto}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Calcular Total de Montos
        </button>
      </div>

      {/* Modal para mostrar el total */}
      {isModalOpen && (
        <ModalTotalMonto
          totalMonto={totalMonto}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-blue">
        {filteredPedidos.map((pedido) => (
          <div
            key={pedido.ID}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
            onClick={() => handleCardClick(pedido)}
          >
            <div className="relative">
              <img
                src={pedido.Imagen || "https://images.unsplash.com/photo-1612630741022-b29ec17d013d?auto=format&fit=crop&q=80&w=400"}
                alt={`Pedido de ${pedido.Nombre}`}
                className="w-full h-48 object-cover"
              />
              <div
  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
    pedido.Estado
  )}`}
>
  {pedido.Estado || "Sin estado"}
</div>
            </div>
  
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{pedido.Nombre}</h2>
                <span className="flex items-center text-green-600 font-semibold">
                  <DollarSign className="w-5 h-5 mr-1" />
                  {isNaN(pedido.Precio) ? "0.00" : pedido.Precio.toFixed(2)}
                </span>
              </div>
  
              <div className="space-y-3">
                <div className="flex items-start">
                  <Package className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">{pedido.Descripcion}</p>
                </div>
  
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">{pedido.Direccion}</p>
                </div>
  
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">{pedido.Forma_Pago}</p>
                </div>
  
                {pedido.Observaciones && (
                  <div className="flex items-start">
                    <ClipboardList className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-600">{pedido.Observaciones}</p>
                  </div>
                )}
  
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-gray-600">{pedido.Fletero || "Sin Asignar"}</span>
                  </div>
                  <span className="text-sm text-gray-500">Comisión: ${pedido.Monto || "0"}</span>
                </div>
  
                <div className="mt-4">
                  <button
                    onClick={() => handleSendToWhatsApp(pedido)}
                    className="flex items-center justify-center w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                  >
                    Enviar a WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
  
      {showModal && selectedPedido && (
        <Modal
          pedido={selectedPedido}
          onClose={() => setShowModal(false)}
          onSave={updateMonto}
          loading={updateLoading}
        />
      )}
    </main>
  
   
  </div>
  
  );
};

export default PedidosPage;