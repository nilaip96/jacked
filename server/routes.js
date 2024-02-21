const express = require("express");
const path = require("path");
const { admin } = require("./admin.js");

const router = express.Router();

router.get("/health", (_req, res) => {
  res.sendStatus(200);
});

router.get("/admin*", (_req, res) => {
  res.send(admin());
});

router.get("/client-socket.io", (_req, res) => {
  res.sendFile(
    path.join(__dirname, "../node_modules/socket.io-client/dist/socket.io.js")
  );
});

router.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

module.exports = router;
