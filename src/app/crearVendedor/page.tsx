"use client";
import React, { useState } from 'react';
import { Header } from "../ReusableComponents/Header";
import { crearUsuario } from "../functions/functionPost";
import { SuccessModal } from '../ReusableComponents/Exito';
import { vendedorSchema } from '../validaciones/vendedorSchema';
import { administradorSchema } from '../validaciones/administradorSchema';

const CrearVendedor = () => {
  const [activeTab, setActiveTab] = useState("Vendedor");
  const [formData, setFormData] = useState({
    Nombre: "",
    Email: "",
    Contrasena: "",
    Rol: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [apiResponse, setApiResponse] = useState<any>(null);

  // Función para limpiar el formulario
  const resetForm = () => {
    setFormData({
      Nombre: "",
      Email: "",
      Contrasena: "",
      Rol: "",
    });
    setErrors({}); // Limpiar errores de validación
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "Nombre" && /[^a-zA-Z\s]/.test(value)) return; // Validar solo letras y espacios en el nombre
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado");

    // Preparar los datos a enviar según la pestaña seleccionada
    let dataToSend;
    if (activeTab === "Vendedor") {
      dataToSend = {
        Nombre: formData.Nombre || "",
        Rol: "vendedor", // El rol se fija como "vendedor"
      };
    } else {
      dataToSend = {
        Nombre: formData.Nombre || "",
        Email: formData.Email || "",
        Contrasena: formData.Contrasena || "",
        Rol: formData.Rol || "",
      };
    }

    // Seleccionar el esquema de validación según la pestaña activa
    const schema = activeTab === "Vendedor" ? vendedorSchema : administradorSchema;
    console.log("Esquema seleccionado:", schema);

    if (!schema) {
      console.error("El esquema de validación no está definido.");
      return;
    }

    const result = schema.safeParse(dataToSend);

    // Manejar errores de validación
    if (!result.success) {
      console.log("Errores de validación:", result.error.errors);
      const validationErrors: Record<string, string[]> = {};
      result.error.errors.forEach((error) => {
        validationErrors[error.path[0]] = error.message ? [error.message] : [];
      });
      setErrors(validationErrors);
      return;
    }

    try {
      console.log("Enviando petición a la API...");
      const apiResponse = await crearUsuario(dataToSend);
      console.log("Respuesta de la API:", apiResponse);

      // Guardar la respuesta en el estado
      setApiResponse(apiResponse);

      // Mostrar mensaje de éxito o error
      setModalMessage(
        apiResponse.success
          ? "Usuario creado exitosamente!"
          : apiResponse.error || "Error al crear el usuario"
      );
      setIsOpen(true);

      // Limpiar el formulario si el usuario se creó correctamente
      if (apiResponse.success) {
        resetForm();
      }
    } catch (error) {
      console.log("Error en la petición:", error);
      setModalMessage("Error inesperado al crear el usuario");
      setIsOpen(true);
    }
  };

  const handleSendToWhatsApp = () => {
    if (!apiResponse || !apiResponse.data.username) {
      alert("No hay usuario para enviar.");
      return;
    }

    const mensaje = `Hola, Soy parte del equipo administrativo de muebles King´s House.
     Este es tu usuario para ingresar pedidos en nuestra plataforma: Usuario: ${apiResponse.data.username}
     y este es el link de acceso a la plataforma ${"https://kings-bed-sm.onrender.com/login"}`;
    const mensajeCodificado = encodeURIComponent(mensaje);
    const numeroWhatsApp = "56969151941";

    // Enlace directo para abrir WhatsApp
    window.open(`https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`, "_blank");
  };

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <Header
        navigation={[ 
          { name: 'Ver Vendedores', href: '/listaVendedores' },
          { name: 'Ver Pedidos', href: '/pedidosGenerales' },
          { name: 'Crear Usuario', href: '/crearVendedor' },
          { name: "Crear Pedido", href: "/vendedorAdm" },
          { name: "Usuarios", href: "/listaUsuarios" },
        ]}
      />
      <h1 className="font-extrabold text-3xl text-center mt-32 text-black">
        Registra un Nuevo Usuario
      </h1>
      <div className="max-w-md mx-auto mt-4 p-6 bg-white rounded-xl shadow-lg">
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("Administrativo")}
            className={`w-1/2 py-2 text-center ${
              activeTab === "Administrativo"
                ? "border-b-2 border-blue-500 font-bold text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Administrativo
          </button>
          <button
            onClick={() => setActiveTab("Vendedor")}
            className={`w-1/2 py-2 text-center ${
              activeTab === "Vendedor"
                ? "border-b-2 border-blue-500 font-bold text-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Vendedor
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === "Administrativo" ? (
            <>
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-black">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="Nombre"
                  value={formData.Nombre}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div>
                <label htmlFor="Contrasena" className="block text-sm font-medium text-black">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="Contrasena"
                  name="Contrasena"
                  value={formData.Contrasena}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div>
                <label htmlFor="rol" className="block text-sm font-medium text-black">
                  Rol
                </label>
                <select
                  id="rol"
                  name="Rol"
                  value={formData.Rol}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded text-black"
                >
                  <option value="">Selecciona un rol</option>
                  <option value="administrador">administrador</option>
                  <option value="gestor">gestor</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-black">
                  Nombre
                </label>
                <input
                  type="text"
                  id="Nombre"
                  name="Nombre"
                  value={formData.Nombre}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div>
                <label htmlFor="rol" className="block text-sm font-medium text-black">
                  Rol
                </label>
                <select
                  id="rol"
                  name="Rol"
                  value="vendedor"
                  disabled
                  className="w-full p-2 border text-black rounded bg-gray-200 cursor-not-allowed"
                >
                  <option value="vendedor">vendedor</option>
                </select>
              </div>
            </>
          )}
          <div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Registrar
            </button>
          </div>
        </form>

        {/* Botón para enviar usuario a WhatsApp */}
        {apiResponse?.success && (
          <div className="mt-4">
            <button
              onClick={handleSendToWhatsApp}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Enviar Usuario a WhatsApp
            </button>
          </div>
        )}
      </div>

      <SuccessModal isOpen={isOpen} onClose={() => setIsOpen(false)} message={modalMessage} />
    </div>
  );
};

export default CrearVendedor;