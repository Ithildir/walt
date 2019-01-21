const operations = require('../operations');

async function getParkCrowdInfo(agent) {
  const parkValue = agent.parameters.park;

  const info = await operations.getParkCrowdInfo(parkValue);

  agent.add(JSON.stringify(info));
}

module.exports = getParkCrowdInfo;
