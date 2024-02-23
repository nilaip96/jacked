import React from "react";
import usePlayers from "./usePlayers.js";
import Player from "./Player.js";
import "./Players.css";
import You from "./You.js";

const Players = () => {
  const { players, inGame, you } = usePlayers();

  return (
    <div className="grid-container">
      {Object.values(players).map((player) =>
        you === player.id ? (
          <You key={player.id} player={player} inGame={inGame} />
        ) : (
          <Player key={player.id} player={player} />
        )
      )}
    </div>
  );
};

export default Players;
