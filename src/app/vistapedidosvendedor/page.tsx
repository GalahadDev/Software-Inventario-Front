"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { SearchDate } from "../ReusableComponents/SearchDate";
import { Header } from "app/ReusableComponents/Header";
import { SearchBar } from "app/ReusableComponents/SearchBar";
import { Pedido } from "app/types";
import { DollarSign, CreditCard, Truck, Package, MapPin, ClipboardList } from "lucide-react";

const VistaPedidosVendedor = () => {
  console.log("🔄 Componente renderizado");

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [vendedorId, setVendedorId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  console.log("🌐 baseUrl:", baseUrl);

  // Obtener el usuario_id y token al cargar el componente
  useEffect(() => {
    try {
      // Primero intentamos obtener desde localStorage
      let storedData = localStorage.getItem("userData") || sessionStorage.getItem("userData");
      let storedToken = localStorage.getItem("authToken") || sessionStorage.getItem("token");

      console.log("🗂️ Datos en localStorage/sessionStorage:", storedData);
      console.log("🔑 Token obtenido:", storedToken);

      if (storedData) {
        const userData = JSON.parse(storedData);
        if (userData.usuario_id) {
          setVendedorId(userData.usuario_id);
          console.log("✅ vendedorId asignado:", userData.usuario_id);
        } else {
          console.error("⚠️ El campo usuario_id es null o undefined.");
          setError("No se encontró el ID del vendedor.");
        }
      } else {
        console.error("⚠️ No se encontraron datos de usuario en localStorage.");
        setError("No se encontraron datos de usuario.");
      }

      if (storedToken) {
        setToken(storedToken);
      } else {
        console.error("⚠️ No se encontró el token en localStorage.");
        setError("No se encontró el token de autenticación.");
      }
    } catch (error) {
      console.error("❌ Error al obtener datos del usuario:", error);
      setError("Error al obtener los datos del usuario.");
    }
  }, []);

  // Función para obtener los pedidos
  const fetchPedidos = async () => {
    if (!vendedorId || !token) {
      console.warn("⏳ Esperando vendedorId y token...");
      return;
    }

    setLoading(true);
    try {
      console.log("📡 Solicitando pedidos...");
      const response = await axios.get(`${baseUrl}/usuarios/${vendedorId}/pedidos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Respuesta de la API:", response.data);
      setPedidos(response.data);
    } catch (error) {
      console.error("❌ Error en fetchPedidos:", error);
      setError("Error al cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar fetchPedidos solo cuando vendedorId y token sean válidos
  useEffect(() => {
    if (vendedorId && token) {
      fetchPedidos();
    }
  }, [vendedorId, token]);

  // Filtrar pedidos por búsqueda y rango de fecha
  const filteredPedidos = useMemo(() => {
    return pedidos.filter((pedido) => {
      const fechaCreacion = new Date(pedido.FechaCreacion);
      if (isNaN(fechaCreacion.getTime())) return false;

      const isInRange =
        (!startDate || fechaCreacion >= startDate) &&
        (!endDate || fechaCreacion <= endDate);

      const matchesSearch = searchTerm
        ? Object.values(pedido).some((value) =>
            value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;

      return isInRange && matchesSearch;
    });
  }, [pedidos, startDate, endDate, searchTerm]);

  if (loading) return <div className="text-center">Cargando pedidos...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case "Pendiente":
        return "bg-yellow-300";
      case "Entregado":
        return "bg-green-300";
      case "Cancelado":
        return "bg-red-300";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
    <header className="w-full fixed top-0 left-0 bg-white shadow-lg z-10">
      <Header navigation={[{ name: "Hacer Pedido", href: "/dashvendedor" }]} />
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
        <SearchBar onSearch={setSearchTerm} placeholder="Buscar..." />
        <button
          onClick={fetchPedidos}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Recargar Página
        </button>
      </div>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPedidos.map((pedido) => {
          const fecha = new Date(pedido.FechaCreacion).toLocaleDateString("es-ES");
          console.log(pedido)
          return (
            <div key={pedido.ID} className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Imagen y estado */}
            <div className="relative">
              <img
                src={pedido.Imagen || "https://images.1sticket.com/landing_page_20191025154518_107273.png"}
                alt={`Pedido de ${pedido.Nombre}`}
                className="w-full h-48 object-cover"
              />
              <div
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusBackgroundColor(pedido.Estado)}`}
              >
                {pedido.Estado || "Sin estado"}
              </div>
            </div>

            {/* Contenido de la tarjeta */}
            <div className="p-6">
              {/* Nombre y ID */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {pedido.Nombre} <span className="text-sm text-gray-500">(ID: {pedido.ID})</span>
                </h2>
                <span className="flex items-center text-green-600 font-semibold">
                  <DollarSign className="w-5 h-5 mr-1" />
                  {isNaN(pedido.Precio) ? "0.00" : pedido.Precio.toFixed(2)}
                </span>
              </div>

              {/* Detalles del pedido */}
              <div className="space-y-3">
                {/* Descripción */}
                <div className="flex items-start">
                  <Package className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-600">{pedido.Descripcion}</p>
                </div>

                {/* Dirección */}
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">{pedido.Direccion}</p>
                </div>

                {/* Forma de pago */}
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">{pedido.Forma_Pago}</p>
                </div>

                {/* Observaciones */}
                {pedido.Observaciones && (
                  <div className="flex items-start">
                    <ClipboardList className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0 mt-1" />
                    <p className="text-gray-600">{pedido.Observaciones}</p>
                  </div>
                )}

                {/* Fletero y comisión */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-gray-600">{pedido.Fletero || "Sin Asignar"}</span>
                  </div>
                  <span className="text-sm text-gray-500">Comisión: ${pedido.Monto || "0"}</span>
                </div>

                {/* Fecha */}
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                  <p className="text-gray-600">{fecha}</p>
                </div>

                {/* Estado y pagado */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center">
                   
                  </div>
                  <span className="text-sm text-gray-600">Pagado: {pedido.Pagado}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </main>
</div>
  );
};

export default VistaPedidosVendedor;
