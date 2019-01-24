const Themeparks = require('themeparks');
const os = require('os');
const path = require('path');
const logger = require('./logger');

Themeparks.Settings.Cache = path.join(os.tmpdir(), 'themeparks.db');

const parks = {};

Object.entries(Themeparks.Parks).forEach(([parkId, Park]) => {
  parks[parkId] = new Park();
});

logger.info(`Supported parks: ${Object.keys(parks).join(', ')}`);

module.exports = parks;
