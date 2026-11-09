import api from './api';

export const getTasksByProject = async (projectId) => {
  return await api.get(`/tasks/${projectId}`);
};

export const createTask = async (projectId, data) => {
  return await api.post(`/tasks/${projectId}`, data);
};

export const updateTask = async (id, data) => {
  return await api.put(`/tasks/${id}`, data);
};

export const deleteTask = async (id) => {
  return await api.delete(`/tasks/${id}`);
};

export const reorderTasks = async (tasks) => {
  return await api.patch('/tasks/reorder', { tasks });
};