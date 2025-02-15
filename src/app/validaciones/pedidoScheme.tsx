import { z } from "zod";

export const pedidoScheme = z.object({
  nombre: z
    .string()
    .max(20, "El nombre no puede tener más de 20 caracteres")
    .regex(/^[a-zA-Z\s]+$/, "El nombre solo puede contener letras y espacios"),
  descripcion: z
    .string()
    .max(100, "La descripción no puede tener más de 100 caracteres"),
  precio: z
    .number({ invalid_type_error: "El precio debe ser un número" })
    .min(1000, "El precio debe ser mayor a 1000"),
  observaciones: z
    .string()
    .max(60, "Las observaciones no pueden tener más de 60 caracteres"),
  imagen: z
    .custom<File>((file) => file instanceof File, "Debe ser un archivo")
    .refine(
      (file) => ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
      "Solo se permiten imágenes en formato JPG, JPEG o PNG"
    ),
  nro_tlf: z
    .string()
    .min(9, "El número de teléfono debe tener al menos 9 dígitos")
    .max(12, "El número de teléfono no puede tener más de 12 dígitos")
    .regex(/^\+?[0-9]+$/, "Solo se permiten números y el símbolo '+'"),
});