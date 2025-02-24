"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Modal } from "../ReusableComponents/Modal";
import { useUpdateData } from "app/functions/functionPut";
import { Pedido } from "app/types";
import { DollarSign, CreditCard, Truck, Package, MapPin, ClipboardList } from "lucide-react";
import { SearchDate } from "../ReusableComponents/SearchDate";
import { Header } from "../ReusableComponents/Header";
import { ComisionModal } from "app/ReusableComponents/ModalTotalMonto";
import { usePedidosContext } from "../Context/PedidosContext";
import { useWebSocket } from "../Context/WebSocketContext";
import { SearchBar } from "../ReusableComponents/SearchBar";
import { usePedidoActions } from "../functions/useUpdateData";
import { PedidosPagados } from "../ReusableComponents/PedidosPagados";

const PedidosPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalMonto, setTotalMonto] = useState(0);
  const { updateData, loading: updateLoading } = useUpdateData();
  const [searchTerm, setSearchTerm] = useState("");
  const { pedidos, setPedidosList, addPedido, loading, error } = usePedidosContext();
  const { newOrder } = useWebSocket();
  const { markAsAttended } = usePedidoActions();
  const [localPedidos, setLocalPedidos] = useState<Pedido[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const [pedidosNoPagados, setPedidosNoPagados] = useState<Pedido[]>([]);
  const [pedidosPagados, setPedidosPagados] = useState<Pedido[]>([]);
  const [showPagados, setShowPagados] = useState(false); // Estado para controlar la visibilidad
  const [totalComisionSugerida, setTotalComisionSugerida] = useState(0);

  useEffect(() => {
    if (newOrder) {
      // Verificar si el pedido ya existe antes de agregarlo
      if (!pedidos.some((pedido) => pedido.ID === newOrder.ID)) {
        setPedidosList([...pedidos, newOrder]);
      }
    }
  }, [newOrder, pedidos, setPedidosList]);




  useEffect(() => {
    if (pedidos) {
      setLocalPedidos(pedidos);
      const noPagados = pedidos.filter(pedido => pedido.Pagado === "No Pagado");
      setPedidosNoPagados(noPagados);
      const pagados = pedidos.filter(pedido => pedido.Pagado === "Pagado");
      setPedidosPagados(pagados);
    }
  }, [pedidos]);

  const navigation = [
    { name: "Ver Vendedores", href: "/listaVendedores" },
    { name: "Ver Pedidos", href: "/pedidosGenerales" },
    { name: "Crear Usuario", href: "/crearVendedor" },
    { name: "Crear Pedido", href: "/vendedorAdm" },
    { name: "Usuarios", href: "/listaUsuarios" },
    { name: "Galeria", href: "/galeria" }
  ];

  const calcularTotalMonto = () => {
    if (!startDate || !endDate) {
      setErrorMessage("DEBE INGRESAR FECHA DE INICIO Y FECHA DE TERMINO");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    let totalComision = 0;
    let totalComisionSugerida = 0;

    const pedidosFiltrados = filteredPedidos.filter((pedido) => {
      const pedidoFecha = new Date(pedido.FechaCreacion);
      return (
        pedidoFecha >= startDate &&
        pedidoFecha <= endDate &&
        pedido.Estado === "Entregado"
      );
    });

    pedidosFiltrados.forEach((pedido) => {
      // Sumar comisión normal
      const comision = typeof pedido.Monto === 'string'
        ? parseFloat(pedido.Monto)
        : Number(pedido.Monto) || 0;
      totalComision += comision;

      // Sumar comisión sugerida
      const comisionSugerida = typeof pedido.Comision_Sugerida === 'string'
        ? parseFloat(pedido.Comision_Sugerida)
        : Number(pedido.Comision_Sugerida) || 0;
      totalComisionSugerida += comisionSugerida;
    });

    setTotalMonto(totalComision);
    setTotalComisionSugerida(totalComisionSugerida); // Nuevo estado para la comisión sugerida
    setIsModalOpen(true);
    setErrorMessage("");
  };

  const filteredPedidos = useMemo(() => {
    if (!pedidosNoPagados) return [];

    const sortedPedidos = [...pedidosNoPagados].sort((a, b) =>
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
  }, [pedidosNoPagados, startDate, endDate, searchTerm]);

  const handleCardClick = async (pedido: Pedido) => {
    try {
      await markAsAttended(pedido.ID);

      const updatedPedidos = pedidos.map(p =>
        p.ID === pedido.ID ? { ...p, Atendido: true } : p
      );

      setPedidosList(updatedPedidos);
      setLocalPedidos(updatedPedidos);

      setSelectedPedido({ ...pedido, Atendido: true });
      setShowModal(true);
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const handleSendToWhatsApp = (pedido: Pedido) => {
    const mensaje = `\nDescripción: ${pedido.Descripcion}\nObservaciones: ${pedido.Observaciones}\nImagen: ${pedido.Imagen}`;
    const mensajeCodificado = encodeURIComponent(mensaje);
    const grupoWhatsApp = "https://chat.whatsapp.com/Dxiz1ImYMJaCg9ibEN58ay";
    window.open(`https://api.whatsapp.com/send?text=${mensajeCodificado}&link=${grupoWhatsApp}`, "_blank");
  };

  const updateMonto = async (
    id: number,
    monto: number,
    fletero: string,
    estado: string,
    Atendido: boolean,
    pagado: string
  ) => {
    try {
      // Verificar si el estado es "Entregado"
      if (estado === "Entregado") {
        // Si el estado es "Entregado", no permitimos modificar el fletero
        const pedidoActual = filteredPedidos.find((pedido) => pedido.ID === id);
        if (pedidoActual) {
          fletero = pedidoActual.Fletero; // Mantenemos el fletero original
        }
      }
  
      // Actualizar los datos del pedido
      await updateData(`/pedidos/${id}`, { monto, fletero, estado, atendido: Atendido, pagado });
  
      // Cerrar el modal después de la actualización
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full fixed top-0 left-0 bg-white shadow-lg z-10">
        <Header navigation={navigation} />
      </header>

      <main className="flex-grow mt-[80px] px-4 py-8 container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          {showPagados ? "Pedidos Pagados" : "Pedidos No Pagados"}
        </h1>

        <div className="mb-8">
          <SearchDate
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <div>
            <div className="mt-6 mb-6 flex gap-4">
              <button
                onClick={calcularTotalMonto}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Calcular Total de Comision
              </button>

              <button
                onClick={() => setShowPagados(!showPagados)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >

                {showPagados ? "Ver No Pagados" : "Ver Pagados"}
              </button>

            </div>
            <span className="text-red-700">{errorMessage}</span>

            <SearchBar onSearch={setSearchTerm} placeholder="Buscar..." />
            {isModalOpen && (
             <ComisionModal
             isOpen={isModalOpen}
             onClose={() => setIsModalOpen(false)}
             totalMonto={totalMonto}
             totalComisionSugerida={totalComisionSugerida}
             startDate={startDate}
             endDate={endDate}
             pedidosFiltrados={pedidosNoPagados.filter((pedido) => {
               const pedidoFecha = new Date(pedido.FechaCreacion);
               const fechaInicioObj = new Date(startDate!);
               const fechaTerminoObj = new Date(endDate!);
               return pedidoFecha >= fechaInicioObj && pedidoFecha <= fechaTerminoObj;
             }).length}
             pedidosEntregados={pedidosNoPagados.filter(
               (pedido) => pedido.Estado === "Entregado"
             ).length}
           />
            )}
          </div>
        </div>

        {/* Renderizar pedidos no pagados o pagados según el estado */}
        {showPagados ? (
          <PedidosPagados pedidosPagados={pedidosPagados} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[80vh] pr-3">
            {filteredPedidos.map((pedido) => {
              const fecha = new Date(pedido.FechaCreacion).toLocaleDateString("es-ES");

              return (
                <div
                  key={`${pedido.ID}-${pedido.Nombre}`}
                  className={`
                  rounded-xl 
                  shadow-lg 
                  hover:shadow-xl 
                  transition-all 
                  duration-300 
                  overflow-hidden 
                  cursor-pointer 
                  transform 
                  origin-center 
                  ${pedido.Atendido ? 'bg-white' : 'bg-yellow-200 animate-pulse-scale'}
                `}
                  onClick={() => handleCardClick(pedido)}
                >
                  <div className="relative">
                    <img
                      src={pedido.Imagen || "https://images.1sticket.com/landing_page_20191025154518_107273.png"}
                      alt={`Pedido de ${pedido.Nombre}`}
                      className="
                      w-full 
                      h-48 
                      object-cover
                    "
                    />
                    <div
                      className={`
                      absolute 
                      top-4 
                      right-4 
                      px-3 
                      py-1 
                      rounded-full 
                      text-sm 
                      font-medium 
                      ${getStatusColor(pedido.Estado)}
                    `}
                    >
                      {pedido.Estado || "Sin estado"}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="
                    flex 
                    items-center 
                    justify-between 
                    mb-4
                  ">
                      <h2 className="
                      text-xl 
                      font-semibold 
                      text-gray-800
                    ">
                        {pedido.Nombre} <span className="text-sm text-gray-500">(ID: {pedido.ID})</span>
                      </h2>
                      <span className="
                      flex 
                      items-center 
                      text-green-600 
                      font-semibold
                    ">
                        <DollarSign className="w-5 h-5 mr-1" />
                        {isNaN(pedido.Precio) ? "0.00" : pedido.Precio.toFixed(2)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Descripción */}
                      <div className="flex items-start">
                        <Package className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                        <p className="text-gray-600">Producto: {pedido.Descripcion}</p>
                      </div>

                      {/* Tela */}
                      {pedido.Tela && (
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                          <p className="text-gray-600">Tela: {pedido.Tela}</p>
                        </div>
                      )}

                      {/* Color */}
                      {pedido.Color && (
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                          <p className="text-gray-600">Color: {pedido.Color}</p>
                        </div>
                      )}

                      {/* Dirección */}
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                        <p className="text-gray-600">Direccion: {pedido.Direccion}</p>
                      </div>

                      {/* Forma de pago */}
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                        <p className="text-gray-600"> Forma De pago: {pedido.Forma_Pago}</p>
                      </div>

                      {/* Observaciones */}
                      {pedido.Observaciones && (
                        <div className="flex items-start">
                          <ClipboardList className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                          <p className="text-gray-600">Observaciones: {pedido.Observaciones}</p>
                        </div>
                      )}

                      {/* Fletero y comisiones */}
                      <div className="flex flex-col space-y-2 pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                          <Truck className="w-5 h-5 mr-2 text-gray-500" />
                          <span className="text-gray-600">Despacho: {pedido.Fletero || "Sin Asignar"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">Comisión: ${pedido.Monto || "0"}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">Comisión (Vendedor): ${pedido.Comision_Sugerida || "0"}</span>
                        </div>

                      </div>

                      {/* Estado de pago */}
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                        <p className="text-gray-600">Estado de Pago: {pedido.Pagado}</p>
                      </div>

                      {/* Fecha */}
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                        <p className="text-gray-600">{fecha}</p>
                      </div>


                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSendToWhatsApp(pedido);
                      }}
                      className="
                    flex 
                    items-center 
                    justify-center 
                    w-full 
                    bg-green-500 
                    text-white 
                    py-2 
                    px-4 
                    rounded-lg 
                    hover:bg-green-600 
                    transition
                  "
                    >
                      Enviar a WhatsApp
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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
