const mongoose = require('mongoose');
const { PROJECT_STATUS } = require('../config/constants');

/**
 * Project Schema
 * Stores all project-related information
 */
const projectSchema = new mongoose.Schema({
  // Project title
  title: {
    type: String,
    required: true,
    trim: true,
  },

  // Project description
  description: {
    type: String,
    default: '',
  },

  // Technologies used in the project
  techStack: {
    type: [String],
    default: [],
  },

  // GitHub repository link
  githubLink: {
    type: String,
    default: '',
  },

  // Current project status
  status: {
    type: String,
    enum: Object.values(PROJECT_STATUS),
    default: PROJECT_STATUS.ACTIVE,
  },

  // Project owner
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Project creation date
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', projectSchema);