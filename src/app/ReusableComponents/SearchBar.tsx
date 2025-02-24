"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  buttonText?: string;
  searchTermFromParent?: string; // Recibe el término de búsqueda del padre
}

export function SearchBar({
  onSearch,
  placeholder = "Buscar...",
  buttonText = "Buscar",
  searchTermFromParent = "", // Valor por defecto vacío
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("📥 Término de búsqueda recibido del padre:", searchTermFromParent);
  }, [searchTermFromParent]); // Se ejecuta cuando el padre cambia el término de búsqueda

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Término de búsqueda enviado:", searchTerm); // <-- Agregar log aquí
    onSearch(searchTerm); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); // <-- Forzar actualización en `PedidosPage`
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <div className="relative flex-1">
        <input
           type="text"
           value={searchTerm}
           onChange={handleInputChange} 
           placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
      >
        {buttonText}
      </button>
    </form>
  );
}
