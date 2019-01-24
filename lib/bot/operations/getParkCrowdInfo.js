const parks = require('../../parks');

async function getParkCrowdInfo(parkId) {
  const park = parks[parkId];

  const rides = await park.GetWaitTimes();

  let maxWaitTime = 0;
  let maxWaitTimeRide;
  let ridesWithWaitCount = 0;
  let totalWaitTime = 0;

  rides.forEach(({ name, waitTime }) => {
    if (waitTime) {
      ridesWithWaitCount += 1;
      totalWaitTime += waitTime;

      if (waitTime > maxWaitTime) {
        maxWaitTime = waitTime;
        maxWaitTimeRide = name;
      }
    }
  });

  const avgWaitTime = totalWaitTime / ridesWithWaitCount;

  let level = 0;

  if (avgWaitTime >= 60) {
    level = 3;
  } else if (avgWaitTime >= 30) {
    level = 2;
  } else if (avgWaitTime >= 20) {
    level = 1;
  }

  return {
    avgWaitTime,
    level,
    maxWait: {
      mins: maxWaitTime,
      ride: maxWaitTimeRide,
    },
  };
}

module.exports = getParkCrowdInfo;
