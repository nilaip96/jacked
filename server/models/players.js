const { PLAYER_STATUS, NAMES } = require("../constants.js");

const Players = {};

const Player = (id, name) => ({
  id: id, //socketio_id
  name: name, //user name
  room: "", //current room
  status: PLAYER_STATUS.spectator,
  wallet: 1000,
  hands: [[]],
  bets: [],
  position: { top: "50%", left: "50%" },
});

const createPlayer = (id, name) => {
  if (!name) {
    name = NAMES[Math.floor(Math.random() * NAMES.length)];
  }
  const newPlayer = Player(id, name);
  Players[id] = newPlayer;
  return newPlayer;
};

const findPlayer = (id, name) =>
  !Players[id] ? createPlayer(id, name) : Players[id];

const resetPlayer = (id) => {
  const player = findPlayer(id);
  player.status = PLAYER_STATUS.spectator;
  player.hands = [[]];
  player.bets = [];
  return player;
};

module.exports = { findPlayer, resetPlayer };
