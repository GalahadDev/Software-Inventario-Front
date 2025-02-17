"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from "react";
import { Pedido } from "../types";
import { useWebSocket } from "./WebSocketContext";
import { toast } from "react-toastify";
import { useGlobalState } from "../Context/contextUser";
import { useFetchData } from "../functions/axiosFunctionGet";

interface PedidosContextType {
  pedidos: Pedido[];
  addPedido: (nuevoPedido: Pedido) => void;
  setPedidosList: (pedidos: Pedido[]) => void;
  updatePedido: (pedidoActualizado: Pedido) => void;
  loading: boolean;
  error: string | null;
}

const PedidosContext = createContext<PedidosContextType | undefined>(undefined);

export const usePedidosContext = (): PedidosContextType => {
  const context = useContext(PedidosContext);
  if (!context) {
    throw new Error("usePedidosContext debe ser usado dentro de un PedidosProvider");
  }
  return context;
};

interface PedidosProviderProps {
  children: ReactNode;
}

export const PedidosProvider: React.FC<PedidosProviderProps> = ({ children }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { messages } = useWebSocket();
  const { usuario } = useGlobalState();

  // Usar useFetchData para cargar los pedidos
  const { data, error: fetchError, loading: fetchLoading, refetch } = useFetchData<Pedido[]>("/pedidos");

  // Actualizar el estado de los pedidos cuando los datos se carguen
  useEffect(() => {
    if (data) {
      setPedidosList(data);
    }
  }, [data]);

  // Manejar errores de la carga de pedidos
  useEffect(() => {
    if (fetchError) {
      setError(fetchError);
    }
  }, [fetchError]);

  // Actualizar el estado de carga
  useEffect(() => {
    setLoading(fetchLoading);
  }, [fetchLoading]);

  // Manejar nuevos pedidos desde WebSockets
  useEffect(() => {
    if (Array.isArray(messages) && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.tipo === "NUEVO_PEDIDO" && lastMessage.pedido) {
        setPedidos((prevPedidos) => {
          const pedidoExistente = prevPedidos.some((p) => p.ID === lastMessage.pedido.ID);
          if (!pedidoExistente) {
            return [lastMessage.pedido, ...prevPedidos];
          }
          return prevPedidos;
        });

        // Notificación
        toast.info(`Nuevo pedido recibido!`, {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  }, [messages]);

  // Función para actualizar el estado de pedidos
  const setPedidosList = useCallback((newPedidos: Pedido[]) => {
    setPedidos([...newPedidos]);
    setLoading(false);
  }, []);

  // Función para agregar un nuevo pedido
  const addPedido = useCallback((nuevoPedido: Pedido) => {
    setPedidos((prev) => [nuevoPedido, ...prev]);
  }, []);

  // Función para actualizar un pedido existente
  const updatePedido = useCallback((pedidoActualizado: Pedido) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) =>
        pedido.ID === pedidoActualizado.ID ? pedidoActualizado : pedido
      )
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      pedidos,
      addPedido,
      setPedidosList,
      updatePedido,
      loading,
      error,
    }),
    [pedidos, addPedido, setPedidosList, updatePedido, loading, error]
  );

  return <PedidosContext.Provider value={contextValue}>{children}</PedidosContext.Provider>;
};