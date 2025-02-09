"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo, useRef } from 'react';
import { Pedido } from '../types';
import { useFetchData } from '../functions/axiosFunctionGet';
import { useWebSocket } from './WebSocketContext';
import { toast } from "react-toastify";

interface PedidosContextType {
  pedidos: Pedido[];
  addPedido: (nuevoPedido: Pedido) => void;
  setPedidosList: (pedidos: Pedido[]) => void;
  loading: boolean;
  error: string | null;
}

const PedidosContext = createContext<PedidosContextType | undefined>(undefined);

export const usePedidosContext = (): PedidosContextType => {
  const context = useContext(PedidosContext);
  if (!context) {
    throw new Error('usePedidosContext debe ser usado dentro de un PedidosProvider');
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  const { data, error: apiError, loading: apiLoading } = useFetchData<Pedido[]>("/pedidos");

  // Inicializar el objeto de audio
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

  // Cargar pedidos desde la API
  useEffect(() => {
    if (data) {
      console.log("📥 Actualizando pedidos desde la API:", data);
      setPedidos([...data]); // Forzar una nueva referencia en memoria
      setLoading(false);
    } else if (apiError) {
      console.error("❌ Error al obtener pedidos:", apiError);
      setError(apiError);
      setLoading(false);
    }
  }, [data, apiError]);
  // Manejar nuevos pedidos desde WebSockets
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.tipo === "NUEVO_PEDIDO" && lastMessage.pedido) {
        setPedidos(prevPedidos => {
          const pedidoExistente = prevPedidos.some(p => p.ID === lastMessage.pedido.ID);
          if (!pedidoExistente) {
            return [lastMessage.pedido, ...prevPedidos];
          }
          return prevPedidos;
        });

        // Reproducir el sonido si el usuario ha interactuado
        if (userInteracted && audioRef.current) {
          audioRef.current.play().catch(error => {
            console.error("Error al reproducir el sonido:", error);
          });
        }

        // Mostrar notificación con toast
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

  // Función para agregar un pedido
  const addPedido = useCallback((nuevoPedido: Pedido) => {
    setPedidos(prev => [nuevoPedido, ...prev]); 
  }, []);

  // Función para establecer la lista de pedidos
  const setPedidosList = useCallback((newPedidos: Pedido[]) => {
    setPedidos(() => [...newPedidos]); // Forzar nueva referencia en memoria
  }, []);

  // Memoizar el contexto
  const contextValue = useMemo(() => ({
    pedidos,
    addPedido,
    setPedidosList,
    loading: loading || apiLoading,
    error: error || apiError
  }), [pedidos, loading, error, apiLoading, apiError, addPedido, setPedidosList]);

  return (
    <PedidosContext.Provider value={contextValue}>
      {children}
    </PedidosContext.Provider>
  );
};
