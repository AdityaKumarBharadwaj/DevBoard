/**
 * Task Controller
 * ============================================================================
 * Handles CRUD operations and reordering logic for Kanban tasks within projects.
 * ============================================================================
 */

const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

/**
 * Retrieve all tasks associated with a specific project.
 * Tasks are sorted in ascending order by their `order` index so that Kanban cards
 * render in their precise drag-and-drop sequence.
 * 
 * @route GET /api/tasks/:projectId
 * @param {Object} req - Express request object containing projectId in req.params
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
 * Create a new task within a project.
 * Uses countDocuments() to determine the total number of existing tasks in the project
 * and sets the new task's position order to (count + 1), appending it to the bottom.
 * 
 * Note: countDocuments() runs efficiently directly on the database engine without
 * loading entire document payloads into server memory.
 * 
 * @route POST /api/tasks/:projectId
 * @param {Object} req - Express request object with task details in req.body
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
 * Update an existing task by its ID.
 * Returns the updated document and enforces schema validators on update.
 * 
 * @route PUT /api/tasks/:id
 * @param {Object} req - Express request object containing taskId in req.params and updates in req.body
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
 * Delete a task by its ID.
 * 
 * @route DELETE /api/tasks/:id
 * @param {Object} req - Express request object containing taskId in req.params
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
 * Reorder multiple tasks across or within columns in bulk.
 * 
 * Executes parallel database updates using Promise.all and Array.prototype.map().
 * Each entry updates only the `order` and `status` fields, ensuring efficient
 * synchronization after drag-and-drop operations on the frontend board.
 * 
 * @route PATCH /api/tasks/reorder
 * @param {Object} req - Express request object with array of { _id, order, status } in req.body.tasks
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
