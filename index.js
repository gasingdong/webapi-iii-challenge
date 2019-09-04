const express = require('express');
const apiRoutes = require('./api/apiRouter');

const server = express();

server.use('/api', apiRoutes);

const port = 5000;
server.listen(port, () => console.log(`API running on port ${port}`));
