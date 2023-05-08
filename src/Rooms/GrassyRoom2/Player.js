import React from "react";
import "./Dot.css";
import { getZIndex } from "../../utils";

const Player = ({ position }) => {
  return (
    <div
      className="black-dot"
      style={{
        position: "absolute",
        top: `${position.y}%`,
        left: `${position.x}%`,
        zIndex: getZIndex(position.y) + 2.5,
        borderRadius: "50%",
        backgroundColor: "black",
        width: "20px",
        height: "20px",
      }}
    />
  );
};

export default Player;
