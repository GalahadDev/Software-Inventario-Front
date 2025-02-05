// CrearVendedor.tsx
"use client"
import React, { useState } from 'react';
import { vendedorSchema } from '../validaciones/vendorSchema'; 
import { z } from 'zod';  
import { Header } from "../ReusableComponents/Header"

const CrearVendedor = () => {
  const [formData, setFormData] = useState({
    Nombre: "",
    Email: "",
    Contrasena: "",
    Rol: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({}); // Estado para los errores

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar el formulario usando Zod
    try {
      vendedorSchema.parse(formData);
      // Si la validación es exitosa, continuar con el registro
      console.log("Formulario enviado:", formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const validationErrors: Record<string, string> = {};
        err.errors.forEach(error => {
          validationErrors[error.path[0]] = error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  const navigation = [
    { name: 'Ver Vendedores', href: '/listaVendedores' },
    { name: 'Ver Pedidos', href: '/pedidosGenerales' },
    { name: 'Crear Vendedor', href: '/crearVendedor' },
    { name: "Crear Pedido", href: "/vendedorAdm" },
    {name: "Usuarios", href: "/listaUsuarios"}, 
  ];

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <Header navigation={navigation}/>
      <h1 className="font-extrabold text-3xl text-center mt-32 text-black">
        Registra un Nuevo Vendedor
      </h1>
    
      <div className="max-w-md mx-auto mt-4 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">Planilla de Registro</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-black">Nombre</label>
            <input
              type="text"
              placeholder="Nombre"
              id="nombre"
              name="Nombre"
              value={formData.Nombre}
              onChange={handleChange}
              required
              className="w-full pl-3 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 text-black"
            />
            {errors.Nombre && <p className="text-red-500 text-xs">{errors.Nombre}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">Correo Electrónico</label>
            <input
              type="email"
              placeholder="Email"
              id="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              className="w-full pl-3 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 text-black"
            />
            {errors.Email && <p className="text-red-500 text-xs">{errors.Email}</p>}
          </div>
          
          <div>
            <label htmlFor="Contraseña" className="block text-sm font-medium text-black">Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              id="Contraseña"
              name="Contrasena"
              value={formData.Contrasena}
              onChange={handleChange}
              required
              className="w-full pl-3 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 text-black"
            />
            {errors.Contrasena && <p className="text-red-500 text-xs">{errors.Contrasena}</p>}
          </div>
          
          <div>
            <label htmlFor="rol" className="block text-sm font-medium text-black">Rol</label>
            <select
              id="rol"
              name="Rol"
              value={formData.Rol}
              onChange={handleChange}
              required
              className="w-full pl-3 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 text-black"
            >
              <option value="">Selecciona un rol</option>
              <option value="admin">Administrador</option>
              <option value="vendedor">Vendedor</option>
              <option value="gerente">Gestor</option>
            </select>
            {errors.Rol && <p className="text-red-500 text-xs">{errors.Rol}</p>}
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-sky-600 hover:bg-sky-700"
            >
              Registrar Vendedor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearVendedor;
