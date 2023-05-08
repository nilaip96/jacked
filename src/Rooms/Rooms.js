import React, { useEffect, useState } from "react";
import Login from "./Login/Login.js";
import GrassyRoom from "./GrassyRoom/GrassyRoom.js";
import { useSocket } from "../SocketContext.js";
import GrassyRoom2 from "./GrassyRoom2/Room.js";

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
      ) : room === "test" ? (
        <GrassyRoom2 />
      ) : (
        <GrassyRoom />
      )}
    </>
  );
};

export default Rooms;
