const { PLAYER_STATUS, NAMES } = require("../constants.js");

const Players = {};

const Player = (id, name) => ({
  id: id, //socketio_id
  name: name, //user name
  room: "", //current room
  status: PLAYER_STATUS.spectator,
  wallet: 1000,
  hand: [],
  split: false,
  hands: [[], []],
  bet: 0,
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
  player.hand = [];
  player.split = false;
  player.hands = [[], []];
  player.bet = 0;
  return player;
};

module.exports = { findPlayer, resetPlayer };
