import React from "react";
import { useSocket } from "../../SocketContext.js";
import { isBust, bestScore } from "../../utils.js";
import { WEIGHT } from "../../Constants.js";

const Plays = ({ player }) => {
  const { hands, wallet, bets, suggestion } = player;

  const socket = useSocket();

  const handleHit = (e, handIndex) => {
    e.preventDefault();
    socket.emit("hit", handIndex);
  };
  const handleStay = (e) => {
    e.preventDefault();
    socket.emit("stay");
  };

  const handleSplit = (e, handIndex) => {
    e.preventDefault();
    socket.emit("split", handIndex);
  };

  const handleDoubleDown = (e) => {
    e.preventDefault();
    socket.emit("double-down");
  };

  return (
    <div className="Interface">
      <button className={"suggested"} onClick={handleStay}>
        STAY
      </button>
      {hands.map((hand, handIndex) => (
        <React.Fragment key={`${handIndex}-HandPlay`}>
          {!isBust(hand) && bestScore(hand) !== 21 && (
            <button
              key={`hit-${handIndex}`}
              onClick={(e) => handleHit(e, handIndex)}
            >
              {`HIT ${hands.length > 1 ? handIndex + 1 : ""}`}
            </button>
          )}
          {wallet >= bets[0] &&
            hand.length === 2 &&
            WEIGHT[hand[0].value][0] === WEIGHT[hand[1].value][0] && (
              <button onClick={(e) => handleSplit(e, handIndex)}>SPLIT</button>
            )}
        </React.Fragment>
      ))}
      {wallet >= bets[0] && hands.length === 1 && hands[0].length === 2 && (
        <button onClick={handleDoubleDown}>DD</button>
      )}
    </div>
  );
};

export default Plays;
