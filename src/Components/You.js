import React from "react";
import "./Player.css";
import Card from "./Card.js";
import BetPlacer from "./BetPlacer.js";
import Plays from "./Plays.js";

const You = ({ player, inGame }) => {
  const { name, status, wallet, hand, bet, split, hands } = player;

  return (
    <div className="grid-item">
      <div>you</div>
      <div>{name}</div>
      <div>{wallet}</div>
      <div>{status}</div>
      <div>{bet}</div>
      <div>
        {hand.map((card, i) => (
          <Card card={card} key={i} />
        ))}
      </div>
      <div>
        {split && hands[0].map((card, i) => <Card card={card} key={`${i}0`} />)}
      </div>
      <div>
        {split && hands[1].map((card, i) => <Card card={card} key={`${i}1`} />)}
      </div>

      {!inGame && status === "spectator" && <BetPlacer />}
      {status === "playing" && <Plays player={player} />}
      {status === "bust" && <div>BUST</div>}
      {status === "stay" && <div>Stopped</div>}
    </div>
  );
};

export default You;
