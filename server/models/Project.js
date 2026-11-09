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
    enum: Object.values(PROJECT_STATUS),         // Object.values() is a built-in JavaScript method that takes an object and returns an array containing all its values
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
    default: Date.now,        // Date.now() returns the current date and time as a number of milliseconds since January 1, 1970 (UTC).
  },
});

module.exports = mongoose.model('Project', projectSchema);




// "Yes, the owner field in the Project schema specifically stores the _id of the User who created the project.
// It serves two primary purposes:
// Data Ownership & Access Control: It ensures that only the authenticated owner can modify or delete the project (project.owner.equals(req.user._id)).
// User-specific Querying: It allows us to easily fetch all projects belonging to the logged-in user using Project.find({ owner: req.user._id })."