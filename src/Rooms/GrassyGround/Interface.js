import React from "react";
import usePlayers from "./usePlayers.js";
import Plays from "./Plays.js";
import BetPlacer from "./BetPlacer.js";
import Reset from "./Reset.js";
import "./Interface.css";

const Interface = () => {
  const { inGame, players, you } = usePlayers();
  const player = players[you];
  const status = player?.status || "";
  const wallet = player?.wallet || 0;
  const playing = status === "playing";
  const canBet = !inGame && (status === "spectator" || status === "ready");
  const needsReset =
    canBet &&
    wallet === 0 &&
    player.bets.reduce((acc, bet) => acc + bet, 0) === 0;
  if (!(playing || canBet)) return null;
  return (
    <>
      {needsReset && <Reset />}
      {canBet && <BetPlacer wallet={wallet} />}
      {playing && <Plays player={player} />}
    </>
  );
};

export default Interface;
