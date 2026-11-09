import api from './api';

// Get all projects for the authenticated user
export const getProjects = async () => {
  return await api.get('/projects');
};

// Create a new project
export const createProject = async (data) => {
  return await api.post('/projects', data);
};

// Update an existing project
export const updateProject = async (id, data) => {
  return await api.put(`/projects/${id}`, data);
};

// Delete a project.
export const deleteProject = async (id) => {
  return await api.delete(`/projects/${id}`);
};