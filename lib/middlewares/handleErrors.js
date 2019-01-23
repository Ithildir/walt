const logger = require('../logger');

// eslint-disable-next-line no-unused-vars
function handleErrors(err, req, res, next) {
  const message = err.message || 'Unexpected error';
  const status = err.status || 500;

  logger.error(message, err);

  res.sendStatus(status);
}

module.exports = handleErrors;
