import React from "react";
import { useSocket } from "../../SocketContext.js";

const Reset = () => {
  const socket = useSocket();

  const handleReset = (e) => {
    socket.emit("broke");
  };

  return (
    <div className="Interface">
      <button className="broke" onClick={handleReset}>
        I'm Broke
      </button>
    </div>
  );
};

export default Reset;
