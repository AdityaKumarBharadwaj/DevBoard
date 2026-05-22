const Note = require('../models/Note');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

const getNotesByProject = async (req, res) => {
  try {
    const notes = await Note.find({ projectId: req.params.projectId }).sort({ updatedAt: -1 });
    return sendSuccess(res, notes);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const createNote = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return sendError(res, 'Title is required', 400);
    }

    const note = await Note.create({
      ...req.body,
      projectId: req.params.projectId,
    });

    return sendSuccess(res, note, 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const updateNote = async (req, res) => {
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        markdownContent: req.body.markdownContent,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return sendError(res, 'Note not found', 404);
    }

    return sendSuccess(res, updatedNote);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return sendError(res, 'Note not found', 404);
    }

    await note.deleteOne();
    return sendSuccess(res, { message: 'Note deleted' });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getNotesByProject,
  createNote,
  updateNote,
  deleteNote,
};
