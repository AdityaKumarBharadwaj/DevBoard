const express = require('express');
const router = express.Router();
const { getSprintsByProject, createSprint, updateSprint, deleteSprint } = require('../controllers/sprintController');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:projectId', getSprintsByProject);
router.post('/:projectId', createSprint);
router.put('/:id', updateSprint);
router.delete('/:id', deleteSprint);

module.exports = router;
