// src/libs/mailer.js

// 1) Cargar variables de entorno aquí también
import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE,
  APP_NAME = "ORDENAT",
} = process.env;

// Opcional: ver en consola qué se está leyendo
console.log("SMTP CONFIG:", {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_SECURE,
});

// 2) Configurar transporter de Nodemailer
export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT) || 587,
  secure: SMTP_SECURE === "true", // false para 587, true para 465
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// 3) Función genérica para enviar correo
export async function sendMail({ to, subject, html }) {
  const info = await transporter.sendMail({
    from: `"${APP_NAME}" <${SMTP_USER}>`,
    to,
    subject,
    html,
  });

  console.log("📨 Email enviado:", info.messageId);
  return info;
}

// 4) Función específica de prueba
export async function sendTestEmail() {
  const to = SMTP_USER; // te manda el correo a ti mismo
  const subject = "Prueba de correo desde ORDENAT";
  const html = `
    <h2>${APP_NAME} - Prueba de correo</h2>
    <p>Si ves este mensaje, el SMTP está funcionando correctamente 🎉</p>
  `;

  return sendMail({ to, subject, html });
}
