const socketIO = require("socket.io");
const {
  joinRoom,
  leaveRoom,
  sendMessage,
  placeBet,
  hit,
  stay,
  doubleDown,
  split,
  syncRoom,
  deleteAll,
  broke,
} = require("./actions.js");
const { log } = console;

module.exports.socket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    allowEIO3: true,
  });

  io.on("connection", (socket) => {
    log("User connected:", socket.id);

    socket.on("join-room", (roomName, playerName) => {
      joinRoom(socket, io, roomName, playerName);
    });

    socket.on("sync-room", () => {
      syncRoom(socket, io);
    });

    socket.on("leave-room", () => {
      leaveRoom(socket, io);
    });

    socket.on("disconnect", () => {
      leaveRoom(socket, io);
    });

    socket.on("send-message", (message) => {
      sendMessage(socket, io, message);
    });

    socket.on("place-bet", (amount) => {
      placeBet(socket, io, amount);
    });

    socket.on("hit", (index) => {
      hit(socket, io, index);
    });

    socket.on("stay", () => {
      stay(socket, io);
    });

    socket.on("split", (index) => {
      split(socket, io, index);
    });

    socket.on("double-down", () => {
      doubleDown(socket, io);
    });

    socket.on("delete-all", () => {
      deleteAll(socket, io);
    });

    socket.on("broke", () => {
      broke(socket, io);
    });
  });
};
