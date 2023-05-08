const { getCurrentTimeInHoursAndMinutes } = require("../utils");

let id = 0;

const Messages = [];

const Message = (text, source, name) => ({
  id: id,
  source: source,
  name: name,
  text: text,
  time: getCurrentTimeInHoursAndMinutes(),
});

const createMessage = (text, source = "") => {
  const newMessage = Message(text, source);
  Messages.push(newMessage);
  id++;
  return newMessage;
};

module.exports = { createMessage };
