import api from './api';

/**
 * Get notes for a given project.
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Response data from the API
 */
export const getNotesByProject = async (projectId) => {
  return await api.get(`/notes/${projectId}`);
};

/**
 * Create a note for a project.
 * @param {string} projectId - Project ID
 * @param {Object} data - Note payload
 * @returns {Promise<Object>} Response data from the API
 */
export const createNote = async (projectId, data) => {
  return await api.post(`/notes/${projectId}`, data);
};

/**
 * Update a note by ID.
 * @param {string} id - Note ID
 * @param {Object} data - Updated note payload
 * @returns {Promise<Object>} Response data from the API
 */
export const updateNote = async (id, data) => {
  return await api.put(`/notes/${id}`, data);
};

/**
 * Delete a note by ID.
 * @param {string} id - Note ID
 * @returns {Promise<Object>} Response data from the API
 */
export const deleteNote = async (id) => {
  return await api.delete(`/notes/${id}`);
};
