const app = require('./app');
const { initLanguage } = require('./language');
const logger = require('./logger');
const { refreshCache } = require('./services/parks');

const PORT = parseInt(process.env.PORT, 10) || 8080;

async function startApp() {
  await Promise.all([initLanguage(), refreshCache()]);

  app.listen(PORT, () => {
    logger.info(`Walt server started on port ${PORT}`);
  });
}

startApp();
