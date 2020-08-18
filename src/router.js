const express = require('express');
const router = express.Router();
const redisApi = require('./redis/redis.api');

router.get('/:key', redisApi.getKey);
router.post('/:key', redisApi.postKey);
router.delete('/:key', redisApi.deleteKey);

module.exports = router;
