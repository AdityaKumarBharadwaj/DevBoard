import api from './api';

/**
 * Get all projects for the authenticated user.
 * @returns {Promise<Object>} Response data from the API
 */
export const getProjects = async () => {
  return await api.get('/projects');
};

/**
 * Create a new project.
 * @param {Object} data - Project payload
 * @returns {Promise<Object>} Response data from the API
 */
export const createProject = async (data) => {
  return await api.post('/projects', data);
};

/**
 * Update an existing project.
 * @param {string} id - Project ID
 * @param {Object} data - Updated project payload
 * @returns {Promise<Object>} Response data from the API
 */
export const updateProject = async (id, data) => {
  return await api.put(`/projects/${id}`, data);
};

/**
 * Delete a project.
 * @param {string} id - Project ID
 * @returns {Promise<Object>} Response data from the API
 */
export const deleteProject = async (id) => {
  return await api.delete(`/projects/${id}`);
};
