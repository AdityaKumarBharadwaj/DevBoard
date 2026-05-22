const mongoose = require('mongoose');
const { TASK_STATUS, COMPLEXITY, PRIORITY } = require('../config/constants');

/**
 * Task Schema
 * Stores all task-related information
 */
const taskSchema = new mongoose.Schema({
  // Task title
  title: {
    type: String,
    required: true,
    trim: true,
  },

  // Task description
  description: {
    type: String,
    default: '',
  },

  // Current task status
  status: {
    type: String,
    enum: Object.values(TASK_STATUS),
    default: TASK_STATUS.BACKLOG,
  },

  // Task complexity level
  complexity: {
    type: String,
    enum: Object.values(COMPLEXITY),
    default: null,
  },

  // Task priority
  priority: {
    type: String,
    enum: Object.values(PRIORITY),
    default: PRIORITY.MEDIUM,
  },

  // Estimated completion time in hours
  estimatedHours: {
    type: Number,
    min: 0,
    default: 0,
  },

  // Task deadline
  dueDate: {
    type: Date,
    default: null,
  },

  // Related sprint
  sprintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sprint',
    default: null,
  },

  // Related project
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },

  // Task order in list
  order: {
    type: Number,
    default: 0,
  },

  // Task labels/tags
  labels: {
    type: [String],
    default: [],
  },

  // Attached file paths
  attachments: {
    type: [String],
    default: [],
  },

  // Task creation date
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Task', taskSchema);