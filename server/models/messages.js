const { getCurrentTimeInHoursAndMinutes } = require("../utils");

let id = 0;

const Messages = [];

const Message = (text, source, playerName) => ({
  id: id,
  source: source,
  text: text,
  time: getCurrentTimeInHoursAndMinutes(),
  playerName: playerName,
});

const createMessage = (text, source = "", playerName = "") => {
  const newMessage = Message(text, source, playerName);
  Messages.push(newMessage);
  id++;
  return newMessage;
};

module.exports = { createMessage, Messages };
