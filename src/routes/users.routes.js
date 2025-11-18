// src/routes/users.routes.js
import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware.js"; 
import { 
  updateAvatar, 
  updateUserEmail 
} from "../controllers/users.controller.js";

const router = Router();

// Cambiar avatar
router.put("/users/me/avatar", isAuth, updateAvatar);

// Cambiar correo
router.put("/users/me/email", isAuth, updateUserEmail);

export default router;
