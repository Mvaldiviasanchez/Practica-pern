import PropTypes from "prop-types";
import { createContext, useState, useContext } from "react";
import {
  getAllTasksRequest,
  deleteTaskRequest,
  createTaskRequest,
  getTaskRequest,
  updateTaskRequest,
} from "../api/tasks.api";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks debe estar dentro del proveedor TaskProvider");
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [errors, setError] = useState([]);

  const loadTasks = async () => {
    try {
      const res = await getAllTasksRequest();
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadTask = async (id) => {
    try {
      const res = await getTaskRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const createTask = async (task) => {
    try {
      const res = await createTaskRequest(task);
      setTasks([...tasks, res.data]);
      return res.data;
    } catch (error) {
      if (error.response) {
        setError([error.response.data.message]);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await deleteTaskRequest(id);
      if (res.status === 204) {
        setTasks(tasks.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const res = await updateTaskRequest(id, updatedTask);
      setTasks(tasks.map((task) => (task.id === id ? res.data : task)));
      return res.data;
    } catch (error) {
      if (error.response) {
        setError([error.response.data.message]);
      }
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loadTasks,
        loadTask,
        createTask,
        deleteTask,
        updateTask,
        errors,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

TaskProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
