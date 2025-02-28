"use client";
import { useState } from 'react';
import { login } from '../functions/login'; // Importa la función login
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '../Context/contextUser';
import { UserType } from '../types';
import { handleInputChange } from 'app/functions/inputChange';

const Login = () => {
  const router = useRouter();
  const { setUsuario } = useGlobalState();

  const [activeTab, setActiveTab] = useState<"Administrativo" | "Vendedor">("Administrativo");
  const [user, setUser] = useState<UserType>({
    email: '', // Aquí almacenaremos el nombre cuando sea Vendedor
    contrasena: '',
    nombre: '',
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setPasswordError(null);

    try {
      if (activeTab === "Administrativo") {
        // Lógica de login para Administrativo
        const response = await login({ email: user.email, contrasena: user.contrasena });

        if (response?.token) {
          localStorage.setItem("authToken", response.token);
          localStorage.setItem("userData", JSON.stringify(response));

          setUsuario({
            mensaje: "Login exitoso",
            nombre: response.nombre, 
            rol: response.rol,
            token: response.token,
            usuario_id: response.usuario_id,
          });

          if (response.rol === "vendedor") {
            router.push("/dashvendedor");
          } else if (response.rol === "administrador") {
            router.push("/listaVendedores");
          }
        } else {
          setErrorMessage("Error: No se recibió token");
        }
      } else if (activeTab === "Vendedor") {
        // Lógica de login para Vendedor (usamos `email` para enviar el nombre)
        const response = await login({ email: user.email, contrasena: "" }); // Enviamos el nombre en `email`

        if (response?.token) {
          localStorage.setItem("authToken", response.token);
          localStorage.setItem("userData", JSON.stringify(response));
          console.log(response);

          setUsuario({
            mensaje: "Login exitoso",
            nombre: response.nombre, // Asegúrate de que la API devuelva `nombre`
            rol: response.rol,
            token: response.token,
            usuario_id: response.usuario_id,
          });

          router.push("/dashvendedor"); 
        } else {
          setErrorMessage("Error: No se recibió token");
        }
      }
    } catch (error: any) {
      if (error.response) {
        const statusCode = error.response.status;

        switch (statusCode) {
          case 400:
            setErrorMessage("Error: Los datos enviados no son válidos.");
            break;
          case 401:
            setPasswordError("La contraseña o el correo electrónico son incorrectos.");
            break;
          case 404:
            setErrorMessage("Error: El correo electrónico no está registrado.");
            break;
          case 500:
            setErrorMessage("Error en el servidor. Intenta más tarde.");
            break;
          default:
            setErrorMessage("Ocurrió un error inesperado.");
            break;
        }
      } else {
        if (error.message.includes('Network Error')) {
          setErrorMessage("Error de conexión. Por favor, verifica tu conexión a internet.");
        } else {
          setErrorMessage(error.message || "Error en el inicio de sesión.");
        }
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[url('/blueSofa.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black/80 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-md mx-4 overflow-hidden">
        <div className="backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] p-8 transition-all duration-300">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <img
              src="/KHlogo.png"
              alt="Logo"
              className="relative w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-800"
            />
          </div>

          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Gestión y Ventas
          </h1>

          {/* Pestañas para alternar entre Administrativo y Vendedor */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab("Administrativo")}
              className={`w-1/2 py-2 text-center ${
                activeTab === "Administrativo"
                  ? "border-b-2 border-blue-500 font-bold"
                  : "text-gray-500"
              }`}
            >
              Administrativo
            </button>
            <button
              onClick={() => setActiveTab("Vendedor")}
              className={`w-1/2 py-2 text-center ${
                activeTab === "Vendedor"
                  ? "border-b-2 border-blue-500 font-bold"
                  : "text-gray-500"
              }`}
            >
              Vendedor
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === "Administrativo" ? (
              <>
                {/* Formulario de Administrativo */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="email"
                      placeholder="Correo electrónico"
                      name="email"
                      value={user.email}
                      onChange={(e) => handleInputChange(e, user, setUser)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-white transition-all duration-200 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                  <div className="relative group">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="password"
                      placeholder="Contraseña"
                      name="contrasena"
                      value={user.contrasena}
                      onChange={(e) => handleInputChange(e, user, setUser)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-white transition-all duration-200 outline-none"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Formulario de Vendedor (solo nombre) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Usuario</label>
                  <div className="relative group">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Usuario"
                      name="email" // Usamos `email` para almacenar el nombre
                      value={user.email}
                      onChange={(e) => handleInputChange(e, user, setUser)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800 dark:text-white transition-all duration-200 outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500/20 transform hover:scale-[1.02] transition-all duration-200"
            >
              Ingresar
            </button>
          </form>

          {/* Mostrar mensajes de error */}
          {passwordError && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-600 text-sm text-center">{passwordError}</p>
            </div>
          )}

          {errorMessage && !passwordError && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-600 text-sm text-center">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Login;