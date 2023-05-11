import React from "react";
import Player from "./Player.js";

const Players = ({ players, messages, you }) => (
  <>
    {players.map(
      (player) =>
        player.id !== you && (
          <Player key={player.id} player={player} messages={messages} />
        )
    )}
  </>
);

export default Players;
