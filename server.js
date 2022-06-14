const express = require('express');
const Socket = require('./services/Socket');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const server = http.createServer(app);
const port = 8080 || 3213;
app.use(
  cors({
    origin: 'http://aviator-game.vercel.app/',
  })
);
const io = new Server(server, {
  cors: {
    origin: `http://aviator-game.vercel.app/`, // I copied the origin in the error message and pasted here
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
app.get('/', (req, res) => {
  res.send('Hello World!');
});
server.listen(port, () => {
  console.log(`App listening on port ${port}`);

  Socket({ io });
});
