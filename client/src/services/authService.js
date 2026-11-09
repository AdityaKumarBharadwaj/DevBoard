import api from './api';

// Register a new user.
export const registerUser = async (data) => {
  return await api.post('/auth/register', data);
};

// Login an existing user.
export const loginUser = async (data) => {
  return await api.post('/auth/login', data);
};

// Get the current authenticated user.
export const getMe = async () => {
  return await api.get('/auth/me');
};