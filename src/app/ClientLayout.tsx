"use client";

import { GlobalStateProvider } from "./Context/contextUser";
import { PedidosProvider } from "./Context/PedidosContext";
import { WebSocketProvider } from "./Context/WebSocketContext";
import { ToastContainer } from "react-toastify";
import { Footer } from "./ReusableComponents/Footer";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GlobalStateProvider> {/* Proveedor PRINCIPAL (debe estar primero) */}
      <WebSocketProvider> {/* Ahora WebSocketProvider accederá al contexto GlobalState */}
        <PedidosProvider> 
          {children}
          <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
          <Footer />
        </PedidosProvider>
      </WebSocketProvider>
    </GlobalStateProvider>
  );
}