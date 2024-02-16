const logger = require('../utils/logger');

const requestLoggerMiddleware = (req, res, next) => {
    logger.info(`URL: ${req.originalUrl}`);
    logger.info(`Método: ${req.method}`);

    if (req.body && Object.keys(req.body).length > 0) {
        logger.info(`Cuerpo de la solicitud: ${JSON.stringify(req.body)}`);
    }

    if (req.params && Object.keys(req.params).length > 0) {
        logger.info(`Parámetros de la ruta: ${JSON.stringify(req.params)}`);
    }

    if (req.query && Object.keys(req.query).length > 0) {
        logger.info(`Parámetros de la consulta: ${JSON.stringify(req.query)}`);
    }

    next();
};

module.exports = {
    requestLoggerMiddleware
};
