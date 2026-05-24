import api from './api';

/**
 * Get sprints for a given project.
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Response data from the API
 */
export const getSprintsByProject = async (projectId) => {
  return await api.get(`/sprints/${projectId}`);
};

/**
 * Create a sprint for a project.
 * @param {string} projectId - Project ID
 * @param {Object} data - Sprint payload
 * @returns {Promise<Object>} Response data from the API
 */
export const createSprint = async (projectId, data) => {
  return await api.post(`/sprints/${projectId}`, data);
};

/**
 * Update a sprint by ID.
 * @param {string} id - Sprint ID
 * @param {Object} data - Updated sprint payload
 * @returns {Promise<Object>} Response data from the API
 */
export const updateSprint = async (id, data) => {
  return await api.put(`/sprints/${id}`, data);
};

/**
 * Delete a sprint by ID.
 * @param {string} id - Sprint ID
 * @returns {Promise<Object>} Response data from the API
 */
export const deleteSprint = async (id) => {
  return await api.delete(`/sprints/${id}`);
};
