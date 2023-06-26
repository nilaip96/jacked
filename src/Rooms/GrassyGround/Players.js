import React, { useState, useEffect } from "react";
import { useSocket } from "../../SocketContext.js";
import Player from "./Player.js";
import "./Players.css";
import You from "./You.js";

const Players = () => {
  const socket = useSocket();
  const [players, setPlayers] = useState({});
  const you = socket.id;
  const [inGame, setInGame] = useState(false);

  useEffect(() => {
    const playersEvent = (newPlayers) => {
      setPlayers(newPlayers);
    };

    const playerEvent = (player) => {
      setPlayers((prevPlayers) => ({ ...prevPlayers, [player.id]: player }));
    };

    const playerLeft = (player) => {
      setPlayers((prevPlayers) => {
        const updatedPlayers = { ...prevPlayers };
        delete updatedPlayers[player.id];
        return updatedPlayers;
      });
    };

    const gameStatusEvent = (event) => {
      setInGame(event);
    };

    socket.on("players-received", playersEvent);
    socket.on("player-received", playerEvent);
    socket.on("player-left", playerLeft);
    socket.on("game-status", gameStatusEvent);

    return () => {
      socket.off("player-received", playerEvent);
    };
  }, [players, socket]);

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
