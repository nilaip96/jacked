import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "../../SocketContext.js";
import "../Input.css";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
  startInputAnimation,
  startTypingAnimation,
} from "./LoginPageAnimations.js";

const JoinRoom = ({ name }) => {
  const socket = useSocket();
  const [room, setRoom] = useState("");
  const controls = useAnimation();
  const typingControls = useAnimation();
  const buttonControls = useAnimation();
  const inputRef = useRef(null);
  const buttonVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };
  const mountedRef = useRef(true);
  const [hoverFlag, setHoverFlag] = useState(false);
  const handleMouseEnter = () => {
    setHoverFlag(true);
  };

  const handleMouseLeave = () => {
    setHoverFlag(false);
  };
  const handleInputChange = ({ target }) => {
    setRoom(target.value);
    startTypingAnimation(typingControls);
  };

  useEffect(() => {
    startInputAnimation(controls, inputRef);
  }, [controls]);

  const joinRoom = (event) => {
    event.preventDefault();
    if (room.length === 0) return;
    socket.emit("join-room", room, name);
  };

  useEffect(() => {
    const runAway = () => {
      const newPositionX = Math.random() * 50;
      const newPositionY = Math.random() * 50;
      buttonControls.start({
        x: newPositionX,
        y: newPositionY,
        transition: {
          ease: "easeOut",
          duration: 0.3,
        },
      });
    };

    if (hoverFlag) {
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          runAway();
        }
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [hoverFlag, buttonControls]);

  return (
    <>
      <motion.div className={"login-join-room-container"} animate={controls}>
        <motion.input
          className={"login-input"}
          type="text"
          value={room}
          placeholder="Enter Room ID"
          onChange={handleInputChange}
          animate={typingControls}
          maxLength="12"
        />
      </motion.div>
      <motion.div
        animate={buttonControls}
        style={{ height: "64px", width: "256px" }}
      >
        <AnimatePresence>
          {room.length !== 0 && (
            <motion.button
              className={"login-button"}
              onClick={joinRoom}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={buttonVariants}
              onMouseEnter={handleMouseEnter} // Update event handler here
              onMouseLeave={handleMouseLeave} // Add onMouseLeave event handler
              transition={{ ease: "easeInOut", duration: 0.5 }}
            >
              Join Room
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default JoinRoom;
