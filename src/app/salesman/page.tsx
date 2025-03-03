"use client";
import { ChangeEvent, useState } from "react";
import { handleInputChange } from "../functions/inputChange";
import { sendSalesData } from "../functions/axiosFunctionFormDataPost";
import { useGlobalState } from "../Context/contextUser";
import { SaleForm } from "../types";
import { pedidoScheme } from "../validaciones/pedidoScheme";
import { SuccessModal } from "../ReusableComponents/Exito";

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
    nro_tlf: "",
    pagado: "",
    tela: "",
    color: "",
    subVendedor: "",
    Comision_Sugerida: "",
    fecha_entrega: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handlePrecioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (rawValue === "") {
      setErrors((prev) => ({ ...prev, precio: "" }));
      setSales((prev) => ({
        ...prev,
        precio: 0,
      }));
      return;
    }

    const numericValue = Number(rawValue);

    if (isNaN(numericValue)) {
      setErrors((prev) => ({ ...prev, precio: "El precio debe ser un número válido" }));
      return;
    }

    if (numericValue <= 0) {
      setErrors((prev) => ({ ...prev, precio: "El precio debe ser mayor a 0" }));
      return;
    }

    setErrors((prev) => ({ ...prev, precio: "" }));
    setSales((prev) => ({
      ...prev,
      precio: numericValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!usuario || !usuario.usuario_id) {
      console.error("No se ha encontrado el usuario o no está autenticado.");
      return;
    }
  
    // Deshabilitar el botón al iniciar el envío
    setIsSubmitting(true);
  
    const updatedSales: SaleForm = {
      ...sales,
      usuario_id: usuario.usuario_id,
    };
  
    try {
      const result = pedidoScheme.safeParse(updatedSales);
      if (!result.success) {
        const errorMap = result.error.formErrors.fieldErrors;
  
        // Crear un objeto para almacenar los nuevos errores
        const newErrors: { [key: string]: string } = {};
  
        // Mapear los errores de zod al estado de errores
        Object.keys(errorMap).forEach((key) => {
          const fieldName = key as keyof typeof errorMap; // Asegurar el tipo de la clave
          newErrors[fieldName] = errorMap[fieldName]?.join(", ") || ""; // Unir múltiples mensajes de error
        });
  
        setErrors(newErrors); // Actualizar el estado de errores
        return; // Detener la ejecución si hay errores
      }
  
      // Si la validación es exitosa, enviar los datos
      const response = await sendSalesData(updatedSales);
  
      setErrors({}); // Limpiar los errores
      if (response.mensaje === "Pedido creado exitosamente") {
        setIsOpen(true);
        setSales({
          nombre: "",
          descripcion: "",
          precio: 0,
          observaciones: "",
          forma_pago: "",
          direccion: "",
          imagen: null,
          usuario_id: null,
          nro_tlf: "",
          pagado: "",
          tela: "",
          color: "",
          subVendedor: "",
          Comision_Sugerida: "",
          fecha_entrega: "",
        });
      }
    } catch (error) {
      console.error("Error al enviar el pedido:", error);
    } finally {
      // Vuelve a habilitar el botón después de 4 segundos
      setTimeout(() => {
        setIsSubmitting(false);
      }, 4000);
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
    {/* Nombre del Cliente */}
    <input
      type="text"
      name="nombre"
      placeholder="Nombre del Cliente"
      value={sales.nombre}
      onChange={(e) => handleInputChange(e, sales, setSales)}
      className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
      required // Campo obligatorio
    />
    {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}

    {/* Dirección */}
    <input
      type="text"
      name="direccion"
      placeholder="Dirección"
      value={sales.direccion}
      onChange={(e) => handleInputChange(e, sales, setSales)}
      className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
      required // Campo obligatorio
    />
    {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>}

    {/* Producto */}
    <input
      type="text"
      name="descripcion"
      placeholder="Producto"
      value={sales.descripcion}
      onChange={(e) => handleInputChange(e, sales, setSales)}
      className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
      required // Campo obligatorio
    />
    {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}

    {/* Tipo de Tela */}
    <input
      type="text"
      name="tela"
      placeholder="Tipo de Tela"
      value={sales.tela}
      onChange={(e) => handleInputChange(e, sales, setSales)}
      className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
      required // Campo obligatorio
    />
    {errors.tela && <p className="text-red-500 text-xs mt-1">{errors.tela}</p>}

    {/* Color */}
    <input
      type="text"
      name="color"
      placeholder="Color"
      value={sales.color}
      onChange={(e) => handleInputChange(e, sales, setSales)}
      className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
      required // Campo obligatorio
    />
    {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color}</p>}

    {/* Precio */}
    <div>
      <input
        type="number"
        name="precio"
        placeholder="Precio"
        value={sales.precio || ""}
        onChange={handlePrecioChange}
        className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
        required // Campo obligatorio
      />
      {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio}</p>}
    </div>

    {/* Forma de Pago */}
    <input
      type="text"
      name="forma_pago"
      placeholder="Forma de Pago"
      value={sales.forma_pago}
      onChange={(e) => handleInputChange(e, sales, setSales)}
      className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
      required // Campo obligatorio
    />
    {errors.forma_pago && <p className="text-red-500 text-xs mt-1">{errors.forma_pago}</p>}

    {/* Observaciones */}
    <input
      type="text"
      name="observaciones"
      placeholder="Observaciones"
      value={sales.observaciones}
      onChange={(e) => handleInputChange(e, sales, setSales)}
      className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
      required // Campo obligatorio
    />
    {errors.observaciones && <p className="text-red-500 text-xs mt-1">{errors.observaciones}</p>}

    {/* Fecha de Entrega */}
    <span className="text-black m-0">Fecha de Entrega</span>
    <input
      id="fe"
      type="date"
      name="fecha_entrega"
      placeholder="Selecciona una fecha"
      value={sales.fecha_entrega}
      min={new Date().toISOString().split("T")[0]}
      onChange={(e) => handleInputChange(e, sales, setSales)}
      className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
      required // Campo obligatorio
    />
    {errors.fecha_entrega && <p className="text-red-500 text-xs mt-1">{errors.fecha_entrega}</p>}

    {/* Número de Teléfono */}
    <input
      type="text"
      name="nro_tlf"
      placeholder="Número de Teléfono del Cliente"
      value={sales.nro_tlf}
      onChange={(e) => handleInputChange(e, sales, setSales)}
      className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
      required // Campo obligatorio
    />
    {errors.nro_tlf && <p className="text-red-500 text-xs mt-1">{errors.nro_tlf}</p>}

    {/* SubVendedor (Opcional) */}
    <input
      type="text"
      name="subVendedor"
      placeholder="Nombre del Vendedor Asociado"
      value={sales.subVendedor}
      onChange={(e) => handleInputChange(e, sales, setSales)}
      className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
    />

    {/* Comisión Sugerida */}
    <input
      type="text"
      name="Comision_Sugerida"
      placeholder="Comisión Sugerida"
      value={sales.Comision_Sugerida}
      onChange={(e) => handleInputChange(e, sales, setSales)}
      className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out text-sm sm:text-base"
      required // Campo obligatorio
    />
    {errors.Comision_Sugerida && <p className="text-red-500 text-xs mt-1">{errors.Comision_Sugerida}</p>}

    {/* Imagen */}
    <div className="relative">
      <input
        type="file"
        name="imagen"
        onChange={handleFileChange}
        className="w-full px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 ease-in-out text-sm sm:text-base"
        required // Campo obligatorio
      />
      {errors.imagen && <p className="text-red-500 text-xs mt-1">{errors.imagen}</p>}
    </div>
  </div>

  {/* Vista previa de la imagen */}
  {sales.imagen && (
    <div className="mt-4 sm:mt-6 rounded-lg overflow-hidden border border-gray-200">
      <img
        src={URL.createObjectURL(sales.imagen)}
        alt="Vista previa"
        className="w-full h-auto object-cover"
      />
    </div>
  )}

  {/* Modal de éxito */}
  <SuccessModal
    isOpen={isOpen}
    onClose={() => setIsOpen(false)}
    message={modalMessage}
  />

  {/* Botón de enviar */}
  <button
    type="submit"
    disabled={isSubmitting}
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
