"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Modal } from "../ReusableComponents/Modal";
import { useUpdateData } from "app/functions/functionPut";
import { Pedido } from "app/types";
import { DollarSign, CreditCard, Truck, Package, MapPin, ClipboardList } from "lucide-react";
import { SearchDate } from "../ReusableComponents/SearchDate";
import { Header } from "../ReusableComponents/Header";
import { ModalTotalMonto } from "app/ReusableComponents/ModalTotalMonto";
import { usePedidosContext } from "../Context/PedidosContext";
import { useWebSocket } from "../Context/WebSocketContext"; 
import { SearchBar } from "../ReusableComponents/SearchBar";
import { usePedidoActions } from "../functions/useUpdateData";

const PedidosPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalMonto, setTotalMonto] = useState(0);
  const { updateData, loading: updateLoading } = useUpdateData();
  const [searchTerm, setSearchTerm] = useState("");
  const { pedidos, addPedido, loading, error } = usePedidosContext();
  const { newOrder } = useWebSocket();
  const { markAsAttended } = usePedidoActions();
  const [localPedidos, setLocalPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    if (newOrder) {
      addPedido(newOrder);
    }
  }, [newOrder, addPedido]);

  useEffect(() => {
    if (pedidos) setLocalPedidos(pedidos);
  }, [pedidos]);

  const navigation = [
    { name: 'Ver Vendedores', href: '/listaVendedores' },
    { name: 'Ver Pedidos', href: '/pedidosGenerales' },
    { name: 'Crear Vendedor', href: '/crearVendedor' },
    { name: "Crear Pedido", href: "/vendedorAdm" },
    { name: "Usuarios", href: "/listaUsuarios" }, 
  ];

  const calcularTotalMonto = () => {
    const total = filteredPedidos
      .filter((pedido) => pedido.Estado === "Entregado")
      .reduce((sum, pedido) => sum + (pedido.Monto ?? 0), 0);
    
    setTotalMonto(total);
    setIsModalOpen(true);
  };

  const filteredPedidos = useMemo(() => {
    if (!localPedidos) return [];
  
    const sortedPedidos = [...localPedidos].sort((a, b) => 
      new Date(b.FechaCreacion).getTime() - new Date(a.FechaCreacion).getTime()
    );
  
    return sortedPedidos.filter((pedido) => {
      const fechaCreacion = new Date(pedido.FechaCreacion);
      if (isNaN(fechaCreacion.getTime())) return false;
  
      const isInRange =
        (!startDate || fechaCreacion >= startDate) &&
        (!endDate || fechaCreacion <= endDate);
  
      const matchesSearch = searchTerm
        ? Object.values(pedido)
            .some(value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
  
      return isInRange && matchesSearch;
    });
  }, [localPedidos, startDate, endDate, searchTerm]);

  const handleCardClick = async (pedido: Pedido) => {
    try {
    
      const updatedPedidos = localPedidos.map(p => 
        p.ID === pedido.ID ? { ...p, atendido: true } : p
      );
      setLocalPedidos(updatedPedidos);
console.log("Pedido actualizado:", pedido);
      await markAsAttended(pedido.ID);
      console.log("Pedido actualizado:", pedido);
      setSelectedPedido({ ...pedido, atendido: true });
      setShowModal(true);
    } catch (error) {
      // Revertir cambios si falla
      const originalPedidos = localPedidos.map(p => 
        p.ID === pedido.ID ? { ...p, atendido: false } : p
      );
      setLocalPedidos(originalPedidos);
      console.error("Error al actualizar:", error);
    }
  };

  const handleSendToWhatsApp = (pedido: Pedido) => {
    const mensaje = `Pedido: ${pedido.Nombre}\nDescripción: ${pedido.Descripcion}\nObservaciones: ${pedido.Observaciones}\nImagen: ${pedido.Imagen}`;
    const mensajeCodificado = encodeURIComponent(mensaje);
    const grupoWhatsApp = "https://chat.whatsapp.com/Dxiz1ImYMJaCg9ibEN58ay";
    window.open(`https://api.whatsapp.com/send?text=${mensajeCodificado}&link=${grupoWhatsApp}`, "_blank");
  };

  const updateMonto = async (id: number, monto: number, fletero: string, estado: string) => {
    try {
      await updateData(`/pedidos/${id}`, { monto, fletero, estado, atendido: true });
      setShowModal(false);
    } catch (error) {
      console.error("Error al actualizar el monto:", error);
    }
  };

  const getStatusColor = (estado: string | undefined): string => {
    const statusColors: Record<string, string> = {
      Pendiente: "bg-yellow-400 text-white",
      Entregado: "bg-green-700 text-white",
      Cancelado: "bg-red-700 text-white",
    };
    return statusColors[estado ?? ""] || "bg-gray-100 text-gray-800";
  };

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

  if (!localPedidos || localPedidos.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        No se encontraron pedidos.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full fixed top-0 left-0 bg-white shadow-lg z-10">
        <Header navigation={navigation} />
      </header>
    
      <main className="flex-grow mt-[80px] px-4 py-8 container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Todos Los Pedidos</h1>
    
        <div className="mb-8">
          <SearchDate
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <div>
            <div className="mt-6 mb-6">
              <button
                onClick={calcularTotalMonto}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Calcular Total de Montos
              </button>
            </div>

            <SearchBar onSearch={setSearchTerm} placeholder="Buscar..." />
    
            {isModalOpen && (
              <ModalTotalMonto
                totalMonto={totalMonto}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[80vh] pr-3">
          {filteredPedidos.map((pedido) => {
            const fecha = new Date(pedido.FechaCreacion).toLocaleDateString("es-ES");

            return (
              <div
                key={`${pedido.ID}-${pedido.Nombre}`}
                className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform origin-center ${
                  pedido.atendido 
                    ? 'bg-white' 
                    : 'bg-yellow-200 animate-pulse-scale'
                }`}
                onClick={() => handleCardClick(pedido)}
              >
                <div className="relative">
                  <img
                    src={pedido.Imagen || "https://images.1sticket.com/landing_page_20191025154518_107273.png"}
                    alt={`Pedido de ${pedido.Nombre}`}
                    className="w-full h-48 object-cover"
                  />
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pedido.Estado)}`}
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

                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                      <p className="text-gray-600">{fecha}</p>
                    </div>

                    <div className="mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendToWhatsApp(pedido);
                        }}
                        className="flex items-center justify-center w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                      >
                        Enviar a WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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