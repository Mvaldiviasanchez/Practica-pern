import {z} from 'zod';

export const createTaskSchema = z.object({
    title: z.string({
        required_error: 'El titulo es requerido',
        invalid_type_error : 'El titulo debe de ser un texto',
    }).min (1).max(255),
    description: z.string({
        required_error: 'La descripcion es requerida',
        invalid_type_error : 'La descripcion debe de ser un texto',
    }).min(1).max(255).optional(),
});

export const updateTaskSchema = z.object({
    title: z.string({
        required_error: 'El titulo es requerido',
        invalid_type_error : 'El titulo debe de ser un texto',
    }).min (1, {
        message: 'El titulo debe tener al menos 1 caracter',
    }).max(255, {
        message: 'El titulo debe tener como maximo 255 caracteres',
    }).optional(),
    description: z.string({
        required_error: 'La descripcion es requerida',
        invalid_type_error : 'La descripcion debe de ser un texto',
    }).min(1, {
        message: 'La descripcion debe tener al menos 1 caracter',
    }).max(255, {
        message: 'La descripcion debe tener como maximo 255 caracteres',
    }).optional(),
})