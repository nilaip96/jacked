import React, { useState, useEffect } from "react";
import { useSocket } from "../../SocketContext.js";
import { usePlayers }  from "../../PlayersContext.js";
import Player from "./Player.js";
import "./Players.css";
import You from "./You.js";

const Players = () => {
  const values = usePlayers();
console.log(values)
  return (
    <div className="grid-container">
      {/* {Object.values(players).map((player) =>
        you === player.id ? (
          <You key={player.id} player={player} inGame={inGame} />
        ) : (
          <Player key={player.id} player={player} />
        )
      )} */}
    </div>
  );
};

export default Players;
