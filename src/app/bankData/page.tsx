"use client"
import React, { useState } from "react";

// Definimos una interface para especificar que
// el componente puede recibir la prop onSuccess
interface BankDataProps {
  onSuccess?: () => void;
}

export function BankData({ onSuccess }: BankDataProps) {
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  // Agrega más estados si lo requieres

  // Función que maneja la lógica de actualización
  const handleUpdateBankData = async () => {
    try {
      // Ejemplo de lógica de actualización, p.ej. una llamada a la API
      // const response = await fetch("/api/updateBankInfo", {
      //   method: "POST",
      //   body: JSON.stringify({ bank, accountNumber }),
      //   ...
      // });
      // if (response.ok) {
      //   // Si fue exitoso, llama a onSuccess
      //   onSuccess?.();
      // }

      // Por ahora asumimos que todo sale bien y llamamos directamente:
      onSuccess?.();
    } catch (error) {
      console.error("Error al actualizar la información bancaria:", error);
      // Manejo de errores
    }
  };

  // Render del formulario
  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl mb-4">Actualizar Información Bancaria</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateBankData();
        }}
      >
        <div className="mb-4">
          <label className="block font-medium">Banco:</label>
          <input
            type="text"
            value={bank}
            onChange={(e) => setBank(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">Número de cuenta:</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
