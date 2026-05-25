import { useState, useEffect, useCallback } from 'react';
import {
  getSprintsByProject,
  createSprint,
  updateSprint,
  deleteSprint,
} from '../services/sprintService';

/*
 * Custom hook for managing sprints in a project.
 */
export default function useSprints(projectId) {
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /*
   * Fetch project sprints from the backend.
   */
  const fetchSprints = useCallback(async () => {
    if (!projectId) {
      setSprints([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getSprintsByProject(projectId);
      setSprints(response.data || []);
    } catch (err) {
      setError(err || 'Failed to fetch sprints');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /**
   * Create a new sprint.
   */
  const addSprint = useCallback(
    async (data) => {
      if (!projectId) throw new Error('Project ID is required');
      try {
        const response = await createSprint(projectId, data);
        const newSprint = response.data;
        setSprints((prev) => [...prev, newSprint]);
        return newSprint;
      } catch (err) {
        throw err || 'Failed to create sprint';
      }
    },
    [projectId]
  );

  /**
   * Update an existing sprint.
   */
  const editSprint = useCallback(async (id, data) => {
    try {
      const response = await updateSprint(id, data);
      const updatedSprint = response.data;
      setSprints((prev) => prev.map((item) => (item._id === id ? updatedSprint : item)));
      return updatedSprint;
    } catch (err) {
      throw err || 'Failed to update sprint';
    }
  }, []);

  /**
   * Delete a sprint.
   */
  const removeSprint = useCallback(async (id) => {
    try {
      await deleteSprint(id);
      setSprints((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      throw err || 'Failed to delete sprint';
    }
  }, []);

  /**
   * Activate a sprint and deactivate all others.
   */
  const activateSprint = useCallback(
    async (id) => {
      try {
        await editSprint(id, { isActive: true });
        setSprints((prev) => prev.map((item) => ({
          ...item,
          isActive: item._id === id,
        })));
      } catch (err) {
        throw err || 'Failed to activate sprint';
      }
    },
    [editSprint]
  );

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  return {
    sprints,
    loading,
    error,
    fetchSprints,
    addSprint,
    editSprint,
    removeSprint,
    activateSprint,
  };
}
