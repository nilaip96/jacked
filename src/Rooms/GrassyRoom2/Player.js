import React from "react";
import "./Dot.css";
import { getZIndex } from "../../utils";

const Player = ({ player }) => {
  const { position } = player
  const { x = 10, y = 10 } = position

  return (
      <div
        className="black-dot"
        style={{
          position: "absolute",
          top: `${y}%`,
          left: `${x}%`,
          zIndex: getZIndex(y) + 2,
          borderRadius: "50%",
          backgroundColor: "black",
          width: "20px",
          height: "20px",
        }}
      />
  ); 
};

export default Player;
