const winston = require('winston');

// Configuración básica de winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logfile.log' }),
    ],
});

// Funciones de logger
const info = message => logger.info(message);
const warn = message => logger.warn(message);
const error = message => logger.error(message);

module.exports = {
    info,
    warn,
    error,
};
