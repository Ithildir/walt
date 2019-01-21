const logger = require('../logger');

function handleErrors(err, req, res) {
  const message = err.message || 'Unexpected error';
  const status = err.status || 500;

  logger.error(message, err);

  res.sendStatus(status);
}

module.exports = handleErrors;
