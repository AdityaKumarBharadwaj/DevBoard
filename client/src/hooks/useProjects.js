import { useState, useEffect, useCallback } from 'react';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../services/projectService';

/**
 * Custom hook for managing project state and operations
 * @returns {Object} Projects state and CRUD operations
 */
export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Fetch all projects
  
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProjects();
      setProjects(response.data || []);
    } catch (err) {
      setError(err || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const addProject = useCallback(async (data) => {
    try {
      const response = await createProject(data);
      const newProject = response.data;
      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    } catch (err) {
      throw err || 'Failed to create project';
    }
  }, []);

  
  // Update an existing project
  
  const editProject = useCallback(async (id, data) => {
    try {
      const response = await updateProject(id, data);
      const updatedProject = response.data;
      setProjects((prev) =>
        prev.map((project) =>
          project.id === id || project._id === id ? updatedProject : project
        )
      );
      return updatedProject;
    } catch (err) {
      throw err || 'Failed to update project';
    }
  }, []);

  
  // Delete a project
   
  // src/hooks/useProjects.js
const removeProject = useCallback(async (id) => {
  // 1. Optimistically remove the project from the UI state immediately
  setProjects((prev) => prev.filter((project) => project.id !== id && project._id !== id));

  try {
    // 2. Perform the API deletion in the background
    await deleteProject(id);
  } catch (err) {
    console.error('Failed to delete project on the backend:', err);
    
    // Optional: If you want to rollback the UI on failure, you could refetch projects here
    // fetchProjects(); 
    
    throw err || 'Failed to delete project';
  }
}, []);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    editProject,
    removeProject,
  };
}
