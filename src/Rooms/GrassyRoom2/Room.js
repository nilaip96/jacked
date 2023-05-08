import React, { useState, useEffect } from "react";
// import JoinRoom from "./GrassyRoom/JoinRoom";
// import Chat from "./Chat";
import GrassyBackground from "./GrassyBackground.js";
// import Dealer from "./Dealer.js";
import Players from "./Players.js";
import "./GrassyRoom.css";
import "./Dot.css";
import { useSocket } from "../../SocketContext.js";
import SyncRoom from "../SyncRoom.js"

  
  
  const Room = () => {
    const socket = useSocket();
  
    const placeMove = (direction) => {
      socket.emit("move", direction);
    };

  const handleKeyPress = (event) => {
    if (event.key === "ArrowUp") placeMove("up")
    else if (event.key === "ArrowDown") placeMove("down")
    else if (event.key === "ArrowLeft") placeMove("left")
    else if (event.key === "ArrowRight") placeMove("right")
    else if (event.key === "space"){
      //
    }
  };

  useEffect(() => {
    // This is to autofocus the grassy-room div when the component is mounted
    const grassyRoomDiv = document.querySelector(".grassy-room");
    grassyRoomDiv.focus();
  }, []);

  return (
    <div className="grassy-room" onKeyDown={handleKeyPress} tabIndex={-1}>
      <Players  />
      <GrassyBackground />
      <SyncRoom/>
    </div>
  );
};

export default Room;
