import React, { useState } from "react";
import { useSocket } from "../../SocketContext.js";
import "../Input.css";

const JoinRoom = ({ name }) => {
  const socket = useSocket();
  const [room, setRoom] = useState("");

  const joinRoom = (event) => {
    event.preventDefault();
    if (room.length === 0) return;
    socket.emit("leave-room").emit("join-room", room, name).emit("sync-room");
  };

  return (
    <div>
      <input
        type="text"
        value={room}
        placeholder="Enter Room ID"
        onChange={({ target }) => setRoom(target.value)}
      />
      <div>
        {room.length !== 0 && <button onClick={joinRoom}>Join Room</button>}
      </div>
    </div>
  );
};

export default JoinRoom;
