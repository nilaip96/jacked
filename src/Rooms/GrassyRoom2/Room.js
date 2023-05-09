import React, { useState, useEffect } from "react";
// import JoinRoom from "./GrassyRoom/JoinRoom";
// import Chat from "./Chat";
import GrassyBackground from "./GrassyBackground.js";
import Dealer from "./Dealer.js";
import Players from "./Players.js";
import "./GrassyRoom.css";
import "./Dot.css";
import { useSocket } from "../../SocketContext.js";
import SyncRoom from "../SyncRoom.js";
import Chat from "./Chat.js";

const Room = () => {
  const socket = useSocket();
  const [players, setPlayers] = useState({});
  const { id } = socket;
  const [inGame, setInGame] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [dealer, setDealer] = useState({
    deck: [],
    hand: [],
    tossed: [],
    hidden: false,
    wallet: 0,
    position: { x: 50, y: 10 },
  });

  const onLoad = () => {
    document.querySelector(".grassy-room").focus();
  };

  const handleMessages = () => {
    const messageEvent = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    const messagesEvent = (messages) => {
      setMessages(messages);
    };
    socket.on("message-received", messageEvent);
    socket.on("messages-received", messagesEvent);
    return () => {
      socket.off("message-received", messageEvent);
    };
  };

  const handlePlayers = () => {
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
  };

  const handleDealer = () => {
    const dealerEvent = (newDealer) => {
      setDealer(() => newDealer);
    };

    socket.on("dealer-received", dealerEvent);

    return () => {
      socket.off("dealer-received", dealerEvent);
    };
  };

  const placeMove = (direction) => {
    socket.emit("move", direction);
  };

  const placeBet = (bet = 25) => {
    socket.emit("place-bet", bet);
  };

  const handleKeyPress = (event) => {
    if (chatOpen) return;

    const { key } = event;
    const you = players[id];
    if (!you) return;
    const currentBet = you.bets.reduce((acc, cur) => acc + cur, 0);

    const moveKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    const shouldPreventDefault =
      moveKeys.includes(key) || (key === " " && !inGame);
    if (shouldPreventDefault) event.preventDefault();

    if (key === "ArrowUp") placeMove("up");
    else if (key === "ArrowDown") placeMove("down");
    else if (key === "ArrowLeft") placeMove("left");
    else if (key === "ArrowRight") placeMove("right");
    else if (key === " " && !inGame) placeBet(currentBet + 25);
    else if (key === "Enter") openChat();
  };

  const closeChat = () => {
    setChatOpen(false);
    document.querySelector(".grassy-room").focus();
  };

  const openChat = () => {
    setChatOpen(true);
    setTimeout(() => {
      document.querySelector(".transparent-input").focus();
    }, 100);
  };

  useEffect(handleDealer, [dealer, socket]);
  useEffect(handleMessages, [socket]);
  useEffect(handlePlayers, [players, socket]);
  useEffect(onLoad, []);

  return (
    <div className="grassy-room" onKeyDown={handleKeyPress} tabIndex={-1}>
      <Players players={Object.values(players)} messages={messages} />
      <GrassyBackground />
      <SyncRoom />
      <Dealer dealer={dealer} />
      <Chat chatOpen={chatOpen} messages={messages} closeChat={closeChat} />
    </div>
  );
};

export default Room;
