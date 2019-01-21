const Promise = require('bluebird');
const Themeparks = require('themeparks');
const fs = require('fs');
const os = require('os');
const path = require('path');
const logger = require('../../logger');
const names = require('./names.json');

const { DB_DIR = os.tmpdir(), NODE_ENV } = process.env;
const DISABLED_PARK_IDS = ['TokyoDisneyResortMagicKingdom', 'TokyoDisneyResortDisneySea'];

const parks = {};
const parksData = {};

const cacheFile = path.resolve(DB_DIR, 'themeparks.db');

if (NODE_ENV === 'production' && fs.existsSync(cacheFile)) {
  fs.unlinkSync(cacheFile);
}

Themeparks.Settings.Cache = cacheFile;

Object.keys(Themeparks.Parks)
  .filter(parkId => !DISABLED_PARK_IDS.includes(parkId))
  .forEach(parkId => {
    const parkNames = names[parkId];

    const options = {};
    if (parkNames) {
      const [name] = parkNames;
      options.name = name;
    }

    parksData[parkId] = {};
    parks[parkId] = new Themeparks.Parks[parkId](options);
  });

async function getSchedules(park) {
  if (!park.SupportsOpeningTimes) {
    return [];
  }

  const openingTimes = await park.GetOpeningTimes();

  return openingTimes.sort((a, b) => a.date.localeCompare(b.date));
}

async function getWaitTimes(park) {
  if (!park.SupportsWaitTimes) {
    return {};
  }

  let maxWaitRide;
  let maxWaitMins = 0;
  let minLastUpdate = Date.now();
  let minWaitRide;
  let minWaitMins = 0;
  let ridesWithWaitCount = 0;
  let totalWaitMins = 0;

  const noWaitRides = [];

  const rides = await park.GetWaitTimes();

  rides
    .filter(ride => ride.active)
    .forEach(({ lastUpdate, name, waitTime }) => {
      minLastUpdate = Math.min(minLastUpdate, Date.parse(lastUpdate));

      if (waitTime === 0) {
        noWaitRides.push(name);
      } else {
        ridesWithWaitCount += 1;
        totalWaitMins += waitTime;

        if (waitTime > maxWaitMins) {
          maxWaitMins = waitTime;
          maxWaitRide = name;
        }
        if (minWaitMins === 0 || waitTime < minWaitMins) {
          minWaitMins = waitTime;
          minWaitRide = name;
        }
      }
    });

  const avgWaitMins = Math.floor(totalWaitMins / ridesWithWaitCount);

  let level = 0;

  if (avgWaitMins >= 60) {
    level = 3;
  } else if (avgWaitMins >= 30) {
    level = 2;
  } else if (avgWaitMins >= 20) {
    level = 1;
  }

  return {
    avgWaitMins,
    lastUpdate: minLastUpdate,
    level,
    max: { mins: maxWaitMins, ride: maxWaitRide },
    min: { mins: minWaitMins, ride: minWaitRide },
    noWaitRides,
  };
}

function refreshData(key, fn) {
  const loggerKey = key.replace(/([A-Z])/g, c => ` ${c.toLowerCase()}`);

  return Promise.each(Object.entries(parks), async ([parkId, park]) => {
    try {
      const startTime = Date.now();
      parksData[parkId][key] = await fn(park);
      logger.debug(`${parkId} ${loggerKey} cache refreshed in ${Date.now() - startTime}ms`);
    } catch (err) {
      logger.error(`Unable to refresh ${parkId} ${loggerKey} cache: ${err.message}`, err);
    }
  });
}

function refreshSchedules() {
  return refreshData('schedules', getSchedules);
}

function refreshWaitTimes() {
  return refreshData('waitTimes', getWaitTimes);
}

module.exports = {
  parks,
  parksData,
  refreshSchedules,
  refreshWaitTimes,
};
