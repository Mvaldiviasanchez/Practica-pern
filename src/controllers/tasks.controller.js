import { pool } from '../db.js';

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

export const createTask = async (req, res, next) => {
  const { title, description, category, reminder_at } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO task (title, description, category, reminder_at, user_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, category, reminder_at || null, req.userId]
    );

    return res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        message: 'Ya existe una tarea con ese título',
      });
    }
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, category, reminder_at } = req.body;

  // Usamos una sola variable para lo que enviaremos a la BD
  const newReminderAt = reminder_at || null;

  try {
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
           reminder_at = $4
       WHERE id = $5
       RETURNING *`,
      [title, description, category, newReminderAt, id]
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
