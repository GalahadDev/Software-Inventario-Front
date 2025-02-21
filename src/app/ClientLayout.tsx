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
    <PedidosProvider> {/* Ahora PedidosProvider envuelve a WebSocketProvider */}
      <WebSocketProvider> {/* WebSocketProvider ahora tiene acceso a PedidosContext */}
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
      </WebSocketProvider>
    </PedidosProvider>
  </GlobalStateProvider>
  );
}