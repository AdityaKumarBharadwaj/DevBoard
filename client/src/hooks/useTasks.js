/**
 * useTasks Custom Hook
 * ============================================================================
 * Manages full lifecycle and state for tasks belonging to a specific project.
 * Handles fetching, creating, editing, deleting, optimistic UI reordering,
 * and background persistence with the backend API.
 * 
 * Performance Note:
 * All action dispatchers are memoized using `useCallback` to ensure stable function
 * references across renders, preventing unwanted re-rendering cascades down the
 * component tree (KanbanBoard -> KanbanColumn -> TaskCard).
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from '../services/taskService';

/**
 * Custom hook to manage Kanban tasks for a project.
 * 
 * @param {string} projectId - The ID of the project whose tasks are being managed.
 * @returns {Object} Task state and handler functions.
 * @property {Array<Object>} tasks - Array of task objects.
 * @property {boolean} loading - Indicates if tasks are currently being fetched.
 * @property {string|null} error - Error message if a fetch or operation failed.
 * @property {Function} fetchTasks - Triggers a re-fetch of tasks from the backend.
 * @property {Function} addTask - Creates a new task and appends it to state.
 * @property {Function} editTask - Updates an existing task and updates local state.
 * @property {Function} removeTask - Deletes a task by ID and removes it from state.
 * @property {Function} reorderTasksLocally - Optimistically updates tasks state for instant UI drag feedback.
 * @property {Function} syncTaskOrder - Persists reordered task sequences to the backend.
 */
export default function useTasks(projectId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all tasks for the specified project from the backend.
   */
  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getTasksByProject(projectId);
      setTasks(response.data || []);
    } catch (err) {
      setError(err || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /**
   * Create a new task within the current project.
   * 
   * @param {Object} data - Form data for the new task (title, status, priority, complexity, etc.)
   * @returns {Promise<Object>} The newly created task object.
   */
  const addTask = useCallback(
    async (data) => {
      if (!projectId) throw new Error('Project ID is required');
      try {
        const response = await createTask(projectId, data);
        const newTask = response.data;
        setTasks((prev) => [...prev, newTask]);
        return newTask;
      } catch (err) {
        throw err || 'Failed to create task';
      }
    },
    [projectId]
  );

  /**
   * Update an existing task by ID.
   * 
   * @param {string} id - The MongoDB ID of the task to update.
   * @param {Object} data - Updated task fields.
   * @returns {Promise<Object>} The updated task object.
   */
  const editTask = useCallback(async (id, data) => {
    try {
      const response = await updateTask(id, data);
      const updatedTask = response.data;
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      throw err || 'Failed to update task';
    }
  }, []);

  /**
   * Delete a task by ID and remove it from the local state.
   * 
   * @param {string} id - The MongoDB ID of the task to remove.
   * @returns {Promise<void>}
   */
  const removeTask = useCallback(async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      throw err || 'Failed to delete task';
    }
  }, []);

  /**
   * Optimistically reorders tasks in local state for instantaneous drag-and-drop UI feedback,
   * without waiting for backend confirmation.
   * 
   * @param {Array<Object>} updatedTasks - Complete task array with updated orders and statuses.
   */
  const reorderTasksLocally = useCallback((updatedTasks) => {
    setTasks(updatedTasks);
  }, []);

  /**
   * Asynchronously persists the reordered tasks sequence to the backend database.
   * 
   * @param {Array<{ _id: string, order: number, status: string }>} orderedTasks - Array of minimal task updates.
   * @returns {Promise<void>}
   */
  const syncTaskOrder = useCallback(async (orderedTasks) => {
    try {
      await reorderTasks(orderedTasks);
    } catch (err) {
      throw err || 'Failed to sync task order';
    }
  }, []);

  // Automatically fetch tasks on mount or when the projectId changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    reorderTasksLocally,
    syncTaskOrder,
  };
}
