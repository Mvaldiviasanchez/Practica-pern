import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import taskRoutes from "./routes/tasks.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { ORIGIN } from "./config.js";
import { pool } from "./db.js";
import usersRoutes from "./routes/users.routes.js";
import { sendTestEmail } from "./libs/mailer.js";

const app = express();

// Middlewares
app.use(cors({
    origin: ORIGIN,
    credentials: true
}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 👇 ***IMPORTANTE***
// Servir archivos estáticos desde la carpeta "uploads"
// para poder mostrar PDFs en el frontend
app.use("/uploads", express.static("uploads"));

// Routes
app.get('/', (req, res) => res.json({ message: 'Welcome to my API' }));
app.get('/api/ping', async (req, res) => {
    const result = await pool.query('SELECT NOW()');
    return res.json(result.rows[0]);
});

app.use("/api", usersRoutes);
app.use('/api', taskRoutes);
app.use('/api', authRoutes);

// Error Handler
app.use((err, req, res, next) => {
    res.status(500).json({
        status: "error",
        message: err.message
    });
});

// TEST: enviar correo para verificar SMTP
app.get("/api/test-email", async (req, res) => {
  try {
    await sendTestEmail();
    res.json({ message: "Correo de prueba enviado correctamente" });
  } catch (err) {
    console.error("Error enviando correo de prueba:", err);
    res.status(500).json({ error: "No se pudo enviar el correo", details: err.message });
  }
});

export default app;
