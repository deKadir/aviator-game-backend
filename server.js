const express = require('express');
const Socket = require('./services/Socket');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const server = http.createServer(app);
app.use(
  cors({
    origin: 'https://aviator-game.vercel.app',
  })
);
const io = new Server(server, {
  cors: {
    origin: `https://aviator-game.vercel.app`,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});
server.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);

  Socket({ io });
});
