const titleCase = require('title-case');
const getParkCrowdInfo = require('./getParkCrowdInfo');

const intents = {
  getParkCrowdInfo,
};

const intentsMap = new Map();

Object.keys(intents).forEach(name => {
  intentsMap.set(titleCase(name), intents[name]);
});

module.exports = intentsMap;
