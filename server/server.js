const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const server = require("http").createServer(app);
const { socket } = require("./socket.js");
const publicPath = path.join(__dirname, "../build");

app.use(express.static(publicPath));

app.use(cors());

socket(server);

app.get("/health", (_req, res)=> {
  res.send(200)
})

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
