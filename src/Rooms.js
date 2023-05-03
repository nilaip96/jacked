import React, { useEffect, useState } from "react";
import Login from "./Components/Login.js";
import Room from "./Components/Room.js";
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

  return <div>{room === "" ? <Login /> : <Room />}</div>;
};

export default Rooms;
