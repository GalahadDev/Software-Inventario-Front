"use client";
import React, { useState } from 'react';
import { vendedorSchema } from '../validaciones/vendorSchema'; 
import { z } from 'zod';  
import { Header } from "../ReusableComponents/Header";
import { crearUsuario } from "../functions/functionPost";
import { SuccessModal } from '../ReusableComponents/Exito'; 

const CrearVendedor = () => {
  const [formData, setFormData] = useState({
    Nombre: "",
    Email: "",
    Contrasena: "",
    Rol: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Bloquear números en tiempo real en el campo Nombre
    if (name === "Nombre" && /[^a-zA-Z\s]/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar los datos con `safeParse` para capturar errores sin lanzar excepciones
    const result = vendedorSchema.safeParse(formData);

    if (!result.success) {
      // Formatear errores para mostrarlos en la interfaz
      const validationErrors: Record<string, string[]> = {};
      result.error.errors.forEach(error => {
        validationErrors[error.path[0]] = error.message ? [error.message] : [];
      });
      setErrors(validationErrors);
      return;
    }

    try {
      // Intentar crear el usuario
      const apiResponse = await crearUsuario(formData);

      if (apiResponse.success) {
        setModalMessage("Vendedor creado exitosamente!");
      } else {
        setModalMessage(apiResponse.error || "Error al crear el vendedor");
      }

      setIsOpen(true);
    } catch (error) {
      setModalMessage("Error inesperado al crear el vendedor");
      setIsOpen(true);
    }
  };

  const navigation = [
    { name: 'Ver Vendedores', href: '/listaVendedores' },
    { name: 'Ver Pedidos', href: '/pedidosGenerales' },
    { name: 'Crear Vendedor', href: '/crearVendedor' },
    { name: "Crear Pedido", href: "/vendedorAdm" },
    { name: "Usuarios", href: "/listaUsuarios" }, 
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
          {/* Input Nombre */}
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
            {errors.Nombre && <p className="text-red-500 text-xs">{errors.Nombre[0]}</p>}
          </div>

          {/* Input Email */}
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
            {errors.Email && <p className="text-red-500 text-xs">{errors.Email[0]}</p>}
          </div>
          
          {/* Input Contraseña */}
          <div>
            <label htmlFor="Contrasena" className="block text-sm font-medium text-black">Contraseña</label>
            <input
              type="password"
              placeholder="Contraseña"
              id="Contrasena"
              name="Contrasena"
              value={formData.Contrasena}
              onChange={handleChange}
              required
              className="w-full pl-3 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 text-black"
            />
            {errors.Contrasena && <p className="text-red-500 text-xs">{errors.Contrasena[0]}</p>}
          </div>
          
          {/* Select Rol */}
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
            {errors.Rol && <p className="text-red-500 text-xs">{errors.Rol[0]}</p>}
          </div>

          {/* Botón de enviar */}
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

      <SuccessModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        message={modalMessage}
      />
    </div>
  );
};

export default CrearVendedor;
