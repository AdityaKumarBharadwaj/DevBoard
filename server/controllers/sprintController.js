const Sprint = require('../models/Sprint');
const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

/**
 * Get sprints for a project sorted by createdAt descending.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSprintsByProject = async (req, res) => {
  try {
    const sprints = await Sprint.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    return sendSuccess(res, sprints);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/**
 * Create a new sprint belonging to a project.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createSprint = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;

    if (!name || !startDate || !endDate) {
      return sendError(res, 'Name, startDate, and endDate are required', 400);
    }

    const sprint = await Sprint.create({
      ...req.body,
      projectId: req.params.projectId,
    });

    return sendSuccess(res, sprint, 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/**
 * Update a sprint by id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateSprint = async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return sendError(res, 'Sprint not found', 404);
    }

    Object.assign(sprint, req.body);
    const updatedSprint = await sprint.save();
    return sendSuccess(res, updatedSprint);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/**
 * Delete a sprint by id and unset sprintId on related tasks.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteSprint = async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (!sprint) {
      return sendError(res, 'Sprint not found', 404);
    }

    await sprint.deleteOne();
    await Task.updateMany({ sprintId: req.params.id }, { $unset: { sprintId: '' } });

    return sendSuccess(res, { message: 'Sprint deleted' });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getSprintsByProject,
  createSprint,
  updateSprint,
  deleteSprint,
};
