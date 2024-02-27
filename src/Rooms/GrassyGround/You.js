import React from "react";
import "./Player.css";
import Card from "./Card.js";
import { bestScore } from "../../utils.js";
import Chicken from "./Chicken.js";

const You = ({ player }) => {
  const { name, wallet = 0, hands = [], bets = [], status } = player;

  return (
    <div className="grid-item">
      <div className="slot stats you">
        <div>{wallet}</div>
        <div>{name}</div>
        <Chicken status={status} />
      </div>
      {hands.map((hand, handIndex) =>
        (bets.length === 0 || bets[handIndex] === 0) &&
        hand.length === 0 ? null : (
          <div className="slot hand" key={`hand-${handIndex}`}>
            <div>{bets[handIndex]}</div>
            {hand.map((card, i) => (
              <Card card={card} key={`card-${handIndex + i}`} />
            ))}
            {bestScore(hand) !== 0 && <div>{bestScore(hand)} </div>}
          </div>
        )
      )}
    </div>
  );
};

export default You;
