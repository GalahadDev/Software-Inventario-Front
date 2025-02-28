import React from "react";
import { User } from "../types";

interface BankInfoProps {
  bankInfo: Partial<User>; // Recibe la información bancaria como prop
}

export const MostrarInfoBank: React.FC<BankInfoProps> = ({ bankInfo }) => {
  return (
    <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 mt-2 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Bancaria Actual</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <span className="text-sm text-gray-500">Número de Cuenta</span>
          <p className="font-medium text-gray-800">{bankInfo.Numero_Cuenta || "No disponible"}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <span className="text-sm text-gray-500">Nombre del Banco</span>
          <p className="font-medium text-gray-800">{bankInfo.Nombre_Banco || "No disponible"}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <span className="text-sm text-gray-500">Tipo de Cuenta</span>
          <p className="font-medium text-gray-800">{bankInfo.Tipo_Cuenta || "No disponible"}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-md">
          <span className="text-sm text-gray-500">Cédula/RUT</span>
          <p className="font-medium text-gray-800">{bankInfo.Cedula || "No disponible"}</p>
        </div>
      </div>
    </div>
  );
};
