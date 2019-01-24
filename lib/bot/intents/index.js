const titleCase = require('title-case');
const getParkCrowdInfo = require('./getParkCrowdInfo');

const intentsMap = new Map();

Object.entries({
  getParkCrowdInfo,
}).forEach(([name, fn]) => intentsMap.set(titleCase(name), fn));

module.exports = intentsMap;
