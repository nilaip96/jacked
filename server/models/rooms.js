const { createDealer } = require("./dealers.js");

class Rooms {
  constructor() {
    this.rooms = {}
  }

  room = (name) => ({
    name: name,
    Players: {},
    Messages: [],
    Dealer: {},
    inGame: false,
    startedTimer: false,
  });

  create = (name) => {
    const newRoom =  this.room(name);
    this.rooms[name] = newRoom;
    newRoom.Dealer = createDealer();
    return newRoom;
  }

  find = (name) => (!this.rooms[name] ? this.create(name) : this.rooms[name]);

  delete = (name) => {
    if (Rooms[name]) {
      delete Rooms[name];
    }
  };

}


module.exports = Rooms
