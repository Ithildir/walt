/* eslint-disable no-underscore-dangle */
const onFinished = require('on-finished');
const instrumentation = require('../instrumentation');

function handleInstrumentation(req, res, next) {
  /* istanbul ignore else */
  if (!req._startTime) {
    req._startTime = Date.now();
  }

  onFinished(res, () => {
    instrumentation.gauge('app.web.request', Date.now() - req._startTime);

    if (res.statusCode >= 500) {
      instrumentation.increment('app.web.error');
    }
  });

  next();
}

module.exports = handleInstrumentation;
