import React from "react";
import { useSocket } from "../SocketContext.js";
import { WEIGHT } from "../Constants.js";

const Plays = ({ player }) => {
  const { split, hand, hands } = player;

  const socket = useSocket();

  const handleHit = (e) => {
    e.preventDefault();
    socket.emit("hit");
  };
  const handleStay = (e) => {
    e.preventDefault();
    socket.emit("stay");
  };

  const handleSplit = (e) => {
    e.preventDefault();
    socket.emit("split");
  };

  const handleSplit0 = (e) => {
    e.preventDefault();
    socket.emit("split-hit", 0);
  };

  const handleSplit1 = (e) => {
    e.preventDefault();
    socket.emit("split-hit", 1);
  };

  const handleDoubleDown = (e) => {
    e.preventDefault();
    socket.emit("double-down");
  };

  const hasTwoCards = hand.length === 2;
  const notSplit = !split;
  const hasSplit =
    notSplit &&
    hasTwoCards &&
    WEIGHT[hand[0].value][0] === WEIGHT[hand[1].value][0];
  const hasHandOne = split && hands[0].length;
  const hasHandTwo = split && hands[1].length;

  return (
    <div>
      <button onClick={handleStay}>STAY</button>
      {notSplit && <button onClick={handleHit}>HIT</button>}
      {hasSplit && <button onClick={handleSplit}>SPLIT</button>}
      {hasHandOne && <button onClick={handleSplit0}>Hit 1</button>}
      {hasHandTwo && <button onClick={handleSplit1}>Hit 2</button>}
      {hasTwoCards && <button onClick={handleDoubleDown}>DD</button>}
    </div>
  );
};

export default Plays;
