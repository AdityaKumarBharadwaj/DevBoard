const Project = require('../models/Project');
const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/responseHelpers');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });

    const projectsWithCounts = await Promise.all(
      projects.map(async (project) => {
        const taskCount = await Task.countDocuments({ projectId: project._id });
        return {
          ...project.toObject(),
          taskCount,
        };
      })
    );

    return sendSuccess(res, projectsWithCounts);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, status } = req.body;

    if (!title) {
      return sendError(res, 'Title is required', 400);
    }

    const project = await Project.create({
      title,
      description,
      techStack,
      githubLink,
      status,
      owner: req.user._id,
    });

    return sendSuccess(res, project, 201);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};


const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized', 403);
    }

    Object.assign(project, req.body);
    const updatedProject = await project.save();

    return sendSuccess(res, updatedProject);
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return sendError(res, 'Project not found', 404);
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return sendError(res, 'Not authorized', 403);
    }
    await project.deleteOne();
    await Task.deleteMany({ projectId: req.params.id });

    return sendSuccess(res, { message: 'Project and all related data deleted' });
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
