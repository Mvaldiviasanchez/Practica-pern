import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { PORT } from "./config.js";
import { startReminderScheduler } from "./libs/reminderScheduler.js";

app.listen(PORT, () => {
  console.log("Server on port", PORT);

  // Iniciar el scheduler después de levantar el server
  startReminderScheduler();
});
