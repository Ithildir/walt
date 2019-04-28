const themeparks = require('themeparks');
const express = require('express');
const basicAuth = require('express-basic-auth');
const cache = require('../cache');
const logger = require('../logger');

const { NOW_REGION, PASSWORD, USERNAME } = process.env;

async function refreshParkCache (parkId) {
  const profiler = logger.startTimer();
  const pipeline = cache.pipeline();

  const park = new themeparks.Parks[parkId]();

  try {
    const waitTimes = await park.GetWaitTimes();

    const activeRides = waitTimes.filter(({ active }) => active);
    const avgWaitTime = Math.floor(activeRides.reduce((acc, { waitTime }) => acc + waitTime, 0) / activeRides.length);

    pipeline.set(`parks:${parkId}:avg_wait_time`, avgWaitTime);
  } catch (err) {
    logger.error(`Failed to get wait times for "${parkId}"`, err);
  }

  await pipeline.exec();

  profiler.done({
    message: `Refreshed cache for "${parkId}"`,
    parkId
  });
}

const app = express();

if (NOW_REGION !== 'dev1') {
  app.use(basicAuth({ users: { [USERNAME]: PASSWORD } }));
}

app.all('*', async (req, res) => {
  const { prefix } = req.query;

  const promises = Object.keys(themeparks.Parks)
    .filter(parkId => parkId.toLowerCase().startsWith(prefix))
    .map(refreshParkCache);

  await Promise.all(promises);

  res.end();
});

module.exports = app;
