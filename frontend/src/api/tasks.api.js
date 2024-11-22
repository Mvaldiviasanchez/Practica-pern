import client from "./axios";

export const getAllTasksRequest = () => client.get('/tasks')
export const createTaskRequest = (task) => client.post('/tasks', task)
export const deleteTaskRequest = (id) => client.delete(`/tasks/${id}`)
export const getTaskRequest = (id) => client.get(`/tasks/${id}`)
export const updateTaskRequest = (id, task) => client.put(`/tasks/${id}`, task)