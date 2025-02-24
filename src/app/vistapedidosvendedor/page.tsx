"use client";

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { SearchDate } from "../ReusableComponents/SearchDate";
import { Header } from "app/ReusableComponents/Header";
import { SearchBar } from "app/ReusableComponents/SearchBar";
import { Pedido } from "app/types";
import { DollarSign, CreditCard, Truck, Package, MapPin, ClipboardList } from "lucide-react";
import { toChileDate } from "app/functions/dateUtils";

const VistaPedidosVendedor = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [vendedorId, setVendedorId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [totalMonto, setTotalMonto] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    try {
      let storedData = localStorage.getItem("userData") || sessionStorage.getItem("userData");
      let storedToken = localStorage.getItem("authToken") || sessionStorage.getItem("token");

      if (storedData) {
        const userData = JSON.parse(storedData);
        if (userData.usuario_id) {
          setVendedorId(userData.usuario_id);
        } else {
          setError("No se encontró el ID del vendedor.");
        }
      }

      if (storedToken) {
        setToken(storedToken);
      } else {
        setError("No se encontró el token de autenticación.");
      }
    } catch (error) {
      setError("Error al obtener los datos del usuario.");
    }
  }, []);

  const fetchPedidos = async () => {
    if (!vendedorId || !token) return;

    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/usuarios/${vendedorId}/pedidos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPedidos(response.data);
    } catch (error) {
      setError("Error al cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendedorId && token) fetchPedidos();
  }, [vendedorId, token]);

  const filteredPedidos = useMemo(() => {
    if (!pedidos) return [];

    const sortedPedidos = [...pedidos].sort((a, b) =>
      toChileDate(new Date(b.FechaCreacion)).getTime() - toChileDate(new Date(a.FechaCreacion)).getTime()
    );

    return sortedPedidos.filter((pedido) => {
      const fechaCreacionChile = toChileDate(new Date(pedido.FechaCreacion));
      if (isNaN(fechaCreacionChile.getTime())) return false;

      // Convertir startDate y endDate a horario de Chile (si existen)
      const fechaInicioChile = startDate ? toChileDate(startDate) : null;
      const fechaTerminoChile = endDate ? toChileDate(endDate) : null;

      const isInRange = fechaInicioChile && fechaTerminoChile
        ? (fechaCreacionChile >= fechaInicioChile && fechaCreacionChile <= fechaTerminoChile)
        : true;

      const matchesSearch = searchTerm
        ? Object.values(pedido)
            .some(value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        : true;

      return isInRange && matchesSearch;
    });
  }, [pedidos, startDate, endDate, searchTerm]);

  const calcularComision = () => {
    if (!startDate || !endDate) {
      setErrorMessage("DEBE INGRESAR FECHA DE INICIO Y FECHA DE TERMINO");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    const total = filteredPedidos
      .filter((pedido) => {
        const pedidoFecha = new Date(pedido.FechaCreacion);
        return (
          pedidoFecha >= startDate &&
          pedidoFecha <= endDate &&
          pedido.Estado === "Entregado"
        );
      })
      .reduce((sum, pedido) => {
        // Convertir a número y manejar valores nulos/undefined
        const comision = typeof pedido.Comision_Sugerida === 'string' 
          ? parseFloat(pedido.Comision_Sugerida) 
          : Number(pedido.Comision_Sugerida) || 0;

        return sum + comision;
      }, 0);

    setTotalMonto(total);
    setIsModalOpen(true);
    setErrorMessage("");
  };

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

  if (loading) return <div className="text-center">Cargando pedidos...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

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
          <div className="mt-4 flex gap-4">
            <button
              onClick={fetchPedidos}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Recargar Página
            </button>
            <button
              onClick={calcularComision}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Calcular Comisión
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="fixed top-20 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPedidos.map((pedido) => {
            const fecha = new Date(pedido.FechaCreacion).toLocaleDateString("es-ES");
            return (
              <div key={pedido.ID} className="bg-white shadow-md rounded-lg overflow-hidden">
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

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {pedido.Nombre} <span className="text-sm text-gray-500">(ID: {pedido.ID})</span>
                    </h2>
                    <span className="flex items-center text-green-600 font-semibold">
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
                      <p className="text-gray-600">Dirección: {pedido.Direccion}</p>
                    </div>

                    {/* Forma de pago */}
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                      <p className="text-gray-600">Forma de pago: {pedido.Forma_Pago}</p>
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
                        <span className="text-sm text-gray-500">Comisión (Vendedor): ${pedido.Comision_Sugerida || "0"}</span>
                      </div>
                    </div>

                    {/* Estado de pago */}
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                      <p className="text-gray-600">Estado de pago: {pedido.Pagado ? "Pagado" : "Pendiente"}</p>
                    </div>

                    {/* Fecha */}
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                      <p className="text-gray-600">{fecha}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Comisión Total Calculada</h3>
            <p className="text-3xl font-bold text-green-600 text-center">
              ${totalMonto.toFixed(2)}
            </p>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Rango de fechas: {startDate?.toLocaleDateString()} - {endDate?.toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Pedidos entregados:{" "}
                {filteredPedidos.filter(pedido => pedido.Estado === "Entregado").length}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VistaPedidosVendedor;