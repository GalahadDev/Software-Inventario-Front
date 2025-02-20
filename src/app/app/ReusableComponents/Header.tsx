'use client';

import { Menu, X, ChevronDown, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useGlobalState } from '../Context/contextUser';
import { useRouter } from 'next/navigation';
import { useWebSocket } from "../Context/WebSocketContext";
import axios from 'axios';

type NavigationItem = {
  name: string;
  href: string;
};

export const Header: React.FC<{ navigation: NavigationItem[] }> = ({ navigation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { usuario, setUsuario } = useGlobalState();
  const router = useRouter();

  const { disconnectWebSocket } = useWebSocket();

  

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  
    // 🔹 Cerrar WebSocket antes de limpiar el usuario
    disconnectWebSocket();
  
    // 🔹 Asegurar que axios no siga usando el token viejo
    delete axios.defaults.headers.common["Authorization"];
  
    setUsuario(null);
    router.push("/login");

    setTimeout(()=>{
      window.location.reload();
    },500); 
  };
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
  
    if (storedUserData) {
      try {
        const user = JSON.parse(storedUserData);
       
        setUsuario(user);  // Establecer el usuario en el estado global
      } catch (error) {
        console.error('Error al parsear los datos de usuario:', error);
      }
    } else {
      console.log('No se encontraron datos de usuario en localStorage');
    }
  }, [setUsuario]);
  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        
        <div className="flex items-center gap-6">
          <Link
            href={usuario?.rol === "administrador" ? "/listaVendedores" : "/dashvendedor"}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <div 
            
            className="relative overflow-hidden rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Image
                className="h-16 w-16 transform hover:scale-105 transition-transform duration-300"
                src="/KHlogo.png"
                alt="KHLogo"
                width={64}
                height={64}
              />
            </div>
          </Link>

          {usuario ? (
  <div className="flex flex-col space-y-1 border-l-2 border-gray-200 pl-6">
    <div className="flex items-center gap-2">
      <User size={18} className="text-blue-600" />
      <span className="text-blue-900 font-bold text-sm">
        {usuario.nombre || 'Usuario'}
      </span>
    </div>
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {usuario.rol || 'Rol'}
      </span>
    </div>
  </div>
) : "Kings House"}
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8 items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 group py-2"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </Link>
          ))}
          {usuario && (
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
  <div className="fixed inset-0 z-50 bg-white flex flex-col justify-center items-center h-screen w-screen px-6 py-6">
    {/* Botón de cierre en la esquina superior derecha */}
    <button
      type="button"
      className="absolute top-6 right-6 rounded-full p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
      onClick={() => setMobileMenuOpen(false)}
    >
      <X className="h-8 w-8" />
    </button>

    {/* Opciones de navegación en columna */}
    <div className="flex flex-col space-y-6 w-full max-w-md">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="block text-center w-full text-2xl font-semibold text-gray-900 bg-gray-100 py-4 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
          onClick={() => setMobileMenuOpen(false)} // Cierra el menú al hacer clic
        >
          {item.name}
        </Link>
      ))}

      {/* Botón de Cerrar Sesión si el usuario está autenticado */}
      {usuario && (
        <button
          onClick={logout}
          className="w-full text-center bg-red-500 text-white py-4 rounded-lg text-2xl font-semibold hover:bg-red-600 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
        >
          Cerrar Sesión
        </button>
      )}
    </div>
  </div>
)}
    </header>
  );
};


