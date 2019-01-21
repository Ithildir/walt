const { LoggingWinston } = require('@google-cloud/logging-winston');
const winston = require('winston');
const { name, version } = require('../package.json');

const { LOG_LEVEL, NODE_ENV } = process.env;

const logger = winston.createLogger({
  level: LOG_LEVEL,
});

if (NODE_ENV === 'production') {
  logger.add(
    new LoggingWinston({
      serviceContext: {
        service: name,
        version,
      },
    }),
  );
} else {
  logger.add(new winston.transports.Console());
}

module.exports = logger;
