const express = require('express');
const router = express.Router();
const { getNotesByProject, createNote, updateNote, deleteNote } = require('../controllers/noteController');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:projectId', getNotesByProject);
router.post('/:projectId', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
