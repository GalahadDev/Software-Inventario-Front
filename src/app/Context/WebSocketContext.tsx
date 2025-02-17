"use client";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { useGlobalState } from "./contextUser";
import { toast } from "react-toastify";
import { usePedidosContext } from "./PedidosContext";

interface WebSocketContextType {
  isConnected: boolean;
  isConnecting: boolean;
  sendMessage: (message: string | object) => void;
  messages: any[];
  newOrder: any | null;
  disconnectWebSocket: () => void;
}

const WebSocketContext = createContext<WebSocketContextType>({} as WebSocketContextType);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const { usuario } = useGlobalState();
  const { addPedido, updatePedido } = usePedidosContext();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newOrder, setNewOrder] = useState<any | null>(null);
  const ws = useRef<WebSocket | null>(null);

  const token = usuario?.token || null;
  const role = usuario?.rol || null;
  const shouldReconnect = useRef(true);

  useEffect(() => {
    if (newOrder) {
      const alarmSound = new Audio("https://wduloqcugbdlwmladawq.supabase.co/storage/v1/object/public/imagenes-pedidos/src/lineage_2_quest.mp3");
      alarmSound.play().catch((error) => {
        console.error("Error al reproducir el sonido de la alarma:", error);
      });

      toast.info("¡Nuevo pedido recibido!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setNewOrder(null);
    }
  }, [newOrder]);

  const sendMessage = (message: string | object) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    const msg = typeof message === "string" ? message : JSON.stringify(message);
    ws.current.send(msg);
  };

  const connectWebSocket = () => {
    if (!token || role !== "administrador") return;

    const baseUrl = process.env.NEXT_PUBLIC_WS_URL;
    const url = `${baseUrl}?token=${token}`;

    setIsConnecting(true);
    shouldReconnect.current = true;
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setIsConnected(true);
      setIsConnecting(false);
      console.log("WebSocket Conectado ✅");
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Mensaje recibido:", message);

        setMessages((prev) => [...prev, message]);

        if (message.tipo === "NUEVO_PEDIDO" && message.pedido) {
          setNewOrder(message.pedido);
          addPedido(message.pedido); // Agregar el pedido al estado global
        } else if (message.tipo === "PEDIDO_ACTUALIZADO" && message.pedido) {
          updatePedido(message.pedido); // Actualizar el pedido en el estado global
        }
      } catch (error) {
        console.error("Error al parsear mensaje:", error);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      setIsConnecting(false);
      console.log("WebSocket Cerrado 🔴");

      if (shouldReconnect.current) {
        setTimeout(() => connectWebSocket(), 5000);
      }
    };

    ws.current.onerror = (error) => {
      setIsConnected(false);
      setIsConnecting(false);
      console.error("WebSocket Error:", error);
    };
  };

  const disconnectWebSocket = () => {
    shouldReconnect.current = false;
    ws.current?.close();
    ws.current = null;
    setIsConnected(false);
    setMessages([]);
  };

  useEffect(() => {
    if (role === "administrador") {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }
    return () => disconnectWebSocket();
  }, [token, role]);

  return (
    <WebSocketContext.Provider value={{
      isConnected,
      isConnecting,
      sendMessage,
      messages,
      newOrder,
      disconnectWebSocket,
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);