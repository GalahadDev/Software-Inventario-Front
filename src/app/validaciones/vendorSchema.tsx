// validationSchema.ts
import { z } from "zod";



export const vendedorSchema = z.object({
  Nombre: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(50, { message: "El nombre no puede exceder los 50 caracteres" })
    .nonempty({ message: "El nombre es requerido" }),

  Email: z
    .string()
    .email({ message: "Por favor ingrese un correo electrónico válido" })
    .nonempty({ message: "El correo electrónico es requerido" }),

  Contrasena: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .max(20, { message: "La contraseña no puede exceder los 20 caracteres" })
    .regex(/[A-Z]/, { message: "La contraseña debe contener al menos una letra mayúscula" })
    .regex(/[a-z]/, { message: "La contraseña debe contener al menos una letra minúscula" })
    .regex(/[0-9]/, { message: "La contraseña debe contener al menos un número" })
    .nonempty({ message: "La contraseña es requerida" }),

  Rol: z
    .string()
    .nonempty({ message: "El rol es requerido" })
    .refine(val => ["admin", "vendedor", "gerente"].includes(val), {
      message: "Rol no válido, seleccione un rol válido",
    }),


});

export const UserSchema = z.object({
  id: z.string(),
  nombre: z.string(),
  email: z.string().email(),
  rol: z.enum(["vendedor", "administrador", "cliente"]),
});

export type User = z.infer<typeof UserSchema>;
