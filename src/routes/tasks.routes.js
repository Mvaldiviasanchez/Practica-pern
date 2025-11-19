// src/routes/tasks.routes.js
import Router from 'express-promise-router';
import multer from 'multer';
import path from 'path'; // 👈 NUEVO

import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask
} from "../controllers/tasks.controller.js";
import { isAuth } from '../middlewares/auth.middleware.js';
import { validateSchema } from '../middlewares/validate.middleware.js';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema.js';

const router = Router();

// 👇 NUEVO: configuración de multer con diskStorage
// Guarda los archivos en "uploads/" manteniendo la extensión (.pdf)
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '';
    cb(null, uniqueName + ext);
  },
});

const upload = multer({ storage });

router.get('/tasks', isAuth, getAllTasks);
router.get('/tasks/:id', isAuth, getTask);

// Crear tarea con posible archivo adjunto "attachment"
router.post(
  '/tasks',
  isAuth,
  upload.single('attachment'),    // 👈 procesa archivo en creación
  validateSchema(createTaskSchema),
  createTask
);

// 🔥 AHORA TAMBIÉN PERMITE CAMBIAR EL ARCHIVO AL EDITAR
router.put(
  '/tasks/:id',
  isAuth,
  upload.single('attachment'),    // 👈 procesa archivo en edición
  validateSchema(updateTaskSchema),
  updateTask
);

router.delete('/tasks/:id', isAuth, deleteTask);

export default router;
