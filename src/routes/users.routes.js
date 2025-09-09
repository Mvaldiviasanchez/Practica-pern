import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware.js";  // 👈 usa isAuth
import { updateAvatar } from "../controllers/users.controller.js";

const router = Router();

router.put("/users/me/avatar", isAuth, updateAvatar);

export default router;
