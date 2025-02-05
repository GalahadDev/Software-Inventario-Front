"use client"
import { ChangeEvent, useState } from "react";
import { handleInputChange } from "../functions/inputChange";
import { sendSalesData } from "../functions/axiosFunctionFormDataPost";
import { useGlobalState } from "../Context/contextUser";
import { SaleForm } from "../types";

function SalesMan() {
  const { usuario } = useGlobalState();
  const [sales, setSales] = useState<SaleForm>({
    nombre: "",
    descripcion: "",
    precio: 0,
    observaciones: "",
    forma_pago: "",
    direccion: "",
    imagen: null,
    usuario_id: null,
  });

  const [errorPrecio, setErrorPrecio] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSales((prevSales) => ({
        ...prevSales,
        imagen: file,
      }));
    } else {
      console.error("No se seleccionó ninguna imagen");
    }
  };

  // Handler especial para precio
  const handlePrecioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Validación 1: No permite números con ceros iniciales
    if (/^0+[1-9]/.test(rawValue)) {
      setErrorPrecio("El precio no puede comenzar con 0");
      return;
    }
    
    // Validación 2: Números positivos
    const numericValue = Number(rawValue);
    if (numericValue <= 0) {
      setErrorPrecio("El precio debe ser mayor a 0");
      return;
    }

    // Si pasa las validaciones, actualiza el estado
    setErrorPrecio(null);
    setSales(prev => ({
      ...prev,
      precio: numericValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación final antes de enviar
    if (sales.precio <= 0) {
      setErrorPrecio("El precio debe ser mayor a 0");
      return;
    }

    if (!usuario || !usuario.usuario_id) {
      console.error("No se ha encontrado el usuario o no está autenticado.");
      alert("No se ha encontrado el usuario o no está autenticado.");
      return;
    }

    const updatedSales: SaleForm = {
      ...sales,
      usuario_id: usuario.usuario_id,
    };

    try {
      const response = await sendSalesData(updatedSales);
      console.log("Pedido enviado con éxito:", response);
      alert("Pedido enviado correctamente.");
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
      alert("Ocurrió un error al enviar el pedido.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gradient-to-b from-gray-50 to-white">
      <main className="flex-grow container mx-auto px-4 py-24 sm:py-32">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md bg-white shadow-lg p-6 sm:p-8 rounded-2xl border border-gray-100">
            <h1 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-6 sm:mb-8">
              Formulario de Pedido
            </h1>
    
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
              <div className="space-y-3 sm:space-y-4">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={sales.nombre}
                  onChange={(e) => handleInputChange(e, sales, setSales)}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
                />
                <input
                  type="text"
                  name="direccion"
                  placeholder="Dirección"
                  value={sales.direccion}
                  onChange={(e) => handleInputChange(e, sales, setSales)}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
                />
                <input
                  type="text"
                  name="descripcion"
                  placeholder="Descripción"
                  value={sales.descripcion}
                  onChange={(e) => handleInputChange(e, sales, setSales)}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
                />
                <div>
                  <input
                    type="number"
                    name="precio"
                    placeholder="Precio"
                    value={sales.precio}
                    onChange={handlePrecioChange}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
                  />
                  {errorPrecio && <p className="text-red-500 text-xs mt-1">{errorPrecio}</p>}
                </div>
                <input
                  type="text"
                  name="forma_pago"
                  placeholder="Forma de Pago"
                  value={sales.forma_pago}
                  onChange={(e) => handleInputChange(e, sales, setSales)}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
                />
                <input
                  type="text"
                  name="observaciones"
                  placeholder="Observaciones"
                  value={sales.observaciones}
                  onChange={(e) => handleInputChange(e, sales, setSales)}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
                />
                <div className="relative">
                  <input
                    type="file"
                    name="imagen"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 ease-in-out text-sm sm:text-base"
                  />
                </div>
              </div>
        
              {sales.imagen && (
                <div className="mt-4 sm:mt-6 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={URL.createObjectURL(sales.imagen)}
                    alt="Vista previa"
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
    
              <button
                type="submit"
                className="mt-4 sm:mt-6 bg-blue-600 text-white rounded-lg py-2.5 sm:py-3 px-6 font-medium hover:bg-blue-700 transform transition-all duration-200 ease-in-out hover:shadow-lg active:scale-[0.98] text-sm sm:text-base"
              >
                Enviar Pedido
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SalesMan;