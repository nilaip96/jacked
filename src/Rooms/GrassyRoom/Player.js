import React, { useState, useEffect, useRef } from "react";
import "./Dot.css";
import { getZIndex, bestScore } from "../../utils";
import Card from "./Card";

const Player = ({ player, messages }) => {
  const {
    position = { x: 10, y: 10 },
    bets = [],
    id,
    name,
    wallet,
    status,
    hands = [[]],
  } = player;

  const { x, y } = position;
  const [message, setMessage] = useState("");
  const timer = useRef(null);

  const handleMessages = () => {
    if (messages.length) {
      const lastMessage = messages.slice(-1)[0];
      if (lastMessage.source === id) {
        if (timer.current) {
          clearTimeout(timer.current);
        }
        setMessage(lastMessage.text);
        timer.current = setTimeout(() => {
          setMessage("");
        }, 3000);
      }
    }
    return () => {
      clearTimeout(timer.current);
    };
  };

  useEffect(handleMessages, [messages, id, setMessage]);

  return (
    <div
      className="player"
      style={{
        position: "absolute",
        top: `${y}%`,
        left: `${x}%`,
        zIndex: getZIndex(y) + 2,
        width: "40px",
        height: "40px",
      }}
    >
      <div style={{ height: "10px" }}>{message}</div>
      <div
        className="black-dot"
        style={{
          borderRadius: "50%",
          backgroundColor: "black",
          width: "20px",
          height: "20px",
          color: "white",
        }}
      >
        <div>{name}</div>
        <div>{wallet}</div>
        <div>{status}</div>
        <div>{bets.reduce((sum, bet) => sum + bet, 0)}</div>
        {hands.map((hand, handIndex) => (
          <div key={`hand-${handIndex}`}>
            {hand.map((card, i) => (
              <Card card={card} key={`card-${handIndex + i}`} />
            ))}
            <div>{bestScore(hand)}</div>
          </div>
        ))}
        {status === "bust" && <div>BUST</div>}
        {status === "stay" && <div>Stopped</div>}
      </div>
    </div>
  );
};

export default Player;
