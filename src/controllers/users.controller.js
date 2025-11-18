// src/controllers/users.controller.js
import { pool } from "../db.js";

// --- ACTUALIZAR AVATAR (ya lo tenías) ---
export const updateAvatar = async (req, res) => {
  try {
    const { avatar_url } = req.body;
    if (!avatar_url || typeof avatar_url !== "string") {
      return res.status(400).json(["URL de avatar inválida"]);
    }

    const result = await pool.query(
      `UPDATE users 
       SET avatar_url = $1 
       WHERE id = $2 
       RETURNING id, name, email, avatar_url, created_at`,
      [avatar_url, req.userId]
    );

    if (result.rowCount === 0)
      return res.status(404).json(["Usuario no encontrado"]);

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json(["Error actualizando avatar"]);
  }
};

// --- NUEVO: ACTUALIZAR CORREO ---
export const updateUserEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json(["Correo inválido"]);
    }

    const result = await pool.query(
      `UPDATE users
       SET email = $1
       WHERE id = $2
       RETURNING id, name, email, avatar_url, created_at`,
      [email, req.userId]
    );

    if (result.rowCount === 0)
      return res.status(404).json(["Usuario no encontrado"]);

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    // Código de Postgres para violación de UNIQUE
    if (err.code === "23505") {
      return res.status(409).json(["Ese correo ya está en uso por otro usuario"]);
    }

    return res.status(500).json(["Error actualizando correo"]);
  }
};
