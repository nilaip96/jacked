import React, { useEffect, useState } from "react";
import Login from "./Login/Login.js";
import GrassyGround from "./GrassyGround/GrassyGround.js";
import { useSocket } from "../SocketContext.js";

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

  return <>{room === "" ? <Login /> : <GrassyGround />}</>;
};

export default Rooms;
