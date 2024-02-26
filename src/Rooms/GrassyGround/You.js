import React from "react";
import "./Player.css";
import Card from "./Card.js";
import { bestScore } from "../../utils.js";

const You = ({ player }) => {
  const {
    name,
    status,
    wallet = 0,
    hands = [],
    bets = [],
    suggestion = "",
  } = player;

  return (
    <div className="grid-item">
      <div className="player">
        <div className="slot stats">
          <div>you</div>
          <div>{name}</div>
          <div>{wallet}</div>
          <div>{status}</div>
          <div>{suggestion}</div>
          <div>{bets.reduce((sum, bet) => sum + bet, 0)}</div>
          {status === "bust" && <div>BUST</div>}
          {status === "stay" && <div>Stopped</div>}
        </div>
        {hands.map((hand, handIndex) => (
          <div className="slot hand" key={`hand-${handIndex}`}>
            {hand.map((card, i) => (
              <Card card={card} key={`card-${handIndex + i}`} />
            ))}
            <div>{bestScore(hand)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default You;
