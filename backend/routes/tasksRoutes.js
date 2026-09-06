const express = require('express');
const router = express.Router();

const {
    getTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
} = require('../controllers/tasksController');

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTaskStatus);
router.delete('/:id', deleteTask);

module.exports = router;