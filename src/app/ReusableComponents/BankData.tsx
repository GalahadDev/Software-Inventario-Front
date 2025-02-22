"use client"
import React, { useState } from 'react';
import { updateBankData } from "../functions/bankUpdate"
import { User } from '../types';


export function BankData() {
  const [formData, setFormData] = useState<Partial<User>>({
    Cedula: '',
    Numero_Cuenta: '',
    Tipo_Cuenta: '',
    Nombre_Banco: '',
    Email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  
 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    updateBankData(formData, "/users/bank-data"); 

    setFormData({
        Cedula: '',
        Numero_Cuenta: '',
        Tipo_Cuenta: '',
        Nombre_Banco: '',
        Email: ''
    })
    
  };

  return (
    <div className="min-h-1 bg-gray-100 flex items-center justify-center p-4 mt-12">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Información Bancaria</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="cedula"
            placeholder="Cédula/RUT"
            value={formData.Cedula}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />

          <input
            type="text"
            name="numero_cuenta"
            placeholder="Número de cuenta"
            value={formData.Numero_Cuenta}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />

          <input
            type="text"
            name="tipo_cuenta"
            placeholder="Tipo de cuenta"
            value={formData.Tipo_Cuenta}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />

          <input
            type="text"
            name="nombre_banco"
            placeholder="Banco"
            value={formData.Nombre_Banco}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.Email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Guardar cambios
          </button>
        </form>

        

      </div>
    </div>
  );
}