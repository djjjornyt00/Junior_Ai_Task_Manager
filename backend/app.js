const express = require('express');
const cors = require('cors');

const tasksRoutes = require('./routes/tasksRoutes');
const errorHandler = require('./middleware/errorHandler');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/tasks', tasksRoutes);
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});
app.use(errorHandler);

module.exports = app;