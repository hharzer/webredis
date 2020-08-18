const redis = require('redis');
const config = require('../config');
const logger = require('../utils/logger');

let client;

// prevent redis from keeping the test process alive
// it will also throw error if we forgot to create mocks for the redisService
if (process.env.NODE_ENV !== 'TEST') {
  client = redis.createClient({
    host: config.redisHost,
    retry_strategy: (options) => {
      logger.info('Unable to connect to redis');
      if (options.total_retry_time > 1000 * 30) {
        return new Error("Could not connect to redis after 30sec");
      }
      const retryTimer = options.attempt * 300;
      logger.info(`Retry in ${retryTimer}`);

      return retryTimer;
    },
  });

  client.on('connect', () => {
    logger.info('Redis connected');
  });
}

function get(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (err, value) => {
      if (err) {
        return reject(err);
      }
      return resolve(value);
    });
  });
}

function set(key, value) {
  return new Promise((resolve, reject) => {
    client.set(key, value, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

function del(key) {
  return new Promise((resolve, reject) => {
    client.del(key, (err, deletedCount) => {
      if (err) {
        return reject(err);
      }
      return resolve(deletedCount);
    });
  });
}

module.exports = {
  get,
  set,
  del,
};
