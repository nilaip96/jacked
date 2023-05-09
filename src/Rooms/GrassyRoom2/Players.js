import React from "react";
import Player from "./Player.js";

const Players = ({ players }) => (
  <>
    {players.map((player) => (
      <Player key={player.id} player={player} />
    ))}
  </>
);

export default Players;
