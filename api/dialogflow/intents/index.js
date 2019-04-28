const getParkCrowd = require('./getParkCrowd');

const intentsMap = new Map();

Object.entries({
  getParkCrowd
}).forEach(([name, fn]) => intentsMap.set(name, fn));

module.exports = intentsMap;
