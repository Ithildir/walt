const { getMessage } = require('../../../language');
const { getParkName, getSchedule, getWaitTimes } = require('../../../services/parks');
const { requirePark } = require('../helpers');

function getParkCrowd(agent) {
  return requirePark(agent, parkId => {
    const parkName = getParkName(parkId);
    const schedule = getSchedule(parkId);

    if (schedule && !schedule.open) {
      const { openingTime } = schedule;

      if (openingTime) {
        agent.add(getMessage('tell-park-is-closed-and-will-reopen', { openingTime, parkName }));
      } else {
        agent.add(getMessage('tell-park-is-closed', { parkName }));
      }
    } else {
      const waitTimes = getWaitTimes(parkId);

      if (waitTimes) {
        const { avgWaitMins, lastUpdate, level } = waitTimes;
        agent.add(getMessage(`tell-park-crowd-is-${level}-level`, { avgWaitMins, lastUpdate, parkName }));
      } else {
        agent.add(getMessage('tell-park-crowd-is-unknown', { parkName }));
      }
    }
  });
}

module.exports = getParkCrowd;
