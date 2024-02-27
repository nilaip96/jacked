import { useState, useEffect } from "react";
import { useSocket } from "../../SocketContext.js";

const usePlayers = () => {
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
      socket.off("players-received", playersEvent);
      socket.off("player-left", playerLeft);
      socket.off("game-status", gameStatusEvent);
    };
  }, [players, socket]);

  return { players, you, inGame };
};

export default usePlayers;
