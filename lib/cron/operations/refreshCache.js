const Promise = require('bluebird');
const Themeparks = require('themeparks');
const { downloadFile, redis, uploadFile } = require('../../datastores');
const logger = require('../../logger');

const DB_FILE_NAME = 'themeparks.db';

async function refreshParkCache(parkId) {
  const park = new Themeparks.Parks[parkId]({ forceCreate: true });

  const rides = await park.GetWaitTimes();

  const trx = redis.multi();

  let maxWaitRide;
  let maxWaitTime = 0;
  let ridesWithWait = 0;
  let totalWaitTime = 0;
  let ts = 0;

  rides.forEach(({ lastUpdate, name, waitTime }) => {
    ts = Math.max(ts, new Date(lastUpdate).getTime());

    if (waitTime > 0) {
      ridesWithWait += 1;
      totalWaitTime += waitTime;

      if (waitTime > maxWaitTime) {
        maxWaitTime = waitTime;
        maxWaitRide = name;
      }
    }
  });

  ts = ts || Date.now();

  const avgWaitTime =
    ridesWithWait > 0 ? Math.floor(totalWaitTime / ridesWithWait) : 0;

  const crowd = {
    avgWaitTime,
    maxWait: {
      ride: maxWaitRide,
      time: maxWaitTime,
    },
    ts,
  };

  // TODO: set a TTL for the keys, so they don't stay in Redis for too long. If
  // the cache refresh fails for some reason, it's better to not have anything
  // than to have old data.

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
      logger.error(
        `Unable to refresh cache for ${parkId}: ${err.message}`,
        err,
      );
    }
  });

  await uploadFile(dbFile);
}

module.exports = refreshCache;
