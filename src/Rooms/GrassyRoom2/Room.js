import React, { useState, useEffect } from "react";
// import JoinRoom from "./GrassyRoom/JoinRoom";
// import Chat from "./Chat";
import GrassyBackground from "./GrassyBackground.js";
// import Dealer from "./Dealer.js";
import Player from "./Player.js";
import "./GrassyRoom.css";
import "./Dot.css";

const Room = () => {
  const [position, setPosition] = useState({ x: 10, y: 10 });

  const handleKeyPress = (event) => {
    console.log(event.key);
    const { x, y } = position;

    if (event.key === "ArrowUp") setPosition({ x, y: Math.max(0, y - 1.5) });
    else if (event.key === "ArrowDown")
      setPosition({ x, y: Math.min(100, y + 1.5) });
    else if (event.key === "ArrowLeft")
      setPosition({ x: Math.max(0, x - 1.5), y });
    else if (event.key === "ArrowRight")
      setPosition({ x: Math.min(100, x + 1.5), y });
  };

  useEffect(() => {
    // This is to autofocus the grassy-room div when the component is mounted
    const grassyRoomDiv = document.querySelector(".grassy-room");
    grassyRoomDiv.focus();
  }, []);

  return (
    <div className="grassy-room" onKeyDown={handleKeyPress} tabIndex={-1}>
      <Player position={position} />
      <GrassyBackground />
    </div>
  );
};

export default Room;
