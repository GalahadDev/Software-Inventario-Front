import { z } from "zod";

export const administradorSchema = z.object({
  Nombre: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres" })
    .regex(/^[a-zA-Z\s]+$/, { message: "El nombre solo puede contener letras y espacios" }),
  Email: z
    .string()
    .email({ message: "Por favor ingrese un correo electrónico válido" })
    .nonempty({ message: "El correo electrónico es requerido" }),
  Contrasena: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .max(20, { message: "La contraseña no puede exceder los 20 caracteres" })
    .regex(/[a-z]/, { message: "La contraseña debe contener al menos una letra minúscula" })
    .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número" })
    .nonempty({ message: "La contraseña es requerida" }),
  Rol: z
    .string()
    .nonempty({ message: "El rol es requerido" })
    .refine(val => ["administrador", "gestor"].includes(val), {
      message: "Rol no válido, seleccione un rol válido",
    }),
});

export type Administrativo = z.infer<typeof administradorSchema>;
