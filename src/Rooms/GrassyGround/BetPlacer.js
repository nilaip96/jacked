import React from "react";
import { useSocket } from "../../SocketContext.js";

const low_bets = [5, 10, 25, 50, 100, "All"];
const mid_bets = [20, 50, 100, 1000, 2500, "All"];

const generateBets = (wallet) => {
  if (wallet <= 10000) return low_bets;
  if (wallet <= 5000) return mid_bets;
  return [
    Math.floor(wallet / 10000),
    Math.floor(wallet / 100),
    Math.floor(wallet / 10),
    Math.floor(wallet / 5),
    Math.floor(wallet / 2),
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
