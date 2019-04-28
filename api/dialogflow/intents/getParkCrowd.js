const requirePark = require('../requirePark');

function getParkCrowd (agent) {
  return requirePark(agent, async (parkId) => {
    /*
    const park = new themeparks.Parks[parkId]();

    const rides = await park.GetWaitTimes();

    console.log(rides);

    const activeRides = rides.filter(({ active }) => active);
    const totalWaitTime = activeRides.reduce((acc, { waitTime }) => acc + waitTime, 0);

    console.log(totalWaitTime);

    agent.add(`The average wait time is ${Math.floor(totalWaitTime / activeRides.length)} minutes.`);
    */
  });
}

module.exports = getParkCrowd;
