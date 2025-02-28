import { useEffect, useRef, useState, useCallback } from "react";
import { usePedidosContext } from "../Context/PedidosContext";
import { toast } from "react-toastify";

interface WebSocketConfig {
  token: string | null;
}

export const useWebSocket = ({ token }: WebSocketConfig) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const { addPedido } = usePedidosContext();

  const sendMessage = useCallback((message: string | object) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.error("WebSocket no está conectado");
      return;
    }
    const msg = typeof message === "string" ? message : JSON.stringify(message);
    ws.current.send(msg);
  }, []);

  useEffect(() => {
    if (!token) {
      console.error("Token no proporcionado");
      return;
    }

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
        if (message.tipo === "nuevo_pedido") {
          addPedido(message.pedido);

          // Reproducir sonido de notificación
          const audio = new Audio("https://wduloqcugbdlwmladawq.supabase.co/storage/v1/object/public/imagenes-pedidos/src/lineage_2_quest.mp3");
          audio.play().catch((error) => console.error("Error al reproducir sonido:", error));

          // Mostrar notificación
          toast.info("¡Nuevo Pedido recibido! 📦");
        }
      } catch (error) {
        console.error("Error al parsear mensaje:", error);
      }
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      setIsConnecting(false);
      console.log("Conexión Cerrada 🔴");
    };

    ws.current.onerror = (error) => {
      setIsConnected(false);
      setIsConnecting(false);
      console.error("Error en WebSocket:", error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [token, addPedido]);

  return { isConnected, isConnecting, sendMessage };
};
