import api from './api';

/**
 * Get tasks for a given project.
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Response data from the API
 */
export const getTasksByProject = async (projectId) => {
  return await api.get(`/tasks/${projectId}`);
};

/**
 * Create a task within a project.
 * @param {string} projectId - Project ID
 * @param {Object} data - Task payload
 * @returns {Promise<Object>} Response data from the API
 */
export const createTask = async (projectId, data) => {
  return await api.post(`/tasks/${projectId}`, data);
};

/**
 * Update a task by ID.
 * @param {string} id - Task ID
 * @param {Object} data - Updated task payload
 * @returns {Promise<Object>} Response data from the API
 */
export const updateTask = async (id, data) => {
  return await api.put(`/tasks/${id}`, data);
};

/**
 * Delete a task by ID.
 * @param {string} id - Task ID
 * @returns {Promise<Object>} Response data from the API
 */
export const deleteTask = async (id) => {
  return await api.delete(`/tasks/${id}`);
};

/**
 * Reorder multiple tasks.
 * @param {Array<Object>} tasks - Array of task objects with _id, order, and status
 * @returns {Promise<Object>} Response data from the API
 */
export const reorderTasks = async (tasks) => {
  return await api.patch('/tasks/reorder', { tasks });
};
