import { useState, useEffect, useCallback } from 'react';
import {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from '../services/taskService';

/**
 * Custom hook for managing tasks within a project
 */
export default function useTasks(projectId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all tasks for the project
   * @async
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
   * Create a new task in the project
   * @param {Object} data - Task data (title, description, assignee, etc.)
   * @returns {Object} Created task
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
   * Update an existing task
   * @param {string} id - Task ID
   * @param {Object} data - Updated task data
   * @returns {Object} Updated task
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
   * Delete a task
   * @param {string} id - Task ID
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
   * Update task order locally (optimistic UI update for drag-and-drop)
   * @param {Array} updatedTasks - Reordered tasks array
   */
  const reorderTasksLocally = useCallback((updatedTasks) => {
    setTasks(updatedTasks);
  }, []);

  /**
   * Persist task order to backend
   * @param {Array} orderedTasks - Tasks in their new order
   */
  const syncTaskOrder = useCallback(async (orderedTasks) => {
    try {
      await reorderTasks(orderedTasks);
    } catch (err) {
      throw err || 'Failed to sync task order';
    }
  }, []);

  // Fetch tasks on mount and when projectId changes
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
