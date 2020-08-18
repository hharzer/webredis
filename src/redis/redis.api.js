const redisController = require('./redis.controller');
const asyncWrapper = require('../utils/asyncWrapper');
const logger = require('../utils/logger');

async function getKey(req, res) {
  const key = req.params.key;
  logger.debug(`${key} requested`, { key });

  const value = await redisController.getData(key);

  logger.debug(`Value result for ${key}`, { key, valueFound: !!value });

  return res.json({ ...value });
}

async function postKey(req, res) {
  const key = req.params.key;
  const value = req.body;

  logger.debug(`Setting new value for ${key}`, { key });

  const result = await redisController.setData(key, value);

  logger.debug(`Completed setting new value for ${key}`, { key, result });

  return res.json({ result });
}

async function deleteKey(req, res) {
  const key = req.params.key;

  logger.debug(`Deleting value for ${key}`, { key });

  const result = await redisController.deleteData(key);

  logger.debug(`Completed deleting value for ${key}`, { key, result });

  return res.json({ result });
}

module.exports = {
  getKey: asyncWrapper(getKey),
  postKey: asyncWrapper(postKey),
  deleteKey: asyncWrapper(deleteKey),
};
