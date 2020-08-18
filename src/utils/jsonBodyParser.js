const logger = require('./logger');
const { BadRequest } = require('./errors');

module.exports = (req, res, next) => {
  if (req.method === 'POST') {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try {
        req.body = JSON.parse(data);
        next();
      } catch (error) {
        logger.warn('Non JSON content provided');
        next(BadRequest('Invalid request body'));
      }
    });
  } else {
    next();
  }
};
