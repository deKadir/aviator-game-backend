const {
  addPlayer,
  updatePlayer,
  removePlayer,
  findPlayer,
} = require('../player');
const { makeBet, generateData, getGameStatus, withdraw } = require('../game');
function Socket({ io }) {
  io.on('connection', (socket) => {
    socket.on('join', (res) => {
      addPlayer(res);
      updatePlayer(io, socket);
    });
    socket.on('bet', (res) => {
      makeBet(res, io);
      updatePlayer(io, socket);
    });
    socket.on('withdraw', (res) => {
      withdraw(res.socketId, io);
      updatePlayer(io, socket);
    });
    socket.on('disconnect', () => {
      removePlayer(socket.id);
      updatePlayer(io, socket);
    });
    socket.on('sendMessage', (message) => {
      const { nickname } = findPlayer(socket.id);
      io.emit('message', { nickname, message });
    });
  });

  setInterval(() => {
    io.emit('gameStatus', getGameStatus());
  }, 1000);
  setInterval(() => {
    const data = generateData(io);
    io.emit('chart', data);
  }, 500);
}

module.exports = Socket;
