import React from "react";
import "./Player.css";
import Card from "./Card.js";

const Player = ({ player }) => {
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
      <div>{name}</div>
      <div>{wallet}</div>
      <div>{status}</div>
      <div>{suggestion}</div>
      <div>{bets.reduce((sum, bet) => sum + bet, 0)}</div>
      {hands.map((hand, handIndex) => (
        <div key={`hand-${handIndex}`}>
          {hand.map((card, i) => (
            <Card card={card} key={`card-${handIndex + i}`} />
          ))}
        </div>
      ))}
      {status === "bust" && <div>BUST</div>}
      {status === "stay" && <div>Stopped</div>}
    </div>
  );
};

export default Player;
