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
      <div className="player">
        <div className="stats">
          <div>{name}</div>
          <div>{wallet}</div>
          <div>{status}</div>
          <div>{suggestion}</div>
          <div>{bets.reduce((sum, bet) => sum + bet, 0)}</div>
          {status === "bust" && <div>BUST</div>}
          {status === "stay" && <div>Stopped</div>}
        </div>
        <div className="Hands">
          {hands.map((hand, handIndex) => (
            <div className="hand" key={`hand-${handIndex}`}>
              {hand.map((card, i) => (
                <Card card={card} key={`card-${handIndex + i}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Player;
