const { findRoom, deleteRoom } = require("./models/rooms.js");
const { findPlayer } = require("./models/players.js");
const { createMessage } = require("./models/messages.js");
const { resetDealer } = require("./models/dealers.js");
const { log } = console;
const {
  findRoomBySocketId,
  addPlayerToRoom,
  removePlayerFromRoom,
} = require("./models/helpers.js");
const { PLAYER_STATUS, OUTCOMES } = require("./constants.js");
const {
  hasBlackJack,
  compareHands,
  isBust,
  bestScore,
  determineWinner,
  delay,
} = require("./utils.js");

const joinRoom = (socket, _io, roomName, playerName) => {
  const player = findPlayer(socket.id, playerName);
  if (!playerName) playerName = player.name;
  const room = findRoom(roomName);

  const { length } = Object.values(room.Players);
  if (room.inGame && !length) {
    room.inGame = false;
    room.Dealer = resetDealer(room.Dealer);
  }

  const { Messages } = room;

  const message = `${playerName} has joined room ${roomName}`;
  const newMessage = createMessage(message, "Dealer");
  Messages.push(newMessage);

  //Add player to room and inform current room
  addPlayerToRoom(roomName, player);
  socket.join(roomName);
  socket.emit("room-received", roomName);
  socket.to(roomName).emit("message-received", newMessage);
  socket.to(roomName).emit("player-received", player);

  log(`User ${socket.id}, ${message}`);
};

const syncRoom = (socket, _io) => {
  log("syncingRoom");
  const player = findPlayer(socket.id);
  const room = findRoom(player.room);
  const { Messages, Players, Dealer, inGame } = room;

  socket.emit("messages-received", Messages);
  socket.emit("players-received", Players);
  socket.emit("dealer-received", Dealer);
  socket.emit("game-status", inGame);
};

const leaveRoom = (socket, io) => {
  const player = findPlayer(socket.id);
  const room = findRoom(player.room);
  const { name, Messages, inGame, Dealer } = room;
  const message = `${player.name} has left room ${name}`;
  const newMessage = createMessage(message, "Dealer");
  Messages.push(newMessage);

  log(message);
  Dealer.tossed = [...Dealer.tossed, ...player.hands.flat()];
  if (player.bets) {
    Dealer.wallet += player.bets.reduce((sum, bet) => sum + bet, 0);
  }
  io.in(name).emit("dealer-received", Dealer);

  socket.leave(name);
  io.in(name).emit("message-received", newMessage);
  io.in(name).emit("player-left", player);
  removePlayerFromRoom(name, player);

  const Players = Object.values(room.Players);
  if (!Players.length) {
    deleteRoom(name);
    log("Deleted room", name);
  } else if (
    inGame &&
    Players.every(({ status }) => status === PLAYER_STATUS.spectator)
  ) {
    const resetMessage = createMessage(
      "no active players will reset game",
      "Dealer"
    );
    room.inGame = false;
    room.Dealer = resetDealer(room.Dealer);

    Messages.push(newMessage);
    io.in(name).emit("message-received", resetMessage);
    io.in(name).emit("dealer-received", room.Dealer);
    io.in(name).emit("game-status", room.inGame);
  } else if (inGame) {
    checkGameOver(socket, io, room.name);
  }
};

const sendMessage = (socket, io, message) => {
  log(`Message from ${socket.id}: ${message}`);
  const player = findPlayer(socket.id);
  const { Messages, name } = findRoom(player.room);
  const newMessage = createMessage(message, player.name);

  Messages.push(newMessage);
  io.in(name).emit("message-received", newMessage);

  if (message === "deez") {
    const nuts = createMessage("nuts!!! Gotteeem!!!", "Dealer");
    Messages.push(nuts);
    io.in(name).emit("message-received", nuts);
  }
};

const closeOutGame = (_socket, io, roomName) => {
  const room = findRoom(roomName);
  const players = Object.values(room.Players);

  players.forEach((player) => {
    player.status = PLAYER_STATUS.spectator;
    room.Dealer.tossed = [...room.Dealer.tossed, ...player.hands.flat()];
    player.hands = [[]];
    io.in(room.name).emit("player-received", player);
  });

  room.Dealer.tossed = [...room.Dealer.tossed, ...room.Dealer.hand];
  room.Dealer.hand = [];
  room.Dealer.hidden = true;
  room.inGame = false;
  io.in(room.name).emit("dealer-received", room.Dealer);
  io.in(room.name).emit("game-status", room.inGame);
};

const enablePlayers = (_socket, io, roomName) => {
  const room = findRoom(roomName);
  const readyPlayers = Object.values(room.Players).filter(
    ({ status }) => status === PLAYER_STATUS.ready
  );

  readyPlayers.forEach((player) => {
    const hand = player.hands[0];
    const bet = player.bets[0];

    if (hasBlackJack(hand)) {
      player.status = PLAYER_STATUS.won;
      player.wallet += (3 / 2) * bet + bet;
      room.Dealer.wallet -= (3 / 2) * bet;
      player.bets[0] = 0;
    } else {
      player.status = PLAYER_STATUS.playing;
    }
    io.in(room.name).emit("dealer-received", room.Dealer);
    io.in(room.name).emit("player-received", player);
  });

  //if all players got black jack
  if (!readyPlayers.some(({ status }) => status === PLAYER_STATUS.playing)) {
    setTimeout(() => {
      closeOutGame(_socket, io, room.name);
    }, 3000);
  }
};

const dealerBlackJack = (_socket, io, roomName) => {
  const room = findRoom(roomName);

  room.Dealer.hidden = false;
  io.in(room.name).emit("dealer-received", room.Dealer);

  const readyPlayers = Object.values(room.Players).filter(
    ({ status }) => status === PLAYER_STATUS.ready
  );

  readyPlayers.forEach((player) => {
    const outCome = compareHands(room.Dealer.hand, player.hands[0]);

    if (outCome === OUTCOMES.Push) {
      player.status = PLAYER_STATUS.push;
      player.wallet += player.bets[0];
    } else if (outCome === OUTCOMES.Dealer) {
      player.status = PLAYER_STATUS.lost;
      room.Dealer.wallet += player.bets[0];
    }
    player.bets = [0];

    io.in(room.name).emit("player-received", player);
  });
  setTimeout(() => {
    closeOutGame(_socket, io, roomName);
  }, 3000);
};

const dealCards = (_socket, io, roomName) => {
  log("dealingCards");
  const room = findRoom(roomName);

  // Use findPlayer function to get player objects from the room
  const readyPlayers = Object.values(room.Players)
    .map(({ id, name }) => findPlayer(id, name))
    .filter(({ status }) => status === PLAYER_STATUS.ready);

  const dealingOrder = [...readyPlayers, "Dealer", ...readyPlayers, "Dealer"];

  let i = dealingOrder.length - 1;

  if (i > room.Dealer.deck.length) {
    room.Dealer.deck = [...room.Dealer.deck, ...room.Dealer.tossed];
    room.Dealer.tossed = [];
    io.in(room.name).emit("dealer-received", room.Dealer);
  }

  const intervalID = setInterval(() => {
    const newMessage = createMessage(`${i + 1} Cards remaining`, "Dealer");
    io.in(room.name).emit("message-received", newMessage);
    const card = room.Dealer.deck.pop();
    if (dealingOrder[i] === "Dealer") {
      room.Dealer.hand.push(card); // Use hands[0] to push the card
    } else {
      dealingOrder[i].hands[0].push(card); // Use hands[0] to push the card
      io.in(room.name).emit("player-received", dealingOrder[i]);
    }
    io.in(room.name).emit("dealer-received", room.Dealer);

    i--;
    if (i < 0) {
      clearInterval(intervalID);
      if (hasBlackJack(room.Dealer.hand)) {
        dealerBlackJack(_socket, io, room.name);
      } else {
        enablePlayers(_socket, io, room.name);
      }
    }
  }, 300);
};

// want to start countdown in the room with socket however, player can leave during countdown process
// so the room is initalized and saved here and passed down to dealCards
const countDown = (socket, io, seconds) => {
  const room = findRoomBySocketId(socket.id);
  let remainingSeconds = seconds;

  const intervalID = setInterval(() => {
    const newMessage = createMessage(
      `${remainingSeconds} seconds remaining`,
      "Dealer"
    );
    io.in(room.name).emit("message-received", newMessage);
    remainingSeconds--;

    if (remainingSeconds < 0) {
      room.startedTimer = false;
      clearInterval(intervalID);
      if (
        Object.values(room.Players).filter(
          ({ status }) => status === PLAYER_STATUS.ready
        ).length
      ) {
        room.inGame = true;
        const newMessage = createMessage(`Game Started`, "Dealer");
        room.Messages.push(newMessage);
        io.in(room.name).emit("message-received", newMessage);
        io.in(room.name).emit("game-status", room.inGame);
        dealCards(socket, io, room.name);
      }
    }
  }, 1000);
};

const placeBet = (socket, io, amount) => {
  log(`Bet from ${socket.id}: ${amount}`);
  const player = findPlayer(socket.id);
  const room = findRoom(player.room);
  if (!room.inGame) {
    player.bets = [amount];
    player.wallet -= amount;
    player.status = PLAYER_STATUS.ready;
    io.in(room.name).emit("player-received", player);
  }

  if (!room.startedTimer) {
    countDown(socket, io, 5);
    room.startedTimer = true;
  }
};

const determineWinners = (_socket, io, roomName) => {
  const { Dealer, name, Players } = findRoom(roomName);
  const stayedPlayers = Object.values(Players).filter(
    (player) => player.status === PLAYER_STATUS.stay
  );

  if (isBust(Dealer.hand)) {
    stayedPlayers.forEach((player) => {
      player.bets.forEach((bet, i) => {
        player.wallet += bet * 2;
        Dealer.wallet -= bet;
        player.bets[i] = 0;
      });
      player.status = PLAYER_STATUS.won;
      io.in(name).emit("player-received", player);
    });
  } else {
    stayedPlayers.forEach((player) => {
      const outComes = [];
      player.hands.forEach((hand, handIndex) => {
        const bet = player.bets[handIndex];
        if (bet === 0) {
          outComes.push(OUTCOMES.Dealer);
          return;
        }
        const oc = compareHands(Dealer.hand, hand);

        if (oc === OUTCOMES.Push) {
          outComes.push(OUTCOMES.Push);
          player.wallet += bet;
        } else if (oc === OUTCOMES.Player) {
          outComes.push(OUTCOMES.Player);
          player.wallet += bet * 2;
          Dealer.wallet -= bet;
        } else {
          outComes.push(OUTCOMES.Dealer);
          Dealer.wallet += bet;
        }
        player.bets[handIndex] = 0;
      });

      const winner = determineWinner(outComes);

      if (winner === OUTCOMES.Player) player.status = PLAYER_STATUS.won;
      else if (winner === OUTCOMES.Dealer) player.status = PLAYER_STATUS.lost;
      else player.status = PLAYER_STATUS.push;

      io.in(name).emit("player-received", player);
    });
  }

  io.in(name).emit("dealer-received", Dealer);

  setTimeout(() => {
    closeOutGame(_socket, io, roomName);
  }, 3000);
};

const endGame = (_socket, io, roomName) => {
  const { Dealer, name } = findRoom(roomName);

  Dealer.hidden = false;
  io.in(name).emit("dealer-received", Dealer);

  const drawCardEverySecond = () => {
    if (bestScore(Dealer.hand) < 17) {
      const card = Dealer.deck.pop();

      Dealer.hand.push(card);

      io.in(name).emit("dealer-received", Dealer);

      setTimeout(() => drawCardEverySecond(), 1000);
    } else {
      setTimeout(() => determineWinners(_socket, io, roomName), 2000);
    }
  };

  setTimeout(() => drawCardEverySecond(), 1000);
};

const checkGameOver = (socket, io, roomName) => {
  const room = findRoom(roomName);

  const allPlayersDone = Object.values(room.Players).every(
    (player) => player.status !== PLAYER_STATUS.playing
  );
  if (allPlayersDone) {
    endGame(socket, io, roomName);
  }
};

const hit = (socket, io, handIndex) => {
  log(`Hit request from ${socket.id}`);
  const player = findPlayer(socket.id);
  const room = findRoom(player.room);

  const card = room.Dealer.deck.pop();
  const hand = player.hands[handIndex];
  hand.push(card);

  if (isBust(hand)) {
    room.Dealer.wallet += player.bets[handIndex];
    player.bets[handIndex] = 0;

    if (player.hands.every((hand) => isBust(hand))) {
      player.status = PLAYER_STATUS.bust;
    }
  }

  io.in(room.name).emit("dealer-received", room.Dealer);
  io.in(room.name).emit("player-received", player);
  checkGameOver(socket, io, room.name);
};

const stay = (socket, io) => {
  const player = findPlayer(socket.id);
  const room = findRoom(player.room);

  player.status = PLAYER_STATUS.stay;

  io.in(room.name).emit("player-received", player);
  checkGameOver(socket, io, room.name);
};

const split = async (socket, io, handIndexToSplit) => {
  log(handIndexToSplit);
  const player = findPlayer(socket.id);
  const room = findRoom(player.room);
  const handToSplit = player.hands[handIndexToSplit];
  const bet = player.bets[handIndexToSplit];

  player.hands.push([handToSplit.pop()]);
  player.wallet -= bet;
  player.bets.push(0 + bet);

  handToSplit.push(room.Dealer.deck.pop());
  io.in(room.name).emit("player-received", player);
  io.in(room.name).emit("dealer-received", room.Dealer);

  await delay(1000);

  player.hands[player.hands.length - 1].push(room.Dealer.deck.pop());
  io.in(room.name).emit("player-received", player);
  io.in(room.name).emit("dealer-received", room.Dealer);
};

const doubleDown = (socket, io) => {
  const player = findPlayer(socket.id);
  const room = findRoom(player.room);

  const card = room.Dealer.deck.pop();
  player.hands[0].push(card);
  player.wallet -= player.bets[0];
  player.bets[0] *= 2;
  io.in(room.name).emit("player-received", player);

  if (isBust(player.hands[0])) {
    player.status = PLAYER_STATUS.bust;
    room.Dealer.wallet += player.bets[0];
    player.bets = [0];
  } else {
    player.status = PLAYER_STATUS.stay;
  }

  io.in(room.name).emit("dealer-received", room.Dealer);
  io.in(room.name).emit("player-received", player);
  checkGameOver(socket, io, room.name);
};

const move = (socket, io, direction) => {
  const player = findPlayer(socket.id);
  const room = findRoom(player.room);

  const { x, y } = player.position;

  switch (direction) {
    case "right":
      player.position = { x: Math.min(100, x + 1), y };
      break;
    case "left":
      player.position = { x: Math.max(0, x - 1), y };
      break;
    case "up":
      player.position = { y: Math.max(0, y - 1), x };
      break;
    case "down":
      player.position = { y: Math.min(100, y + 1), x };
      break;
    default:
  }

  io.in(room.name).emit("player-received", player);
};

module.exports = {
  joinRoom,
  leaveRoom,
  placeBet,
  sendMessage,
  hit,
  stay,
  split,
  doubleDown,
  move,
  syncRoom,
};
