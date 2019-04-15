const serverHandle = require('../app.js');
const http = require('http');

const PORT = 8523;

const server = http.createServer(serverHandle);

server.listen(PORT);