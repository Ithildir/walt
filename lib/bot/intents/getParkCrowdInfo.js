const operations = require('../operations');

async function getParkCrowdInfo(agent) {
  const parkValue = agent.parameters.park;

  const info = await operations.getParkCrowdInfo(parkValue);

  // TODO: write error (so I can receive an alert) if a crowd info is not in Redis

  agent.add(JSON.stringify(info));
}

module.exports = getParkCrowdInfo;
