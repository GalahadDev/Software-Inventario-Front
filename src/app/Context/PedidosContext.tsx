"use client";
import React, { 
  createContext, 
  useContext, 
  useState, 
  ReactNode, 
  useEffect, 
  useCallback, 
  useMemo 
} from 'react';
import { Pedido } from '../types';
import { useFetchData } from '../functions/axiosFunctionGet';
import { useWebSocket } from './WebSocketContext'; // Importación añadida

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
  const { newOrder } = useWebSocket(); 

  const { data, error: apiError, loading: apiLoading } = useFetchData<Pedido[]>("/pedidos");

 
  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      try {
        if (!apiLoading && isMounted) {
          if (apiError) {
            setError(apiError);
          } else if (data) {
            setPedidos(data);
          }
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setError('Error inicializando datos de pedidos');
          setLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, [apiLoading, apiError, data]);

  // 2. Efecto para nuevos pedidos via WebSocket
  useEffect(() => {
    if (newOrder) {
      // Verificar si el pedido ya existe
      const pedidoExistente = pedidos.some(p => p.ID === newOrder.id);
      
      if (!pedidoExistente) {
        setPedidos(prev => [newOrder, ...prev]); // Agrega al inicio
      }
    }
  }, [newOrder]); // Solo se ejecuta cuando newOrder cambia

  // 3. Funciones memoizadas
  const addPedido = useCallback((nuevoPedido: Pedido) => {
    setPedidos(prev => [nuevoPedido, ...prev]); // Agrega al inicio
  }, []);

  const setPedidosList = useCallback((newPedidos: Pedido[]) => {
    setPedidos(newPedidos);
  }, []);

  // 4. Valor del contexto memoizado
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