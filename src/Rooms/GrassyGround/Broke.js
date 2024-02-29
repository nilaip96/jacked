import React from "react";
import { useSocket } from "../../SocketContext.js";

const Broke = () => {
  const socket = useSocket();

  const handleBroke = (e) => {
    socket.emit("broke");
  };

  return (
    <div className="Interface">
      <button className="broke" onClick={handleBroke}>
        I'm Broke
      </button>
    </div>
  );
};

export default Broke;
