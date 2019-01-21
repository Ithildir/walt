const moment = require('moment-timezone');
const cache = require('./cache');

const {
  NODE_ENV,
  OPENING_TIMES_CACHE_INTERVAL = 6 * 60 * 60 * 1000, // 6 hours
  WAIT_TIMES_CACHE_INTERVAL = 5 * 60 * 1000, // 5 minutes
} = process.env;

function getParkName(parkId) {
  const park = cache.parks[parkId] || {};
  return park.Name;
}

function getParkNames() {
  return Object.values(cache.parks).map(park => park.Name);
}

function getSchedulePos(schedules, m) {
  const date = m.format('YYYY-MM-DD');

  for (let i = 0; i < schedules.length; i += 1) {
    if (schedules[i].date === date) {
      return i;
    }
  }

  return -1;
}

function getSchedule(parkId) {
  const parkData = cache.parksData[parkId] || {};
  const { schedules } = parkData;

  if (!schedules) {
    return null;
  }

  const now = moment.tz(cache.parks[parkId].Timezone);
  const pos = getSchedulePos(schedules, now);

  if (pos < 0) {
    return null;
  }

  const { openingTime, closingTime, type } = schedules[pos];

  const openingMoment = moment.parseZone(openingTime);
  const closingMoment = moment.parseZone(closingTime);

  const open = type === 'Operating' && now.isBetween(openingMoment, closingMoment);

  const parkSchedule = { open };

  if (open) {
    parkSchedule.closingTime = closingTime;
  } else if (type === 'Operating' && now.isBefore(openingMoment)) {
    parkSchedule.openingTime = openingTime;
  } else {
    for (let i = pos + 1; i < schedules.length; i += 1) {
      const schedule = schedules[i];

      if (schedule.type === 'Operating') {
        parkSchedule.openingTime = schedule.openingTime;
      }
    }
  }

  return parkSchedule;
}

function getWaitTimes(parkId) {
  const parkData = cache.parksData[parkId] || {};
  return parkData.waitTimes;
}

async function refreshCache() {
  await cache.refreshSchedules();
  await cache.refreshWaitTimes();
}

if (NODE_ENV !== 'test') {
  setInterval(cache.refreshSchedules, OPENING_TIMES_CACHE_INTERVAL);
  setInterval(cache.refreshWaitTimes, WAIT_TIMES_CACHE_INTERVAL);
}

module.exports = {
  getParkName,
  getParkNames,
  getSchedule,
  getWaitTimes,
  refreshCache,
};
