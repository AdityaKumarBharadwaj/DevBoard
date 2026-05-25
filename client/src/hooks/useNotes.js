import { useState, useEffect, useCallback } from 'react';
import {
  getNotesByProject,
  createNote,
  updateNote,
  deleteNote,
} from '../services/noteService';

/**
 * Custom hook for managing notes in a project.
 * @param {string} projectId - The project ID to load notes for
 * @returns {Object} Notes state and operations
 */
export default function useNotes(projectId) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch project notes from the backend.
   */
  const fetchNotes = useCallback(async () => {
    if (!projectId) {
      setNotes([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getNotesByProject(projectId);
      setNotes(response.data || []);
    } catch (err) {
      setError(err || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /**
   * Create a new note for the project.
   * @param {Object} data - Note payload
   * @returns {Object} Created note
   */
  const addNote = useCallback(
    async (data) => {
      if (!projectId) throw new Error('Project ID is required');
      try {
        const response = await createNote(projectId, data);
        const newNote = response.data;
        setNotes((prev) => [...prev, newNote]);
        return newNote;
      } catch (err) {
        throw err || 'Failed to create note';
      }
    },
    [projectId]
  );

  /**
   * Update an existing note.
   * @param {string} id - Note ID
   * @param {Object} data - Updated note payload
   * @returns {Object} Updated note
   */
  const editNote = useCallback(async (id, data) => {
    try {
      const response = await updateNote(id, data);
      const updatedNote = response.data;
      setNotes((prev) => prev.map((item) => (item._id === id ? updatedNote : item)));
      return updatedNote;
    } catch (err) {
      throw err || 'Failed to update note';
    }
  }, []);

  /**
   * Remove a note from the project.
   * @param {string} id - Note ID
   */
  const removeNote = useCallback(async (id) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      throw err || 'Failed to delete note';
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    addNote,
    editNote,
    removeNote,
  };
}
