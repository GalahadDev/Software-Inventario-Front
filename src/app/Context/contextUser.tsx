"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';


interface GlobalUser {
  mensaje: string;
  nombre: string;
  rol: string;
  token: string;
  usuario_id: string;
}


interface GlobalState {
  usuario: GlobalUser | null;
  setUsuario: (usuario: GlobalUser | null) => void;
}

// Crea el contexto con un valor predeterminado (debe coincidir con el tipo de estado)
const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

// Componente proveedor del contexto
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 
  const [usuario, setUsuario] = useState<GlobalUser | null>(null);

  return (
    <GlobalStateContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useGlobalState = (): GlobalState => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};
