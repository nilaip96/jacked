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
import You from "./You.js";
import { getAvailablePlays } from "../../utils.js";

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
  const [you, setYou] = useState(null);
  const [plays, setPlays] = useState([]);
  const [selectedPlayIndex, setSelectedPlayIndex] = useState(0);

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

  const placeMove = (move_key) => {
    const DIRECTIONS = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };

    socket.emit("move", DIRECTIONS[move_key]);
  };

  const placeBet = (bet = 25) => {
    socket.emit("place-bet", bet);
  };

  const executePlay = (play) => {
    let [indexlessPlay, index] = play.split("-");
    index = parseInt(index, 10);

    if (indexlessPlay === "stay") {
      socket.emit("stay");
    } else if (indexlessPlay === "hit") {
      socket.emit("hit", index);
    } else if (indexlessPlay === "split") {
      socket.emit("split", index);
    } else if (play.includes("double-down")) {
      socket.emit("double-down");
    }
  };

  const handleKeyPress = (event) => {
    if (chatOpen || !you) return;

    const { key } = event;
    const moveKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    const shouldPreventDefault =
      moveKeys.includes(key) || (key === " " && !inGame);
    if (shouldPreventDefault) event.preventDefault();

    if (key === "Enter") {
      openChat();
      return;
    }

    if (you.status === "playing") {
      if (key === "ArrowUp")
        setSelectedPlayIndex(
          (prevIndex) => (prevIndex - 1 + plays.length) % plays.length
        );
      else if (key === "ArrowDown")
        setSelectedPlayIndex((prevIndex) => (prevIndex + 1) % plays.length);
      else if (key === " ") executePlay(plays[selectedPlayIndex]);
    } else {
      if (moveKeys.some((moveKey) => moveKey === key)) placeMove(key);
      else if (key === " " && !inGame) placeBet(25);
    }
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

  const handleYou = () => {
    if (players[id]) {
      setYou(players[id]);
      const availablePlays = getAvailablePlays(players[id]);
      setPlays(availablePlays);
    }
  };

  useEffect(handleYou, [you, players, id]);
  useEffect(handleDealer, [dealer, socket]);
  useEffect(handleMessages, [socket]);
  useEffect(handlePlayers, [players, socket]);
  useEffect(onLoad, []);

  return (
    <div className="grassy-room" onKeyDown={handleKeyPress} tabIndex={-1}>
      <Players players={Object.values(players)} messages={messages} you={id} />
      <GrassyBackground />
      <SyncRoom />
      <Dealer dealer={dealer} />
      <You
        player={you}
        messages={messages}
        plays={plays}
        selectedPlayIndex={selectedPlayIndex}
      />
      <Chat chatOpen={chatOpen} messages={messages} closeChat={closeChat} />
    </div>
  );
};

export default Room;
