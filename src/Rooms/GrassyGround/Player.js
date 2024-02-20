import React from "react";
import "./Player.css";
import Card from "./Card.js";
import Body from "./Body.js";

const Player = ({ player }) => {
  const { name, status, wallet = 0, hands = [], bets = [] } = player;

  return (
    <div className="grid-item">
      <div>{name}</div>
      <div>{wallet}</div>
      <div>{status}</div>
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
      <Body />
    </div>
  );
};

export default Player;
