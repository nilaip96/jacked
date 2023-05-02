import React from "react";
import { useSocket } from "../SocketContext.js";

const BetPlacer = () => {
  const socket = useSocket();

  const placeBet = (e, bet = 25) => {
    e.preventDefault();
    socket.emit("place-bet", bet);
  };

  return (
    <div>
      <button onClick={placeBet}>25</button>
    </div>
  );
};

export default BetPlacer;
