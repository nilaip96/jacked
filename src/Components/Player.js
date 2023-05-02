import React from "react";
import "./Player.css";
import Card from "./Card.js";

const Player = ({ player }) => {
  const { name, status, wallet, hand, bet } = player;

  return (
    <div className="grid-item">
      <div>{name}</div>
      <div>{wallet}</div>
      <div>{status}</div>
      <div>{bet}</div>
      <div>
        {hand.map((card, i) => (
          <Card card={card} key={i} />
        ))}
      </div>
    </div>
  );
};

export default Player;
