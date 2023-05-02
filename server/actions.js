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

  const { Messages, Players, Dealer, inGame } = room;

  const message = `${playerName} has joined room ${roomName}`;
  const newMessage = createMessage(message, "Dealer");

  //Add player to room and inform current room
  addPlayerToRoom(roomName, player);
  socket.join(roomName);
  socket.to(roomName).emit("message-received", newMessage);
  socket.to(roomName).emit("player-received", player);

  log(`User ${socket.id}, ${message}`);

  //Sync up player with old messages and game status
  Messages.push(newMessage);
  Messages.forEach((message) => {
    socket.emit("message-received", message);
  });
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
  Dealer.tossed = [
    ...Dealer.tossed,
    ...player.hand,
    ...player.hands[0],
    ...player.hands[1],
  ];
  Dealer.wallet += player.bet;
  io.in(name).emit("dealer-received", Dealer);

  socket.leave(name);
  io.in(name).emit("message-received", newMessage);
  io.in(name).emit("player-left", player);
  removePlayerFromRoom(name, player);

  const Players = Object.values(room.Players);

  if (
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
  } else if (!Players.length) {
    deleteRoom(name);
    log("Deleted room", name);
  } else {
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
    room.Dealer.tossed = [
      ...room.Dealer.tossed,
      ...player.hand,
      ...player.hands[0],
      ...player.hands[1],
    ];
    player.hand = [];
    player.hands = [[], []];
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
    if (hasBlackJack(player.hand)) {
      player.status = PLAYER_STATUS.win;
      player.wallet += (3 / 2) * player.bet + player.bet;
      room.Dealer.wallet -= (3 / 2) * player.bet;
      player.bet = 0;
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
    const outCome = compareHands(room.Dealer.hand, player.hand);

    if (outCome === OUTCOMES.Push) {
      player.status = PLAYER_STATUS.push;
      player.wallet += player.bet;
      player.bet = 0;
    } else if (outCome === OUTCOMES.Dealer) {
      player.status = PLAYER_STATUS.lost;
      room.Dealer.wallet += player.bet;
      player.bet = 0;
    }
    io.in(room.name).emit("player-received", player);
  });
  setTimeout(() => {
    closeOutGame(_socket, io, roomName);
  }, 3000);
};

const dealCards = (_socket, io, roomName) => {
  log("dealingCards");
  const room = findRoom(roomName);

  const readyPlayers = Object.values(room.Players).filter(
    ({ status }) => status === PLAYER_STATUS.ready
  );

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
      room.Dealer.hand.push(card);
    } else {
      dealingOrder[i].hand.push(card);
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
    player.bet = amount;
    player.wallet -= amount;
    player.status = PLAYER_STATUS.ready;
    io.in(room.name).emit("player-received", player);
  }

  if (!room.startedTimer) {
    countDown(socket, io, 10);
    room.startedTimer = true;
  }
};

const determineWinners = (_socket, io, roomName) => {
  const { Dealer, name, Players } = findRoom(roomName);
  const stayedPlayers = Object.values(Players).filter(
    (player) => player.status === PLAYER_STATUS.stay
  );
  log("here");
  if (isBust(Dealer.hand)) {
    log("busted");
    stayedPlayers.forEach((player) => {
      player.wallet += player.bet * 2;
      player.status = PLAYER_STATUS.winner;
      Dealer.wallet -= player.bet;
      player.bet = 0;
      io.in(name).emit("player-received", player);
      io.in(name).emit("dealer-received", Dealer);
    });
  } else {
    stayedPlayers.forEach((player) => {
      log(player.name, split);
      if (player.split) {
        const outComes = [];
        const bustedHands = player.hands.filter(({ length }) => !length).length;
        player.hands.forEach((hand) => {
          if (!hand.length) {
            outComes.push(OUTCOMES.Dealer);
            return;
          }

          const oc = compareHands(Dealer.hand, hand);
          if (!bustedHands) {
            if (oc === OUTCOMES.Push) {
              outComes.push(OUTCOMES.Push);
              player.wallet += player.bet / 2;
            } else if (oc === OUTCOMES.Player) {
              outComes.push(OUTCOMES.Player);
              player.wallet += player.bet;
              Dealer.wallet -= player.bet / 2;
            } else {
              outComes.push(OUTCOMES.Dealer);
              Dealer.wallet += player.bet / 2;
            }
          } else {
            if (oc === OUTCOMES.Push) {
              outComes.push(OUTCOMES.Push);
              player.wallet += player.bet;
            } else if (oc === OUTCOMES.Player) {
              outComes.push(OUTCOMES.Player);
              player.wallet += player.bet * 2;
              Dealer.wallet -= player.bet;
            } else {
              outComes.push(OUTCOMES.Dealer);
              Dealer.wallet += player.bet;
            }
          }
        });

        player.status = determineWinner(outComes);
        player.split = false;
      } else {
        const outcome = compareHands(Dealer.hand, player.hand);
        if (outcome === OUTCOMES.Push) {
          player.wallet += player.bet;
          player.status = PLAYER_STATUS.push;
        } else if (outcome === OUTCOMES.Player) {
          player.wallet += player.bet * 2;
          player.status = PLAYER_STATUS.win;
          Dealer.wallet -= player.bet;
        } else {
          player.status = PLAYER_STATUS.lost;
          Dealer.wallet += player.bet;
        }
      }

      player.bet = 0;
      io.in(name).emit("dealer-received", Dealer);
      io.in(name).emit("player-received", player);
    });
  }
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

  // Check if all players
  const allPlayersDone = Object.values(room.Players).every(
    (player) => player.status !== PLAYER_STATUS.playing
  );
  if (allPlayersDone) {
    endGame(socket, io, roomName);
  }
};

const hit = (socket, io) => {
  log(`Hit request from ${socket.id}`);
  const player = findPlayer(socket.id);
  const room = findRoom(player.room);

  const card = room.Dealer.deck.pop();
  player.hand.push(card);

  if (isBust(player.hand)) {
    player.status = PLAYER_STATUS.bust;
    room.Dealer.wallet += player.bet;
    player.bet = 0;
  }

  if (bestScore(player.hand) === 21) {
    player.status = PLAYER_STATUS.stay;
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

const split = (socket, io) => {
  const player = findPlayer(socket.id);
  const room = findRoom(player.room);

  player.split = true;
  player.hands = [[player.hand[0]], [player.hand[1]]];
  player.hand = [];
  player.wallet -= player.bet;
  player.bet *= 2;

  io.in(room.name).emit("player-received", player);
};

const splitHit = (socket, io, handIndex) => {
  const player = findPlayer(socket.id);
  const room = findRoom(player.room);

  const hand = player.hands[handIndex];
  const card = room.Dealer.deck.pop();
  hand.push(card);
  if (isBust(hand)) {
    room.Dealer.tossed = [...room.Dealer.tossed, ...hand];
    player.hands[handIndex] = [];
    player.bet /= 2;
    room.Dealer.wallet += player.bet;
  }

  if (player.hands.every(({ length }) => !length)) {
    player.status = PLAYER_STATUS.bust;
    room.Dealer.wallet += player.bet;
    player.bet = 0;
  }

  io.in(room.name).emit("dealer-received", room.Dealer);
  io.in(room.name).emit("player-received", player);
  checkGameOver(socket, io, room.name);
};

const doubleDown = (socket, io) => {
  const player = findPlayer(socket.id);
  const room = findRoom(player.room);

  const card = room.Dealer.deck.pop();
  player.hand.push(card);
  player.wallet -= player.bet;
  player.bet *= 2;

  if (isBust(player.hand)) {
    player.status = PLAYER_STATUS.bust;
    room.Dealer.wallet += player.bet;
    player.bet = 0;
  } else {
    player.status = PLAYER_STATUS.stay;
  }

  io.in(room.name).emit("dealer-received", room.Dealer);
  io.in(room.name).emit("player-received", player);
  checkGameOver(socket, io, room.name);
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
  splitHit,
};
