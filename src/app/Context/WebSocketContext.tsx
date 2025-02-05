"use client";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { useGlobalState } from "./contextUser";
import { toast } from 'react-toastify';

interface WebSocketContextType {
  isConnected: boolean;
  isConnecting: boolean;
  sendMessage: (message: string | object) => void;
  messages: any[];
  newOrder: any | null;
}

const WebSocketContext = createContext<WebSocketContextType>({} as WebSocketContextType);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const { usuario } = useGlobalState();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [newOrder, setNewOrder] = useState<any | null>(null);
  const ws = useRef<WebSocket | null>(null);
  
  const token = usuario?.token || null;

  // Efecto para notificaciones
  useEffect(() => {
    if (newOrder) {
      toast.info("¡Nuevo pedido recibido!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setNewOrder(null); // Limpiar después de mostrar
    }
  }, [newOrder]);

  const sendMessage = (message: string | object) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    const msg = typeof message === "string" ? message : JSON.stringify(message);
    ws.current.send(msg);
  };

  const connectWebSocket = () => {
    if (!token) return;

    const url = `wss://app-831822364980.southamerica-east1.run.app/ws?token=${token}`;
    setIsConnecting(true);
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setIsConnected(true);
      setIsConnecting(false);
      console.log("WebSocket Conectado ✅");
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Mensaje RAW:", event.data); // Debug
        
        setMessages(prev => [...prev, message]);
        
        if (message.tipo === "NUEVO_PEDIDO" && message.pedido) {
          console.log("Nuevo pedido estructurado:", message.pedido);
          setNewOrder(message.pedido);
        }
      } catch (error) {
        console.error("Error al parsear mensaje:", error);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      setIsConnecting(false);
      console.log("WebSocket Cerrado 🔴");
      setTimeout(() => connectWebSocket(), 5000);
    };

    ws.current.onerror = (error) => {
      setIsConnected(false);
      setIsConnecting(false);
      console.error("WebSocket Error:", error);
    };
  };

  useEffect(() => {
    connectWebSocket();
    return () => ws.current?.close();
  }, [token]);

  return (
    <WebSocketContext.Provider value={{ 
      isConnected, 
      isConnecting, 
      sendMessage, 
      messages,
      newOrder 
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);