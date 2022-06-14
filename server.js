const express = require('express');
const Socket = require('./services/Socket');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const port = 8080;
const io = new Server(server, { cors: '*:*' });
app.get('/', (req, res) => {
  res.send('Hello World!');
});
server.listen(port, () => {
  console.log(`App listening on port ${port}`);

  Socket({ io });
});
