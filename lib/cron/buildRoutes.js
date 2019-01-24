const snakeCase = require('snake-case');
const operations = require('./operations');
const { authCron } = require('../middlewares');

function buildRoutes(router) {
  router.get('/cron/*', authCron);

  Object.entries(operations).forEach(([name, fn]) => {
    router.get(`/cron/${snakeCase(name)}`, async (req, res) => {
      await fn();
      res.sendStatus(200);
    });
  });
}

module.exports = buildRoutes;
