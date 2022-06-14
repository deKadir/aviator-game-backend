const { updateBalance, findPlayer } = require('../player');
const statusInitial = {
  countdown: 10,
  isPlaying: false,
};
let status = { ...statusInitial };
let number = 0;
const dataInitial = [{ uv: 1 }];
let data = [...dataInitial];
let bets = [];
let history = [];
function makeBet({ socketId, bet }, io) {
  const hasBet = bets.find((b) => b.socketId === socketId && b.status === 0);
  if (!status.isPlaying && !hasBet && bet >= 0) {
    const player = findPlayer(socketId);
    const floatBet = parseFloat(bet);
    if (player?.balance >= bet) {
      updateBalance(socketId, -floatBet);
      bets.push({
        socketId,
        nickname: player.nickname,
        amount: bet,
        status: 0,
        withdraw: 0,
      });
      io.emit('bets', bets);
    }
  }
}

function generateData(io) {
  if (status.countdown === 0 && !number) {
    number = generateNumber();
    status.isPlaying = true;
    data = [...dataInitial];
    return data;
  }
  if (status.isPlaying) {
    io.emit('gameHistory', history);

    const lastIndex = data.length - 1;
    const nextValue = data[lastIndex].uv * 1.025;
    if (nextValue < number) {
      data.push({ uv: nextValue });
    } else {
      data.push({ uv: number });
      if (history.length >= 5) history.shift();
      history.push(number);
      number = 0;
      status = { ...statusInitial };
      bets = [];
      io.emit('bets', bets);
    }
  }

  return data;
}
function generateNumber() {
  // %50 ihtimalle 1 ile 2 arası
  // %20 ihtimalle 2 ile 5 arası
  // %10 ihtimalle 5 ile 10 arası
  // %10 ihtimalle 10 ile 20 arası
  // %10 ihtimalle 10 ile 200 arası
  let num = 0;
  const possibility = Math.round(Math.random() * 9 + 1);
  if (possibility >= 1 && possibility <= 5) {
    num = Math.random() + 1;
  }
  if (possibility >= 6 && possibility < 8) {
    num = Math.random() * 3 + 2;
  }
  if (possibility === 8) {
    num = Math.random() * 5 + 5;
  }
  if (possibility === 9) {
    num = Math.random() * 10 + 10;
  }
  if (possibility === 10) {
    num = Math.random() * 190 + 10;
  }
  return num;
}
function getGameStatus() {
  if (status.countdown > 0) {
    status.countdown--;
  }

  return status;
}
function withdraw(socketId, io) {
  const betIndex = bets.findIndex((b) => b.socketId === socketId);
  const bet = bets[betIndex];
  if (status.isPlaying && betIndex !== -1 && bet.status !== 1) {
    const win = bet.amount * data[data.length - 1].uv;
    updateBalance(socketId, win);
    bets[betIndex].status = 1;
    bets[betIndex].withdraw = data[data.length - 1].uv;
    io.emit('bets', bets);
  }
}

module.exports = {
  makeBet,
  withdraw,
  generateData,
  getGameStatus,
};
