import React, { useState, useEffect, useRef } from "react";
import "./Dot.css";
import { getZIndex } from "../../utils";

const Player = ({ player, messages }) => {
  const { position, bets = [], id, name } = player;
  const { x = 10, y = 10 } = position;
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
      <div style={{ height: "10px" }}>{name}</div>
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
        {bets.reduce((acc, cur) => acc + cur, 0)}
      </div>
    </div>
  );
};

export default Player;
