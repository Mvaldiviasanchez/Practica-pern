// src/libs/reminderScheduler.js
import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import { pool } from "../db.js";
import { sendMail } from "./mailer.js";

const APP_NAME = process.env.APP_NAME || "ORDENAT";
const APP_URL = process.env.APP_URL || "http://localhost:5173";

// Función que busca tareas con recordatorio pendiente y envía correos
async function processPendingReminders() {
  try {
    const query = `
      SELECT 
        t.id, 
        t.title, 
        t.description, 
        t.reminder_at,
        t.attachment_path,
        t.attachment_name,
        t.attachment_mime,
        u.email
      FROM task t
      JOIN users u ON u.id = t.user_id
      WHERE t.reminder_at IS NOT NULL
        AND t.reminder_sent = false
        AND t.reminder_at <= NOW()
        AND t.reminder_at >= NOW() - INTERVAL '10 minutes'
    `;

    const result = await pool.query(query);
    const tasks = result.rows;

    if (tasks.length === 0) return;

    console.log(`🔔 Recordatorios pendientes: ${tasks.length}`);

    for (const task of tasks) {
      const subject = `Recordatorio de tarea: ${task.title}`;

      const html = `
        <h2>${APP_NAME} - Recordatorio de tarea</h2>
        <p><strong>Título:</strong> ${task.title}</p>
        <p><strong>Descripción:</strong> ${task.description || "Sin descripción"}</p>
        <p><strong>Fecha y hora del recordatorio:</strong> ${
          new Date(task.reminder_at).toLocaleString("es-CL")
        }</p>

        ${
          task.attachment_name
            ? `<p><strong>Adjunto:</strong> ${task.attachment_name}</p>`
            : ""
        }

        <p style="margin-top: 20px">
          <a href="${APP_URL}"
            style="
              padding: 10px 18px;
              background: #4f46e5;
              color: white;
              border-radius: 6px;
              text-decoration: none;
              font-weight: bold;
            ">
            Ir a la plataforma
          </a>
        </p>
      `;

      // 👇 Si la tarea tiene archivo adjunto, lo añadimos al correo
      const attachments =
        task.attachment_path && task.attachment_name
          ? [
              {
                filename: task.attachment_name,
                path: task.attachment_path,
              },
            ]
          : [];

      try {
        await sendMail({
          to: task.email,
          subject,
          html,
          attachments,
        });

        // Marcar la tarea como ya notificada
        await pool.query(
          "UPDATE task SET reminder_sent = true WHERE id = $1",
          [task.id]
        );

        console.log(`✅ Recordatorio enviado para tarea ${task.id}`);
      } catch (err) {
        console.error(
          `❌ Error enviando recordatorio para tarea ${task.id}:`,
          err.message
        );
      }
    }
  } catch (err) {
    console.error("❌ Error en processPendingReminders:", err.message);
  }
}

// Inicia el cron (cada minuto)
export function startReminderScheduler() {
  console.log("⏱️ Iniciando scheduler de recordatorios (cada 1 minuto)");

  cron.schedule("* * * * *", () => {
    processPendingReminders();
  });
}
