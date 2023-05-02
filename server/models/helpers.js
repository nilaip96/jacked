const { findPlayer, resetPlayer } = require("./players.js");
const { findRoom } = require("./rooms.js");

const findRoomBySocketId = (id) => {
  const { room } = findPlayer(id);
  return findRoom(room);
};

const addPlayerToRoom = (name, player) => {
  const room = findRoom(name);
  room.Players[player.id] = player;
  player.room = room.name;
};

const removePlayerFromRoom = (name, player) => {
  const room = findRoom(name);
  resetPlayer(player.id);
  delete room.Players[player.id];
};

module.exports = { findRoomBySocketId, addPlayerToRoom, removePlayerFromRoom };
