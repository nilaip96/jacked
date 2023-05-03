import React, { useEffect, useState } from "react";
import Login from "./Components/Login.js";
import GrassyRoom from "./Components/GrassyRoom.js";
import { useSocket } from "./SocketContext";

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

  return <>{room === "" ? <Login /> : <GrassyRoom />}</>;
};

export default Rooms;
