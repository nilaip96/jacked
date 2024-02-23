import React from "react";
import { useSocket } from "../../SocketContext.js";

const bets = [5, 10, 25, 50, 100, "All"];

const BetPlacer = ({ wallet }) => {
  const socket = useSocket();

  const placeBet = (bet = 25) => {
    if (bet === "All") bet = wallet;
    socket.emit("place-bet", bet);
  };
  if (wallet === 0) return null;
  return (
    <>
      {bets.map((amount) => {
        if (amount > wallet) return null;
        return <button onClick={() => placeBet(amount)}>{amount}</button>;
      })}
    </>
  );
};

export default BetPlacer;
