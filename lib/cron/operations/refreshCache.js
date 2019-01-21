const Promise = require('bluebird');
const Themeparks = require('themeparks');
const { downloadFile, redis, uploadFile } = require('../../datastores');
const logger = require('../../logger');

const DB_FILE_NAME = 'themeparks.db';

async function refreshParkCache(parkId) {
  const park = new Themeparks.Parks[parkId]();

  const rides = await park.GetWaitTimes();

  const trx = redis.multi();

  let maxWaitRide;
  let maxWaitTime = 0;
  let ridesWithWait = 0;
  let totalWaitTime = 0;

  rides.forEach(({ name, waitTime }) => {
    if (waitTime > 0) {
      ridesWithWait += 1;
      totalWaitTime += waitTime;

      if (waitTime > maxWaitTime) {
        maxWaitTime = waitTime;
        maxWaitRide = name;
      }
    }
  });

  const avgWaitTime =
    ridesWithWait > 0 ? Math.floor(totalWaitTime / ridesWithWait) : 0;

  const crowd = {
    avgWaitTime,
    maxWait: {
      ride: maxWaitRide,
      time: maxWaitTime,
    },
  };

  trx.set(`parks:${parkId}:crowd`, JSON.stringify(crowd));

  await trx.exec();
}

async function refreshCache() {
  const dbFile = await downloadFile(DB_FILE_NAME);

  Themeparks.Settings.Cache = dbFile;

  await Promise.each(Object.keys(Themeparks.Parks), async parkId => {
    logger.debug(`Refreshing cache for ${parkId}`);

    try {
      await refreshParkCache(parkId);
    } catch (err) {
      logger.error(`Unable to refresh cache for ${parkId}`, err);
    }
  });

  await uploadFile(dbFile);
}

module.exports = refreshCache;
