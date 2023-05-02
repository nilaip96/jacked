const express = require("express");
const cors = require("cors");
const app = express();

const server = require("http").createServer(app);
const { socket } = require("./socket.js");

app.use(cors());

socket(server);

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
