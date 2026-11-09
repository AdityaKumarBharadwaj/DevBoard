/**
 * useProjects Custom Hook
 * ============================================================================
 * Manages state and asynchronous operations for the user's projects.
 * Supports fetching projects, creating projects, updating metadata, and
 * optimistic deletion.
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../services/projectService';

/**
 * Custom hook to manage project state and CRUD operations.
 * 
 * @returns {Object} Projects state and action handlers.
 * @property {Array<Object>} projects - List of project objects.
 * @property {boolean} loading - Loading indicator for fetch operations.
 * @property {string|null} error - Error message if an operation failed.
 * @property {Function} fetchProjects - Fetches all projects from the API.
 * @property {Function} addProject - Creates a new project and prepends it to state.
 * @property {Function} editProject - Updates an existing project and updates state.
 * @property {Function} removeProject - Optimistically removes a project and calls delete API.
 */
export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all projects belonging to the authenticated user.
   */
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

  /**
   * Create a new project and add it to the beginning of the list.
   * Returns the newly created project object so caller components can immediately
   * access fields (e.g. newly generated _id for immediate routing/redirection)
   * without waiting for the subsequent React render cycle.
   * 
   * @param {Object} data - Project data payload (title, description, techStack, etc.)
   * @returns {Promise<Object>} Newly created project object.
   */
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

  /**
   * Update an existing project's metadata.
   * 
   * @param {string} id - Project ID.
   * @param {Object} data - Updated project fields.
   * @returns {Promise<Object>} Updated project object.
   */
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

  /**
   * Delete a project.
   * Applies an optimistic UI update by filtering the target project out of local state
   * immediately, then sends the DELETE request to the backend.
   * 
   * @param {string} id - Project ID to delete.
   * @returns {Promise<void>}
   */
  const removeProject = useCallback(async (id) => {
    // Optimistically remove the project from the UI state immediately
    setProjects((prev) => prev.filter((project) => project.id !== id && project._id !== id));

    try {
      // Execute the API deletion in the background
      await deleteProject(id);
    } catch (err) {
      console.error('Failed to delete project on the backend:', err);
      throw err || 'Failed to delete project';
    }
  }, []);

  // Fetch projects on initial mount
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
