const pool = require('../db/pool');
const ALLOWED_STATUSES = ['new', 'in_progress', 'done'];

async function getTasks(req, res, next) {
    try {
        const result = await pool.query(
            'SELECT * FROM tasks ORDER BY created_at DESC'
        );
        res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
}


async function createTask(req, res, next) {
    try {
        const { title, description } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({
                error: 'Поле title не может быть пустым'
            });
        }

        const result = await pool.query(
            `INSERT INTO tasks (title, description)
             VALUES ($1, $2)
             RETURNING *`,
            [title.trim(), description || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}


async function updateTaskStatus(req, res, next) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if ( !ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                error: `Статус должен быть одним из: ${ALLOWED_STATUSES.join(',')}`, 
            });
        }
        const result = await pool.query(
            'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Задача не найдена'});
        }
        res.status(200).json(result.rows[0]);
    }   catch (error) {
        next(error);
    }
}


async function deleteTask(req, res, next) {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM tasks WHERE id = $1 RETURNING *',
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Задача не найдена'});
    }
    res.status(200).json({ message: 'Задача удалена', task: result.rows[0]});
    } catch (error) {
        next(error);
    }
}


module.exports = {
    getTasks,
    createTask,
    updateTaskStatus,
    deleteTask,
};