const express = require('express');
const router = express.Router();
const { getTasksByProject, createTask, updateTask, deleteTask, updateTaskOrder } = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:projectId', getTasksByProject);
router.post('/:projectId', createTask);
router.patch('/reorder', updateTaskOrder);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
