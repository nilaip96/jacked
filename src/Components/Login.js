import React, { useState, useEffect } from "react";
import JoinRoom from "./JoinRoomLogin";
import PlayerName from "./PlayerName.js";

import "./Login.css";
import LoginTitle from "./LoginTitle";

const Star = ({ left, top, twinkleTime, size, color }) => (
  <div
    className="Star"
    style={{
      left,
      top,
      backgroundColor: color,
      animationDuration: `${twinkleTime}s`,
      height: `${size}px`,
      width: `${size}px`,
    }}
  />
);

const Login = ({ app, setApp }) => {
  const [name, setName] = useState("");
  const [stars, setStars] = useState([]);

  const getRandomPosition = () => {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    return { left: `${x}%`, top: `${y}%` };
  };

  const getRandomTwinkleTime = () => 1 + Math.random() * 7;

  const getRandomSize = () => 1 + Math.floor(Math.random() * 5);

  const getRandomColor = () => {
    const minColorValue = 128;
    const maxColorValue = 255;

    const r = Math.floor(
      Math.random() * (maxColorValue - minColorValue) + minColorValue
    );
    const g = Math.floor(
      Math.random() * (maxColorValue - minColorValue) + minColorValue
    );
    const b = Math.floor(
      Math.random() * (maxColorValue - minColorValue) + minColorValue
    );
    return `rgb(${r},${g},${b})`;
  };

  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < 100; i++) {
      const randomPosition = getRandomPosition();
      newStars.push(
        <Star
          left={randomPosition.left}
          top={randomPosition.top}
          twinkleTime={getRandomTwinkleTime()}
          size={getRandomSize()}
          color={getRandomColor()}
          key={`star_${i}`}
        />
      );
    }
    setStars(newStars);
  }, []);
  return (
    <div className="Login">
      <LoginTitle text={"JACKED"} />
      <PlayerName name={name} setName={setName} />
      <JoinRoom app={app} setApp={setApp} name={name} />
      {stars}
    </div>
  );
};

export default Login;
