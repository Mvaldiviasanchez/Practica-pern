import { z } from "zod";

export const signupSchema = z.object({
    name: z.string({
        required_error: 'El nombre es requerido',
        invalid_type_error: 'El nombre debe ser un texto',
    }).min(1).max(255),
    email: z.string({
        required_error: 'El correo electrónico es requerido',
        invalid_type_error: 'El correo electrónico debe ser un texto', 
    }).email({
        message: 'El correo electrónico debe ser válido', 
    }),
    password: z.string({
        required_error: 'La contraseña es requerida',
        invalid_type_error: 'La contraseña debe ser un texto',
    }).min(6, {
        message: 'La contraseña debe tener al menos 6 caracteres',
    }
    ).max(255, {
            message: 'La contraseña no debe tener más de 255 caracteres',
        }
    )
})
export const signinSchema = z.object({
    email: z.string({
        required_error: 'El correo electrónico es requerido',
        invalid_type_error: 'El correo electrónico debe ser un texto', 
    }).email({
        message: 'El correo electrónico debe ser válido', 
    }),
    password: z.string({
        required_error: 'La contraseña es requerida',
        invalid_type_error: 'La contraseña debe ser un texto',
    }).min(6, {
        message: 'La contraseña debe tener al menos 6 caracteres',
    }).max(255, {
        message: 'La contraseña no debe tener más de 255 caracteres',
    })
})