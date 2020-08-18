const express = require('express');
const router = require('./router');
const errorHandler = require('./utils/errorHandler');
const requestLogger = require('./utils/requestLogger');
const jsonBodyParser = require('./utils/jsonBodyParser');

const app = express();

app.get('/healthcheck', (req, res) => {
  res.send('OK');
});

app.use(jsonBodyParser);
app.use(requestLogger);
app.use(router);
app.use(errorHandler);

module.exports = app;
