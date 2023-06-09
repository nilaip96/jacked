import React, { useState, useEffect, useMemo } from "react";
import JoinRoom from "./JoinRoomLogin";
import PlayerName from "./PlayerName.js";

import "./Login.css";
import LoginTitle from "./LoginTitle";
import { useAnimation, motion } from "framer-motion";
import {
  getRandomPosition,
  getRandomTwinkleTime,
  getRandomSize,
  getRandomLightColor,
} from "../../utils.js";

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

const Login = () => {
  const [name, setName] = useState("");
  const controls = useAnimation();
  const stars = useMemo(() => {
    const newStars = [];
    for (let i = 0; i < 50; i++) {
      const randomPosition = getRandomPosition();
      newStars.push(
        <Star
          left={randomPosition.left}
          top={randomPosition.top}
          twinkleTime={getRandomTwinkleTime()}
          size={getRandomSize()}
          color={getRandomLightColor()}
          key={`star_${i}`}
        />
      );
    }
    return newStars;
  }, []);

  useEffect(() => {
    setTimeout(() => {
      controls.start({
        opacity: 1,
        transition: {
          duration: 4,
          ease: "easeInOut",
        },
      });
    }, 2000);
  }, [controls]);

  return (
    <div className="Login">
      <motion.div
        className="login-content"
        initial={{ opacity: 0 }}
        animate={controls}
      >
        <LoginTitle text={"JACKED"} />
        <PlayerName name={name} setName={setName} />
        <JoinRoom name={name} />
      </motion.div>
      {stars}
    </div>
  );
};

export default Login;
