import React from "react";
import { useSocket } from "../../SocketContext.js";

const low_bets = [5, 10, 25, 50, 100, "All"];
const generateBets = (wallet) => {
  if (wallet <= 1000) return low_bets;
  return [
    Math.floor(wallet / 1000),
    Math.floor(wallet / 200),
    Math.floor(wallet / 100),
    Math.floor(wallet / 20),
    Math.floor(wallet / 10),
    "All",
  ];
};

const BetPlacer = ({ wallet }) => {
  const socket = useSocket();

  const bets = generateBets(wallet);

  const placeBet = (bet = 25) => {
    if (bet === "All") bet = wallet;
    socket.emit("place-bet", bet);
  };
  if (wallet === 0) return null;
  return (
    <div className="Interface">
      {bets.map((amount, i) => {
        if (amount > wallet) return null;
        return (
          <button
            className={amount === "All" ? "All" : ""}
            key={`${i}-betPlacer`}
            onClick={() => placeBet(amount)}
          >
            {amount}
          </button>
        );
      })}
    </div>
  );
};

export default BetPlacer;
