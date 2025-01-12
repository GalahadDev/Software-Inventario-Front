"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define el tipo de estado global
interface GlobalState {
  usuario: string | null;
  setUsuario: (usuario: string | null) => void;
}

// Crea el contexto con un valor predeterminado (debe coincidir con el tipo de estado)
const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

// Componente proveedor del contexto
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<string | null>(null);

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
