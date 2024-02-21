const path = require("path");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { socket } = require("./socket.js");
const routes = require("./routes.js");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const publicPath = path.join(__dirname, "../build");
const port = 3000;

app.use(express.static(publicPath));
app.use(cors());

socket(server);

app.use("/", routes);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
