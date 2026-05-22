const mongoose = require('mongoose');

/**
 * Sprint Schema
 * Stores sprint-related information
 */
const sprintSchema = new mongoose.Schema({
  // Sprint name
  name: {
    type: String,
    required: true,
    trim: true,
  },

  // Sprint goal/objective
  goal: {
    type: String,
    default: '',
  },

  // Sprint start date
  startDate: {
    type: Date,
    required: true,
  },

  // Sprint end date
  endDate: {
    type: Date,
    required: true,
  },

  // Related project
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },

  // Checks if sprint is active
  isActive: {
    type: Boolean,
    default: false,
  },

  // Sprint creation date
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Before saving:
 * If current sprint becomes active,
 * deactivate all other sprints
 * in the same project
 */
sprintSchema.pre('save', async function () {
  if (this.isActive) {
    await mongoose.model('Sprint').updateMany(
      {
        projectId: this.projectId,
        _id: { $ne: this._id },
      },
      { isActive: false }
    );
  }
});

module.exports = mongoose.model('Sprint', sprintSchema);