const Redis = require('ioredis');
const logger = require('./logger');

const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = process.env;

const redis = new Redis({
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
  port: REDIS_PORT
});

logger.info(`Connected to cache redis://${REDIS_HOST}:${REDIS_PORT}`);

module.exports = redis;
