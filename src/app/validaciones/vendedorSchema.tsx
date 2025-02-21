import { z } from "zod";

export const vendedorSchema = z.object({
  Nombre: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres" })
    .regex(/^[a-zA-Z\s]+$/, { message: "El nombre solo puede contener letras y espacios" }),
  Rol: z.literal("vendedor"), // El rol debe ser exactamente "vendedor"
});

export type Vendedor = z.infer<typeof vendedorSchema>;