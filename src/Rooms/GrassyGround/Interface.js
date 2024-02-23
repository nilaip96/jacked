import React from "react";
import usePlayers from "./usePlayers.js";
import Plays from "./Plays.js";
import BetPlacer from "./BetPlacer.js";
import "./Interface.css";


const Interface = () => {
  const { inGame, players, you } = usePlayers();
  const player = players[you];
  const status = player?.status || "";

  return (
    <div className="Interface">
      Interface
      {!inGame && status === "spectator" && <BetPlacer />}
      {status === "playing" && <Plays player={player} />}
    </div>
  );
};

export default Interface;
