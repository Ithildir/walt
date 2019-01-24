const HTTPError = require('node-http-error');

function authCron(req, res, next) {
  if (req.get('X-Appengine-Cron') !== 'true') {
    throw new HTTPError(403);
  }
  next();
}

module.exports = authCron;
