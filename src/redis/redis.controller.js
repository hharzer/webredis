const logger = require('../utils/logger');
const { NotFound, BadRequest } = require('../utils/errors');
const redisService = require('./redis.service');

async function getData(key) {
  const value = await redisService.get(key);
  if (!value) {
    throw NotFound(`Value not found for ${key}`);
  }

  try {
    const valueJSON = JSON.parse(Buffer.from(value, 'base64').toString('utf-8'));
    return valueJSON;
  } catch (error) {
    logger.error(`Unable to parse value for ${key}`, { key });
    throw BadRequest('Non JSON value stored');
  }
}

async function setData(key, value) {
  const valueStr = Buffer.from(JSON.stringify(value)).toString('base64');

  const result = await redisService.set(key, valueStr);

  return result;
}

async function deleteData(key) {
  const deletedCount = await redisService.del(key);

  if (deletedCount === 0) {
    throw NotFound(`Value not found for ${key}`);
  }

  return deletedCount;
}

module.exports = {
  getData,
  setData,
  deleteData,
};
