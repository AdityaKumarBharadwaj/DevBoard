const mongoose = require('mongoose');

/**
 * Note Schema
 * Stores project notes in markdown format
 */
const noteSchema = new mongoose.Schema({
  // Note title
  title: {
    type: String,
    required: true,
    trim: true,
  },

  // Markdown content
  markdownContent: {
    type: String,
    default: '',
  },

  // Related project
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },

  // Note creation time
  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Last updated time
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Note', noteSchema);