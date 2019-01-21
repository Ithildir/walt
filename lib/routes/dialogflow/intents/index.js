const titleCase = require('title-case');
const getParkCrowd = require('./getParkCrowd');

const intentsMap = new Map();

Object.entries({
  getParkCrowd,
}).forEach(([name, fn]) => intentsMap.set(titleCase(name), fn));

module.exports = intentsMap;
