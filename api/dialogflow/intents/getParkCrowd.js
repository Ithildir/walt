const { requirePark } = require('../helpers');
const cache = require('../../cache');

function getParkCrowd (agent) {
  return requirePark(agent, async (parkId) => {
    const avgWaitTime = await cache.get(`parks:${parkId}:avg_wait_time`);

    if (avgWaitTime) {
      agent.add(`The average wait time is ${avgWaitTime} minutes.`);
    } else {
      agent.add('I\'m sorry, I have no idea!');
    }
  });
}

module.exports = getParkCrowd;
