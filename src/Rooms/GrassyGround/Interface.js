import React from "react";
import usePlayers from "./usePlayers.js";
import Plays from "./Plays.js";
import BetPlacer from "./BetPlacer.js";
import "./Interface.css";

const Interface = () => {
  const { inGame, players, you } = usePlayers();
  const player = players[you];
  const status = player?.status || "";
  const wallet = player?.wallet || 0;

  if (
    !(
      status === "playing" ||
      (!inGame && (status === "spectator" || status === "ready"))
    )
  )
    return null
  return (
    <div className="Interface">
      {!inGame && (status === "spectator" || status === "ready") && (
        <BetPlacer wallet={wallet} />
      )}
      {status === "playing" && <Plays player={player} />}
    </div>
  );
};

export default Interface;
