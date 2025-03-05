"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Modal } from "../ReusableComponents/Modal";
import { useUpdateData } from "app/functions/functionPut";
import { Pedido } from "app/types";
import { DollarSign, CreditCard, Truck, Package, MapPin, ClipboardList, Droplet, User, Calendar, Phone } from "lucide-react";
import { SearchDate } from "../ReusableComponents/SearchDate";
import { Header } from "../ReusableComponents/Header";
import { ComisionModal } from "app/ReusableComponents/ModalTotalMonto";
import { usePedidosContext } from "../Context/PedidosContext";
import { useWebSocket } from "../Context/WebSocketContext";
import { SearchBar } from "../ReusableComponents/SearchBar";
import { usePedidoActions } from "../functions/useUpdateData";
import { PedidosPagados } from "../ReusableComponents/PedidosPagados";
import { toChileDate } from "app/functions/dateUtils";
import { handleSendToWhatsAppFletero } from "app/functions/hadleWhatsAppFletero";

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
  const [showPagados, setShowPagados] = useState(false);
  const [totalComisionSugerida, setTotalComisionSugerida] = useState(0);

  useEffect(() => {
    if (newOrder) {
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

  const handleCalculateTotal = () => {
    if (!startDate || !endDate) {
      setErrorMessage("DEBE INGRESAR FECHA DE INICIO Y FECHA DE TERMINO");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    const pedidosFiltrados = pedidosNoPagados.filter((pedido) => {
      const pedidoFecha = new Date(pedido.FechaCreacion);
      return pedido.Estado === "Entregado" && pedidoFecha >= startOfDay && pedidoFecha <= endOfDay;
    });

    let totalComision = 0;
    let totalComisionSugerida = 0;

    pedidosFiltrados.forEach((pedido) => {
      const comision =
        typeof pedido.Monto === "string"
          ? parseFloat(pedido.Monto)
          : Number(pedido.Monto) || 0;
      totalComision += comision;

      const comisionSugerida =
        typeof pedido.Comision_Sugerida === "string"
          ? parseFloat(pedido.Comision_Sugerida)
          : Number(pedido.Comision_Sugerida) || 0;
      totalComisionSugerida += comisionSugerida;
    });

    setTotalMonto(totalComision);
    setTotalComisionSugerida(totalComisionSugerida);
    setIsModalOpen(true);
  };

  const filteredPedidos = useMemo(() => {
    if (!pedidosNoPagados) return [];

    const sortedPedidos = [...pedidosNoPagados].sort((a, b) =>
      toChileDate(new Date(b.FechaCreacion)).getTime() - toChileDate(new Date(a.FechaCreacion)).getTime()
    );

    return sortedPedidos.filter((pedido) => {
      const fechaCreacionChile = toChileDate(new Date(pedido.FechaCreacion));
      if (isNaN(fechaCreacionChile.getTime())) return false;

      const fechaInicioChile = startDate ? toChileDate(new Date(startDate)) : null;
      const fechaTerminoChile = endDate ? toChileDate(new Date(endDate)) : null;

      const isInRange =
        (!fechaInicioChile || fechaCreacionChile >= fechaInicioChile) &&
        (!fechaTerminoChile || fechaCreacionChile <= fechaTerminoChile);

      const matchesSearch = searchTerm
        ? Object.values(pedido)
            .filter((value) => value !== null && value !== undefined)
            .some((value) =>
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
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
    const observaciones = pedido.Observaciones || "Sin observaciones";
    const tela = pedido.Tela || "Sin tipo de tela especificado";
    const color = pedido.Color || "Sin color especificado";
    const imagen = pedido.Imagen || "Sin imagen";

    const mensaje = `
      Nro de Pedido: ${pedido.ID}
      Descripción: ${pedido.Descripcion}
      Observaciones: ${observaciones}
      Tipo de Tela: ${tela}
      Color: ${color}
      Imagen: ${imagen}
      Grupo de WhatsApp: https://chat.whatsapp.com/Dxiz1ImYMJaCg9ibEN58ay
    `;

    const mensajeCodificado = encodeURIComponent(mensaje);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const url = isMobile
      ? `whatsapp://send?text=${mensajeCodificado}`
      : `https://api.whatsapp.com/send?text=${mensajeCodificado}`;

    window.open(url, "_blank");
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
      if (estado === "Entregado") {
        const pedidoActual = filteredPedidos.find((pedido) => pedido.ID === id);
        if (pedidoActual) {
          fletero = pedidoActual.Fletero;
        }
      }

      await updateData(`/pedidos/${id}`, { monto, fletero, estado, atendido: Atendido, pagado });
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
        {showPagados ? (
          <PedidosPagados
            pedidosPagados={pedidosPagados}
            onBackToNoPagados={() => setShowPagados(false)}
          />
        ) : (
          <>
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
              Pedidos No Pagados
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
                    onClick={handleCalculateTotal}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Calcular Total de Comision
                  </button>

                  <button
                    onClick={() => setShowPagados(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Ver Pedidos Pagados
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
                    pedidosFiltrados={filteredPedidos.length}
                    pedidosEntregados={filteredPedidos.filter(
                      (pedido) => pedido.Estado === "Entregado"
                    ).length}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 flex-grow overflow-y-auto">
              {filteredPedidos
              .sort((a, b) => b.ID - a.ID)
              .map((pedido) => {
                // Para evitar el desfase, se usa la opción timeZone: "UTC"
                const fechaCreacion = new Date(pedido.FechaCreacion).toLocaleDateString("es-ES", {
                  timeZone: "UTC"
                });
                const fechaEntrega = pedido.Fecha_Entrega && !isNaN(new Date(pedido.Fecha_Entrega).getTime())
                  ? new Date(pedido.Fecha_Entrega).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC"
                    })
                  : "No especificada";

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
                      flex flex-col
                      ${pedido.Atendido ? "bg-white" : "bg-yellow-200 animate-pulse-scale"}
                    `}
                    onClick={() => handleCardClick(pedido)}
                  >
                    <div className="relative">
                      <img
                        src={pedido.Imagen || "https://images.1sticket.com/landing_page_20191025154518_107273.png"}
                        alt={`Pedido de ${pedido.Nombre}`}
                        className="w-full h-48 object-cover"
                      />
                      <div
                        className={`
                          absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pedido.Estado)}
                        `}
                      >
                        {pedido.Estado || "Sin estado"}
                      </div>
                    </div>

                    <div className="flex-grow p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {pedido.Nombre} <span className="text-sm text-gray-500">(ID: {pedido.ID})</span>
                        </h2>
                        <span className="flex items-center text-green-600 font-semibold">
                          <DollarSign className="w-5 h-5 mr-1" />
                          {pedido.Precio}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                          <Package className="w-5 h-5 mr-2 text-gray-500" />
                          Producción
                        </h3>

                        <div className="flex items-start">
                          <Package className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                          <p className="text-gray-600">Producto: {pedido.Descripcion}</p>
                        </div>

                        {pedido.Tela && (
                          <div className="flex items-center">
                            <ClipboardList className="w-5 h-5 mr-3 text-gray-500" />
                            <p className="text-gray-600">Tipo de tela: {pedido.Tela}</p>
                          </div>
                        )}

                        {pedido.Color && (
                          <div className="flex items-center">
                            <Droplet className="w-5 h-5 mr-3 text-gray-500" />
                            <p className="text-gray-600">Color: {pedido.Color}</p>
                          </div>
                        )}

                        {pedido.Observaciones && (
                          <div className="flex items-start">
                            <ClipboardList className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                            <p className="text-gray-600">Observaciones: {pedido.Observaciones}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 mt-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                          <Truck className="w-5 h-5 mr-2 text-gray-500" />
                          Logística
                        </h3>

                        <div className="flex items-center">
                          <User className="w-5 h-5 mr-3 text-gray-500" />
                          <p className="text-gray-600">Despachador: {pedido.Fletero || "Sin Asignar"}</p>
                        </div>

                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                          <p className="text-gray-600">Dirección: {pedido.Direccion}</p>
                        </div>

                        <div className="flex items-center">
                          <Phone className="w-5 h-5 mr-3 text-gray-500" />
                          <p className="text-gray-600">Teléfono: {pedido.Nro_Tlf}</p>
                        </div>

                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                          <p className="text-gray-600">
                            Fecha de entrega: {fechaEntrega}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mt-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                          <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
                          Administrativa
                        </h3>

                        <div className="flex items-center">
                          <User className="w-5 h-5 mr-3 text-gray-500" />
                          <p className="text-gray-600">Vendedor: {pedido.Nombre_Vendedor}</p>
                        </div>

                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 mr-3 text-gray-500" />
                          <p className="text-gray-600">Comisión: ${pedido.Monto || "0"}</p>
                        </div>

                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 mr-3 text-gray-500" />
                          <p className="text-gray-600">Comisión (Vendedor): ${pedido.Comision_Sugerida || "0"}</p>
                        </div>

                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                          <p className="text-gray-600">Estado de pago: {pedido.Pagado}</p>
                        </div>
                         <div className="flex items-center">
                                                  <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                                                  <p className="text-gray-600">
                                                    Fecha Creacion: {fechaCreacion}
                                                  </p>
                                                </div>
                      </div>
                    </div>

                    <div className="flex flex-col mt-4 gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendToWhatsApp(pedido);
                        }}
                        className="flex items-center justify-center w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                      >
                        Enviar a Produccion
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendToWhatsAppFletero(pedido);
                        }}
                        className="flex items-center justify-center w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                      >
                        Enviar a Fletero
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
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
