"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useRef, useEffect } from "react";
import { Pedido } from "../types";
import { useWebSocket } from "./WebSocketContext";
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(true); // Inicialmente en true para indicar carga
  const [error, setError] = useState<string | null>(null);
  const { messages } = useWebSocket();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  // Inicializar sonido
  useEffect(() => {
    audioRef.current = new Audio("https://wduloqcugbdlwmladawq.supabase.co/storage/v1/object/public/imagenes-pedidos/src/lineage_2_quest.mp3");
    audioRef.current.preload = "auto";

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Detectar interacción del usuario
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      document.removeEventListener("click", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    return () => document.removeEventListener("click", handleUserInteraction);
  }, []);

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

        // Reproducir sonido si el usuario interactuó
        if (userInteracted && audioRef.current) {
          audioRef.current.play().catch((error) => console.error("Error al reproducir el sonido:", error));
        }

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
  }, [messages, userInteracted]);

  // Función para actualizar el estado de pedidos
  const setPedidosList = useCallback((newPedidos: Pedido[]) => {
    setPedidos([...newPedidos]);
    setLoading(false); // Indicar que la carga ha terminado
  }, []);

  // Función para agregar un nuevo pedido
  const addPedido = useCallback((nuevoPedido: Pedido) => {
    setPedidos((prev) => [nuevoPedido, ...prev]);
  }, []);

  // Función para actualizar un pedido existente
  const updatePedido = useCallback((pedidoActualizado: Pedido) => {
    setPedidos((prevPedidos) => prevPedidos.map((pedido) => (pedido.ID === pedidoActualizado.ID ? pedidoActualizado : pedido)));
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