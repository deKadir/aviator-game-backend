const express = require('express');
const Socket = require('./services/Socket');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const server = http.createServer(app);
app.use(
  cors({
    origin: '*',
  })
);
const io = new Server(server, {
  cors: {
    origin: `*`,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});
server.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${process.env.PORT}`);

  Socket({ io });
});
