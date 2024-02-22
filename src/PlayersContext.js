import React, { useState, useEffect, createContext } from "react";
import { useSocket } from "./SocketContext.js";

const PlayersContext = createContext();

export const PlayersProvider = ({ children }) => {
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

    return <PlayersContext.Provider value={{ players, you, inGame }}>{children}</PlayersContext.Provider>
};

export const usePlayers = () => React.useContext(PlayersProvider);