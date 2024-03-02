const { findRoom, deleteRoom, Rooms } = require("./models/rooms.js");
const { findPlayer, resetPlayer, Players } = require("./models/players.js");
const { createMessage, Messages } = require("./models/messages.js");
const { resetDealer, Dealers } = require("./models/dealers.js");
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
  suggest,
  randomMessage,
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
  socket.to(roomName).emit("sound", "join");
  log(`User ${socket.id}, ${message}`);
};

const syncRoom = (socket, _io) => {
  const player = findPlayer(socket.id);
  const room = findRoom(player.room);
  log("syncingRoom for", socket.id, "@Room", room.name);
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
    return;
  }
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
    io.in(name).emit("sound", "leave");

    return;
  }
  if (inGame) {
    checkGameOver(socket, io, room.name);
  }
};

const sendMessage = (socket, io, message) => {
  log(`Message from ${socket.id}: ${message}`);
  const player = findPlayer(socket.id);
  const { Messages, name } = findRoom(player.room);
  const newMessage = createMessage(message, player.id, player.name);

  Messages.push(newMessage);
  io.in(name).emit("message-received", newMessage);
  io.in(name).emit("sound", "message");

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
      io.in(room.name).emit("sound", "won");
    } else {
      player.status = PLAYER_STATUS.playing;
      player.suggestion = suggest(hand, room.Dealer.hand[0].value);
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
  io.in(room.name).emit("sound", "lost");

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
    .filter(({ status }) => status === PLAYER_STATUS.ready)
    .map(({ id }) => id);

  const dealingOrder = [...readyPlayers, "Dealer", ...readyPlayers, "Dealer"];

  let i = dealingOrder.length - 1;

  if (i * 6 > room.Dealer.deck.length) {
    room.Dealer.deck = [...room.Dealer.deck, ...room.Dealer.tossed];
    room.Dealer.tossed = [];
    io.in(room.name).emit("dealer-received", room.Dealer);
  }

  const intervalID = setInterval(() => {
    const newMessage = createMessage(
      `${room.Dealer.deck.length} cards remaining in the deck`,
      "Dealer"
    );
    io.in(room.name).emit("message-received", newMessage);
    const card = room.Dealer.deck.pop();
    if (dealingOrder[i] === "Dealer") {
      room.Dealer.hand.push(card); // Use hands[0] to push the card
    } else {
      const player = findPlayer(dealingOrder[i]);
      if (player.room === roomName) {
        player.hands[0].push(card); // Use hands[0] to push the card
        io.in(room.name).emit("player-received", player);
      }
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
    player.bets = player.bets.length ? [player.bets[0] + amount] : [amount];
    player.wallet -= amount;
    player.status = PLAYER_STATUS.ready;
    io.in(room.name).emit("player-received", player);
  }

  if (!room.startedTimer) {
    countDown(socket, io, 5);
    room.startedTimer = true;
  }
  const newMessage = createMessage(
    `${player.name} placed ${amount}`,
    player.id,
    "Dealer"
  );
  Messages.push(newMessage);
  io.in(room.name).emit("message-received", newMessage);
  io.in(room.name).emit("sound", "bet");

  if (player.wallet === 0) {
    const newMessage = createMessage(
      `${player.name} is putting it all on the line`,
      player.id,
      "Dealer"
    );
    Messages.push(newMessage);
    io.in(room.name).emit("message-received", newMessage);
  }
};

const determineWinners = (_socket, io, roomName) => {
  const { Dealer, name, Players, Messages } = findRoom(roomName);
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

      if (winner === OUTCOMES.Player) {
        player.status = PLAYER_STATUS.won;
        io.in(roomName).emit("sound", "won");
      } else if (winner === OUTCOMES.Dealer) {
        player.status = PLAYER_STATUS.lost;
        io.in(roomName).emit("sound", "lost");
      } else {
        player.status = PLAYER_STATUS.push;
        io.in(roomName).emit("sound", "push");
      }

      io.in(name).emit("player-received", player);

      const newMessage = createMessage(
        `${player.name} ${player.status}`,
        player.id,
        "Dealer"
      );
      Messages.push(newMessage);
      io.in(roomName).emit("message-received", newMessage);
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

  let message = `${player.name} hits`;

  if (isBust(hand)) {
    room.Dealer.wallet += player.bets[handIndex];
    player.bets[handIndex] = 0;
    message += " and busts";
    if (player.hands.every((hand) => isBust(hand))) {
      player.status = PLAYER_STATUS.bust;
      message += " and busted everything";
    }
  }
  player.suggestion = "";

  io.in(room.name).emit("sound", "hit");
  io.in(room.name).emit("dealer-received", room.Dealer);
  io.in(room.name).emit("player-received", player);

  const newMessage = createMessage(message, socket.id, "Dealer");
  room.Messages.push(newMessage);
  io.in(room.name).emit("message-received", newMessage);
  io.in(room.name).emit("sound", "hit");

  checkGameOver(socket, io, room.name);
};

const stay = (socket, io) => {
  const player = findPlayer(socket.id);
  const room = findRoom(player.room);

  player.status = PLAYER_STATUS.stay;
  player.suggestion = "";

  io.in(room.name).emit("player-received", player);

  const newMessage = createMessage(`${player.name} stays`, socket.id, "Dealer");
  room.Messages.push(newMessage);
  io.in(room.name).emit("message-received", newMessage);
  io.in(room.name).emit("sound", "hit");

  checkGameOver(socket, io, room.name);
};

const split = async (socket, io, handIndexToSplit) => {
  log(handIndexToSplit);
  let player = findPlayer(socket.id);
  const room = findRoom(player.room);
  const handToSplit = player.hands[handIndexToSplit];
  const bet = player.bets[handIndexToSplit];

  player.hands.push([handToSplit.pop()]);
  player.wallet -= bet;
  player.bets.push(0 + bet);
  player.suggestion = "";
  handToSplit.push(room.Dealer.deck.pop());
  io.in(room.name).emit("player-received", player);
  io.in(room.name).emit("dealer-received", room.Dealer);

  const newMessage = createMessage(`${player.name} split`, socket.id, "Dealer");
  room.Messages.push(newMessage);
  io.in(room.name).emit("message-received", newMessage);

  await delay(1000);

  //refresh the player before pushing the card
  player = findPlayer(socket.id);

  if (player.room !== room.name) return;
  log("hand", player.hands[player.hands.length - 1]);

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
  player.suggestion = "";
  io.in(room.name).emit("player-received", player);

  let message = `${player.name} Doubled Downed`;
  if (isBust(player.hands[0])) {
    player.status = PLAYER_STATUS.bust;
    room.Dealer.wallet += player.bets[0];
    player.bets = [0];
    message += "and busted";
  } else {
    player.status = PLAYER_STATUS.stay;
  }

  io.in(room.name).emit("dealer-received", room.Dealer);
  io.in(room.name).emit("player-received", player);

  const newMessage = createMessage(message, socket.id, "Dealer");
  room.Messages.push(newMessage);
  io.in(room.name).emit("message-received", newMessage);

  checkGameOver(socket, io, room.name);
};

const deleteAll = (_socket, io) => {
  log("Admin Clear Memory Initiate");
  Object.values(Rooms).forEach((room) => {
    log("Deleting", room);
    const { Players } = room;
    Object.values(Players).forEach((player) => {
      const socket = io.sockets.sockets.get(player.id);
      leaveRoom(socket, io);
      resetPlayer(player.id);
      player.room = "";
      io.to(player.id).emit("room-received", "");
      io.to(player.id).emit("players-received", { [player.id]: player });
    });
    room.Players = {};
    deleteRoom(room.name);
  });

  Object.keys(Rooms).forEach((key) => delete Rooms[key]);
  log("Deleted Rooms");
  Object.keys(Dealers).forEach((key) => delete Dealers[key]);
  log("Deleted Dealers");
  Object.keys(Players).forEach((key) => delete Players[key]);
  log("Deleted Players");
  Messages.length = 0;
  log("Cleared Messages");

  log("Admin Clear Memory Complete");
};

const broke = (socket, io) => {
  const player = findPlayer(socket.id);
  const room = findRoom(player.room);
  player.wallet += 1000;
  io.in(room.name).emit("player-received", player);

  const newMessage = createMessage(randomMessage(player.name), "Dealer");
  room.Messages.push(newMessage);
  io.in(room.name).emit("message-received", newMessage);
  io.in(room.name).emit("sound", "join");
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
  syncRoom,
  deleteAll,
  broke,
};
