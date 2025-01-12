"use client"

import { ChangeEvent, useState } from 'react'
import { handleInputChange } from '../functions/inputChange';
import { sendSalesData } from '../functions/axiosFunctions';
import { useGlobalState } from '../Context/contextUser';

type saleForm = {
  nombre: string;
  descripcion: string;
  precio: number;
  observaciones: string;
  forma_pago: string;
  direccion: string;
  imagen: string | null;
  usuario_id: string | null;
}

function SalesMan() {
  // Obtener directamente el valor de usuario desde el contexto global
  const { usuario, setUsuario } = useGlobalState();

  const [sales, setSales] = useState<saleForm>({
    nombre: "",
    descripcion: "",
    precio: 0,
    observaciones: "",
    forma_pago: "",
    direccion: "",
    imagen: null,
    usuario_id: null, // Inicializar con null
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Usar optional chaining para prevenir errores si files es null
    if (file) {
      setSales((prevSales) => ({
        ...prevSales,
        Imagen: file, // Actualiza el Imagen en el estado de sales
      }));
    } else {
      console.error("No se seleccionó ninguna Imagen");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Creamos un "snapshot" local de sales
    const updatedSales = { ...sales };
  
    // Comprobamos si usuario existe:
    if (usuario) {
      updatedSales.usuario_id = usuario; 
      // O si quieres testear con la cadena fija:
      // updatedSales.Usuario_id = "bc3b14c9-fdeb-46aa-b0a8-8b85ffc93ce1";
    } else {
      console.error("Usuario no disponible.");
    }
  
    // Ahora sí, tu "updatedSales" ya tiene el Usuario_id correcto
    console.log("Data que se mandará al servidor:", updatedSales);
  
    try {
      const response = await sendSalesData(updatedSales);
      console.log("Pedido enviado con éxito:", response);
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
    }
  };
  

  const pruebaUsuario = () =>{
    alert(usuario)
}

  return (
    <div className="min-h-screen flex items-center justify-center font-mono bg-[url('/mueblesfoto.png')] bg-cover bg-center">
  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50"></div>

  <div className="flex flex-col shadow-2xl bg-opacity-50 backdrop-blur-lg p-10 sm:p-20 border-2 rounded-3xl w-full max-w-lg">

    <h1 className="text-3xl font-bold text-center text-white mb-8">Formulario de Pedido</h1>

    <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-opacity-50 backdrop-blur-lg">
      
      {/* Nombre */}
      <div className="relative w-full">
        <label htmlFor="nombre" className="text-white">Nombre Cliente</label>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          id="nombre"
          value={sales.nombre}
          onChange={(e) => handleInputChange(e, sales, setSales)}
          className="w-full pl-10 pr-3 py-2 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
        />
      </div>

     
      <div className="relative w-full">
        <label htmlFor="direccion" className="text-white">Direccion</label>
        <input
          type="text"
          name="direccion"
          placeholder="Direccion"
          id="direccion"
          value={sales.direccion}
          onChange={(e) => handleInputChange(e, sales, setSales)}
          className="w-full pl-10 pr-3 py-2 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
        />
      </div>

      

      {/* Descripción */}
      <div className="relative w-full">
        <label htmlFor="descripcion" className="text-white">Descripción</label>
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          id="descripcion"
          value={sales.descripcion}
          onChange={(e) => handleInputChange(e, sales, setSales)}
          className="w-full pl-10 pr-3 py-2 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
        />
      </div>

      {/* Precio */}
      <div className="relative w-full">
        <label htmlFor="precio" className="text-white">Precio</label>
        <input
          name="precio"
          type="text"
          placeholder="precio"
          id="precio"
          value={sales.precio}
          onChange={(e) => handleInputChange(e, sales, setSales)}
          className="w-full pl-10 pr-3 py-2 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
        />
      </div>

      {/* Forma de Pago */}
      <div className="relative w-full">
        <label htmlFor="formapago" className="text-white">Forma de Pago</label>
        <input
          name="forma_pago"
          type="text"
          placeholder="Forma de Pago"
          id="forma_pago"
          value={sales.forma_pago}
          onChange={(e) => handleInputChange(e, sales, setSales)}
          className="w-full pl-10 pr-3 py-2 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
        />
      </div>

      {/* Observaciones */}
      <div className="relative w-full">
        <label htmlFor="observaciones" className="text-white">Observaciones</label>
        <input
          type="text"
          name="observaciones"
          placeholder="Observaciones"
          id="observaciones"
          value={sales.observaciones}
          onChange={(e) => handleInputChange(e, sales, setSales)}
          className="w-full pl-10 pr-3 py-2 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
        />
      </div>

      {/* Imagen */}
      <div className="relative w-full border-none">
        <label htmlFor="Imagen" className="text-white">Adjunta Imagen de Referencia</label>
        <input
          id="imagen"
          type="file"
          name="imagen"
          onChange={handleFileChange}
          className="w-full pl-10 pr-3 py-2 border-2 rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
        />
      </div>

      {/* Botón de Enviar */}
      <button type="submit" className="bg-sky-950 text-white border-none rounded-lg py-2 mt-5">Enviar Pedido</button>
      <button onClick={pruebaUsuario}>pruebaUsuario</button>
    </form>
  </div>
 
</div>

  )
}

export default SalesMan