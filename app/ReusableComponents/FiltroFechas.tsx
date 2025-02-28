// components/FiltroFechas.tsx
"use client";
import React, { useState } from "react";

interface FiltroFechasProps {
  onFiltrar: (startDate: Date, endDate: Date) => void;
}

export const FiltroFechas: React.FC<FiltroFechasProps> = ({ onFiltrar }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFiltrar = () => {
    if (!startDate || !endDate) {
      setErrorMessage("DEBE INGRESAR FECHA DE INICIO Y FECHA DE TERMINO");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    if (startDate > endDate) {
      setErrorMessage("LA FECHA DE INICIO DEBE SER MENOR O IGUAL A LA FECHA DE TÉRMINO");
      setTimeout(() => setErrorMessage(""), 2000);
      return;
    }

    onFiltrar(startDate, endDate);
  };

  return (
    <div className="mb-6">
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={startDate?.toISOString().split("T")[0] || ""}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
        <input
          type="date"
          value={endDate?.toISOString().split("T")[0] || ""}
          onChange={(e) => setEndDate(new Date(e.target.value))}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
        <button
          onClick={handleFiltrar}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Filtrar por Fechas
        </button>
      </div>
      {errorMessage && (
        <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
      )}
    </div>
  );
};