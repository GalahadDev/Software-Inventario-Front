"use client"
import { login } from '../functions/axiosFunctions';
import { useState } from 'react';
import { handleInputChange } from '../functions/inputChange'
import { FaEnvelope } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useGlobalState } from '../Context/contextUser';

type User = {
    email: string,
    contrasena: string;
}

const LogIn = () => {

    const router = useRouter();

    const { usuario, setUsuario } = useGlobalState();

    const [user, setUser] = useState<User>({
        email: "",
        contrasena: ""
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null); // Resetea el mensaje de error antes de intentar el inicio de sesión
        try {
            const response = await login(user); // Llama a la función login
            if (response && response.token) {
                localStorage.setItem("authToken", response.token); // Guarda el token en localStorage
                console.log("Inicio de sesión exitoso. Token guardado:", response.token);
                setUsuario(response.usuario_id);
                alert(usuario)
               
                // Redirige al usuario a otra página (ajusta la ruta según tu aplicación)
               router.push("/salesman");
            } else {
                console.warn("No se recibió un token en la respuesta.");
            }
        } catch (error: any) {
            setErrorMessage(error.message || "Error en el inicio de sesión."); // Muestra el mensaje de error al usuario
        }

    
    };


    return (
        <section className="min-h-screen flex items-center justify-center font-mono bg-[url('/blueSofa.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50"></div>
      
        <div className="flex flex-col shadow-2xl bg-opacity-50 backdrop-blur-lg p-20 border-none rounded-3xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
          <div className="w-full flex items-center justify-center">
            <img src="/KHlogo.png" alt="" className="min-w-30 border-none rounded-full" />
          </div>
      
          <h1 className="text-3xl font-bold text-center">Gestion y Ventas</h1>
      
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-opacity-50 backdrop-blur-lg">
            <span>Email</span>
            <div className="relative w-full">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                placeholder="Correo"
                name="email"
                value={user.email}
                onChange={(e) => handleInputChange(e, user, setUser)}
                className="text-black rounded-md p-1 border-2 outline-none focus:border-e-blue-700 focus:bg-slate-50 w-full pl-10 pr-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
      
            <span>Contraseña</span>
            <div className="relative w-full">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                placeholder="Contraseña"
                name="contrasena"
                value={user.contrasena}
                onChange={(e) => handleInputChange(e, user, setUser)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
      
            <button type="submit" className="bg-sky-950 border-none rounded-lg min-h-10 max-h-20">Ingresar</button>
          </form>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <span className="text-center mt">Stoic Development Team</span>
        </div>
        
      </section>
    );
};

export default LogIn;

