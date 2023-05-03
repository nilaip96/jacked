import React, { useEffect, useRef } from "react";
import "./Input.css";
import { motion, useAnimation } from "framer-motion";
import {
  startTypingAnimation,
  startInputAnimation,
} from "./LoginPageAnimations";

const PlayerName = ({ name, setName }) => {
  const controls = useAnimation();
  const typingControls = useAnimation();
  const inputRef = useRef(null);

  const handleInputChange = ({ target }) => {
    setName(target.value);
    startTypingAnimation(typingControls);
  };

  useEffect(() => {
    startInputAnimation(controls, inputRef);
  }, [controls]);

  return (
    <motion.div initial={{ x: 0 }} animate={controls}>
      <motion.input
        ref={inputRef}
        type="text"
        value={name}
        onChange={handleInputChange}
        placeholder="Username"
        className="login-input"
        animate={typingControls}
      />
    </motion.div>
  );
};

export default PlayerName;
