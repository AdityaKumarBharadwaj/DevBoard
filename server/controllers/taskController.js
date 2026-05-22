const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

/**
 * Get tasks for a project, sorted by order ascending.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId }).sort({ order: 1 });
    return sendSuccess(res, tasks);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/**
 * Create a new task inside the specified project.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createTask = async (req, res) => {
  try {
    const taskCount = await Task.countDocuments({ projectId: req.params.projectId });
    const task = await Task.create({
      ...req.body,
      projectId: req.params.projectId,
      order: taskCount + 1,
    });
    return sendSuccess(res, task, 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/**
 * Update a task by id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return sendSuccess(res, updatedTask);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/**
 * Delete a task by id.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return sendError(res, 'Task not found', 404);
    }

    await task.deleteOne();
    return sendSuccess(res, { message: 'Task deleted' });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

/**
 * Update task order and status for multiple tasks.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateTaskOrder = async (req, res) => {
  try {
    const { tasks } = req.body;
    if (!Array.isArray(tasks)) {
      return sendError(res, 'Tasks array is required', 400);
    }

    await Promise.all(
      tasks.map((task) =>
        Task.findByIdAndUpdate(
          task._id,
          { order: task.order, status: task.status },
          { new: true, runValidators: true }
        )
      )
    );

    return sendSuccess(res, { message: 'Order updated' });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  updateTaskOrder,
};
