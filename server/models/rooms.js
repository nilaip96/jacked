const { createDealer } = require("./dealers.js");

const Rooms = {};

const Room = (name) => ({
  name: name,
  Players: {},
  Messages: [],
  Dealer: {},
  inGame: false,
  startedTimer: false,
});

const createRoom = (name) => {
  const newRoom = Room(name);
  Rooms[name] = newRoom;
  newRoom.Dealer = createDealer();
  return newRoom;
};

const findRoom = (name) => (!Rooms[name] ? createRoom(name) : Rooms[name]);

const deleteRoom = (name) => {
  if (Rooms[name]) {
    delete Rooms[name];
  }
};

module.exports = { findRoom, deleteRoom, Rooms };
