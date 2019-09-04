const express = require('express');
const apiRoutes = require('./api/apiRouter');

const server = express();

const logger = (req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      'Origin'
    )}`
  );
  next();
};

server.use(logger);
server.use('/api', apiRoutes);

module.exports = server;
