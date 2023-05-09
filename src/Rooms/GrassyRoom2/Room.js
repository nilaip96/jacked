import React, { useState, useEffect } from "react";
// import JoinRoom from "./GrassyRoom/JoinRoom";
// import Chat from "./Chat";
import GrassyBackground from "./GrassyBackground.js";
// import Dealer from "./Dealer.js";
import Players from "./Players.js";
import "./GrassyRoom.css";
import "./Dot.css";
import { useSocket } from "../../SocketContext.js";
import SyncRoom from "../SyncRoom.js";

const Room = () => {
  const socket = useSocket();
  const [players, setPlayers] = useState({});
  const { id } = socket;
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

  useEffect(() => {
    document.querySelector(".grassy-room").focus();
  }, []);

  const placeMove = (direction) => {
    socket.emit("move", direction);
  };

  const placeBet = (bet = 25) => {
    socket.emit("place-bet", bet);
  };

  const handleKeyPress = (event) => {
    const { key } = event;
    event.preventDefault();
    const you = players[id];
    if (!you) return;

    const currentBet = you.bets.reduce((acc, cur) => acc + cur, 0);

    if (key === "ArrowUp") placeMove("up");
    else if (key === "ArrowDown") placeMove("down");
    else if (key === "ArrowLeft") placeMove("left");
    else if (key === "ArrowRight") placeMove("right");
    else if (key === " " && !inGame) placeBet(currentBet + 25);
  };

  return (
    <div className="grassy-room" onKeyDown={handleKeyPress} tabIndex={-1}>
      <Players players={Object.values(players)} />
      <GrassyBackground />
      <SyncRoom />
    </div>
  );
};

export default Room;
