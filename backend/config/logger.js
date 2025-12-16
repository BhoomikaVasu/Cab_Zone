const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'dl-extraction-service' },
    transports: [
        // Write all logs with level 'error' and below to error.log
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // Write all logs to combined.log
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// If not in production, also log to console with simple format
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

module.exports = logger;
