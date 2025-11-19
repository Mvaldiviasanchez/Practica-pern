// src/controllers/tasks.controller.js
import { pool } from '../db.js';
import fs from 'fs'; // 👈 NUEVO para borrar archivo viejo opcionalmente

export const getAllTasks = async (req, res, next) => {
  console.log(req.userId);

  try {
    const result = await pool.query(
      'SELECT * FROM task WHERE user_id = $1',
      [req.userId]
    );
    return res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM task WHERE id = $1',
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'No existe una tarea con ese id',
      });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// 👇 createTask SOPORTA ARCHIVO ADJUNTO
export const createTask = async (req, res, next) => {
  const { title, description, category, reminder_at } = req.body;

  // Archivo subido por multer (puede ser undefined si no se envía archivo)
  const file = req.file;

  const attachment_path = file ? file.path : null;
  const attachment_name = file ? file.originalname : null;
  const attachment_mime = file ? file.mimetype : null;

  try {
    const result = await pool.query(
      `INSERT INTO task (
         title, 
         description, 
         category, 
         reminder_at, 
         user_id,
         attachment_path,
         attachment_name,
         attachment_mime
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        title,
        description,
        category,
        reminder_at || null,
        req.userId,
        attachment_path,
        attachment_name,
        attachment_mime,
      ]
    );

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(409).json({
        message: 'Ya existe una tarea con ese título',
      });
    }
    next(error);
  }
};

// 👇 updateTask AHORA TAMBIÉN PUEDE CAMBIAR EL PDF
export const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, category, reminder_at } = req.body;

  const newReminderAt = reminder_at || null;

  // posible archivo nuevo
  const file = req.file;
  const attachment_path = file ? file.path : null;
  const attachment_name = file ? file.originalname : null;
  const attachment_mime = file ? file.mimetype : null;

  try {
    // 1) Traer la tarea actual para saber si tenía archivo viejo
    const current = await pool.query(
      'SELECT attachment_path FROM task WHERE id = $1',
      [id]
    );

    if (current.rowCount === 0) {
      return res.status(404).json({
        message: 'No existe una tarea con ese id',
      });
    }

    const oldAttachmentPath = current.rows[0].attachment_path;

    // 2) Actualizar tarea
    // - Si NO llega archivo nuevo, se mantienen los attachment_*
    // - Si llega archivo nuevo, se reemplazan
    const result = await pool.query(
      `UPDATE task
       SET title = $1,
           description = $2,
           category = $3,
           -- 👇 solo reseteamos reminder_sent si la fecha cambió
           reminder_sent = CASE
             WHEN reminder_at IS DISTINCT FROM $4 THEN false
             ELSE reminder_sent
           END,
           reminder_at = $4,
           attachment_path = COALESCE($5, attachment_path),
           attachment_name = COALESCE($6, attachment_name),
           attachment_mime = COALESCE($7, attachment_mime)
       WHERE id = $8
       RETURNING *`,
      [
        title,
        description,
        category,
        newReminderAt,
        attachment_path,
        attachment_name,
        attachment_mime,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'No existe una tarea con ese id',
      });
    }

    // 3) Si llegó un archivo nuevo, borrar el anterior del disco (opcional)
    if (file && oldAttachmentPath && oldAttachmentPath !== attachment_path) {
      fs.unlink(oldAttachmentPath, (err) => {
        if (err) {
          console.error('Error borrando archivo viejo:', err);
        }
      });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM task WHERE id = $1',
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: 'No existe una tarea con ese id',
      });
    }

    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
