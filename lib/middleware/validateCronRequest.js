const HTTPError = require('node-http-error');

function validateCronRequest(req, res, next) {
  if (req.get('X-Appengine-Cron') !== 'true' || req.ip !== '10.0.0.1') {
    throw new HTTPError(403);
  }

  next();
}

module.exports = validateCronRequest;
