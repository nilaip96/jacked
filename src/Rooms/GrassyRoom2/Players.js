import React from "react";
import Player from "./Player.js";

const Players = ({ players, messages }) => (
  <>
    {players.map((player) => (
      <Player key={player.id} player={player} messages={messages} />
    ))}
  </>
);

export default Players;
