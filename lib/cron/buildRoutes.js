const snakeCase = require('snake-case');
const titleCase = require('title-case');
const logger = require('../logger');
const operations = require('./operations');
const { authCron } = require('../middlewares');

function buildRoutes(router) {
  router.get('/cron/*', authCron);

  Object.keys(operations).forEach(name => {
    const operation = operations[name];

    router.get(`/cron/${snakeCase(name)}`, async (req, res) => {
      const startTime = Date.now();

      await operation();

      logger.info(
        `${titleCase(name)} cron operation completed in ${Date.now() -
          startTime} ms`,
      );

      res.sendStatus(200);
    });
  });
}

module.exports = buildRoutes;
