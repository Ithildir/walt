const winston = require('winston');

const { LOG_LEVEL = 'debug' } = process.env;

const logger = winston.createLogger({
  format: winston.format.simple(),
  level: LOG_LEVEL,
  transports: [new winston.transports.Console()],
});

module.exports = logger;
