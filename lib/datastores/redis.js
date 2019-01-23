const Redis = require('ioredis');
const logger = require('../logger');

const { REDIS_DB, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

logger.info(`Using Redis cache at ${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`);

const redis = new Redis(REDIS_PORT, REDIS_HOST, {
  db: parseInt(REDIS_DB, 10),
  password: REDIS_PASSWORD,
});

module.exports = redis;
