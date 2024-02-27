import React from "react";
import "./Player.css";
import Card from "./Card.js";
import { bestScore } from "../../utils.js";
import Chicken from "./Chicken.js";

const Player = ({ player }) => {
  const { name, status, wallet = 0, hands = [], bets = [] } = player;

  return (
    <div className="grid-item">
      <div
        className={`slot stats ${
          status === "won" ? "won" : status === "bust" ? "bust" : ""
        }`}
      >
        <div>{wallet}</div>
        <div>{name}</div>
        <Chicken status={status} />
      </div>
      {hands.map((hand, handIndex) =>
        (bets.length === 0 || bets[handIndex] === 0) &&
        hand.length === 0 ? null : (
          <div
            className={`slot hand ${
              bestScore(hand) > 21 ||
              status === "push" ||
              status === "lost" ||
              status === "bust"
                ? "bust"
                : ""
            }`}
            style={{
              animationDuration:
                status === "won"
                  ? "0.5s"
                  : `${
                      hand.length === 0
                        ? 1
                        : 8 - Math.floor(bestScore(hand) / 3)
                    }s`,
            }}
            key={`hand-${handIndex}`}
          >
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
export default Player;
