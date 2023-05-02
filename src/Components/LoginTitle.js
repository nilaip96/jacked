import React, { useEffect } from "react";
import { useAnimation, motion } from "framer-motion";

const LoginTitle = ({ text }) => {
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
    }, 2000); // 2 seconds delay.
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={controls}
      style={{ paddingBottom: "100px", fontSize: "50px" }}
    >
      {text}
    </motion.div>
  );
};
export default LoginTitle;
