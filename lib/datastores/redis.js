const Redis = require('ioredis');

const { REDIS_DB, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const redis = new Redis(REDIS_PORT, REDIS_HOST, {
  db: REDIS_DB,
  password: REDIS_PASSWORD,
});

module.exports = redis;
