import React, { useState, useEffect, useRef } from "react";
import "./Dot.css";
import { getZIndex, bestScore } from "../../utils";
import Card from "./Card";

const You = ({ player, messages = [], plays = [], selectedPlayIndex = 0 }) => {
  const { position, bets, id, name, wallet, status, hands } = player || {
    position: { x: 10, y: 10 },
    bets: [],
    hands: [],
  };

  const { x, y } = position;
  const [message, setMessage] = useState("");
  const timer = useRef(null);

  const handleMessages = () => {
    if (!messages.length) return;
    const lastMessage = messages.slice(-1)[0];
    if (lastMessage.source !== id) return;
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setMessage(lastMessage.text);
    timer.current = setTimeout(() => {
      setMessage("");
    }, 3000);

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
        width: "100px",
        height: "100px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ height: "40px" }}>{message}</div>
      <div
        className="black-dot"
        style={{
          borderRadius: "50%",
          backgroundColor: "black",
          width: "50px",
          height: "50px",
          color: "white",
        }}
      >
        <div>{name}</div>
        <div>{wallet}</div>
      </div>
      <div>{bets.reduce((sum, bet) => sum + bet, 0)}</div>
      <div>{status}</div>

      {status === "bust" && <div>BUST</div>}
      {status === "stay" && <div>Stopped</div>}
      {status === "playing" && (
        <>
          {plays.map((play, index) => (
            <div
              key={`play-${index}`}
              className={`play-option ${
                selectedPlayIndex === index ? "selected" : ""
              }`}
            >
              {play.toUpperCase()}
            </div>
          ))}
        </>
      )}
      {hands.map((hand, handIndex) => (
        <div
          key={`hand-${handIndex}`}
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {hand.map((card, i) => (
            <Card card={card} key={`card-${handIndex + i}`} />
          ))}
          <div>{bestScore(hand)}</div>
        </div>
      ))}
    </div>
  );
};

export default You;
