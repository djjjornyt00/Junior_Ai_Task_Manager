function errorHandler(err, req, res, next) {
    console.error('Ошибка:', err.message);

    res.status(500).json({
        error: 'Внутренняя ошибка сервера',
    });
}

module.exports = errorHandler;