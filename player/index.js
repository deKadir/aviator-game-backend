let players = [];

function addPlayer({ socketId, nickname }) {
  if (socketId && nickname) {
    players.push({ socketId, nickname, balance: 1000 });
  }
}
function findPlayer(socketId) {
  return players.find((p) => p.socketId === socketId);
}
function findPlayerIndex(socketId) {
  return players.findIndex((p) => p.socketId === socketId);
}
function updateBalance(socketId, cash) {
  const index = findPlayerIndex(socketId);
  if (index >= 0) players[index].balance += cash;
}
function updatePlayer(io, socket) {
  const player = findPlayer(socket.id);
  io.to(socket.id).emit('getPlayer', player);
  io.emit('players', players);
}
function removePlayer(socketId) {
  players = players.filter((p) => p.socketId !== socketId);
}
module.exports = {
  addPlayer,
  players,
  findPlayer,
  updateBalance,
  updatePlayer,
  removePlayer,
};
