import api from './api';

/**
 * Register a new user.
 * @param {Object} data - User registration payload
 * @returns {Promise<Object>} Response data from the API
 */
export const registerUser = async (data) => {
  return await api.post('/auth/register', data);
};

/**
 * Login an existing user.
 * @param {Object} data - User login payload
 * @returns {Promise<Object>} Response data from the API
 */
export const loginUser = async (data) => {
  return await api.post('/auth/login', data);
};

/**
 * Get the current authenticated user.
 * @returns {Promise<Object>} Response data from the API
 */
export const getMe = async () => {
  return await api.get('/auth/me');
};
