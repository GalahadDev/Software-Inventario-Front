import { z } from "zod";

export const pedidoScheme = z.object({
  // Nombre del Cliente
  nombre: z
    .string({ required_error: "El nombre es obligatorio" }) // Requerido
    .max(20, "El nombre no puede tener más de 20 caracteres"),

  // Descripción del Producto
  descripcion: z
    .string({ required_error: "La descripción es obligatoria" }) // Requerido
    .max(100, "La descripción no puede tener más de 100 caracteres"),

  // Precio
  precio: z
    .number({ required_error: "El precio es obligatorio", invalid_type_error: "El precio debe ser un número" })
    .min(1000, "El precio debe ser mayor a 1000"),

  // Observaciones
  observaciones: z
    .string({ required_error: "Las observaciones son obligatorias" }) // Requerido
    .max(60, "Las observaciones no pueden tener más de 60 caracteres"),

  // Forma de Pago
  forma_pago: z
    .string({ required_error: "La forma de pago es obligatoria" }), // Requerido

  // Dirección
  direccion: z
    .string({ required_error: "La dirección es obligatoria" }), // Requerido

  // Imagen
  imagen: z
    .custom<File>((file) => file instanceof File, { message: "Debe ser un archivo" }) // Requerido
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      { message: "Solo se permiten imágenes en formato JPG, JPEG o PNG" }
    ),

  // ID de Usuario
  usuario_id: z
    .number({ required_error: "El ID de usuario es obligatorio", invalid_type_error: "El ID de usuario debe ser un número" }), // Requerido

  // Número de Teléfono
  nro_tlf: z
    .string({ required_error: "El número de teléfono es obligatorio" }) // Requerido
    .min(9, "El número de teléfono debe tener al menos 9 dígitos")
    .max(12, "El número de teléfono no puede tener más de 12 dígitos")
    .regex(/^\+?[0-9]+$/, "Solo se permiten números y el símbolo '+'"),

  // Estado de Pago
  pagado: z
    .string({ required_error: "El estado de pago es obligatorio" }), // Requerido

  // Tipo de Tela
  tela: z
    .string({ required_error: "El tipo de tela es obligatorio" }), // Requerido

  // Color
  color: z
    .string({ required_error: "El color es obligatorio" }), // Requerido

  // SubVendedor (Opcional)
  subVendedor: z.string().optional(), // Opcional

  // Comisión Sugerida
  Comision_Sugerida: z
    .string({ required_error: "La comisión sugerida es obligatoria" }), // Requerido

  // Fecha de Entrega
  fecha_entrega: z
    .string({ required_error: "La fecha de entrega es obligatoria" }) // Requerido
    .refine((value) => !isNaN(new Date(value).getTime()), { message: "La fecha de entrega debe ser una fecha válida" }),
});