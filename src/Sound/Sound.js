import "./Sound.css";
import SoundFX from "./SoundFX";
import Background from "./Background";
import React, { useEffect } from "react";
import { useAnimation, motion } from "framer-motion";

const Sound = () => {
  const controls = useAnimation();

  useEffect(() => {
    setTimeout(() => {
      controls.start({
        opacity: 1,
        transition: {
          duration: 4, // Fade-in duration in seconds.
          ease: "easeInOut",
        },
      });
    }, 4000); // 2 seconds delay.
  }, [controls]);

  return (
    <motion.div
      className="sound-container"
      initial={{ opacity: 0 }}
      animate={controls}
    >
      <Background />
      <SoundFX />
    </motion.div>
  );
};
export default Sound;
