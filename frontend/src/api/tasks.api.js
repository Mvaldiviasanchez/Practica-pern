// src/api/tasks.api.js
import client from "./axios";

export const getAllTasksRequest = () => client.get("/tasks");

// Detectamos si es FormData (crear tarea CON archivo)
export const createTaskRequest = (task) => {
  const isFormData = task instanceof FormData;

  return client.post("/tasks", task, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data" }
      : undefined,
    withCredentials: true,
  });
};

export const deleteTaskRequest = (id) => client.delete(`/tasks/${id}`);

export const getTaskRequest = (id) => client.get(`/tasks/${id}`);

// EDITAR tarea → siempre JSON (por ahora sin archivo)
export const updateTaskRequest = (id, task) =>
  client.put(`/tasks/${id}`, task);
