import React, { useEffect, useState } from "react";
import Login from "./Login/Login.js";
import GrassyGround from "./GrassyGround/GrassyGround.js";
import { useSocket } from "../SocketContext.js";
import GrassyRoom from "./GrassyRoom/Room.js";

const Rooms = () => {
  const socket = useSocket();
  const [room, setRoom] = useState("");

  useEffect(() => {
    if (!socket) return;
    const roomEvent = (newRoom) => {
      setRoom(() => newRoom);
    };
    socket.on("room-received", roomEvent);

    return () => {
      socket.off("room-received", roomEvent);
    };
  });

  return (
    <>
      {room === "" ? (
        <Login />
      ) : room.startsWith('ground') ? (
        <GrassyGround />
      ) : (
        <GrassyRoom />
      )}
    </>
  );
};

export default Rooms;
