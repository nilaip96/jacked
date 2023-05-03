import React from "react";
import GRASS from "./Grass.js";

const Grass = ({ left, top, windTime, height, color, horizontalShift }) => (
  <div
    className="Grass"
    style={{
      left,
      top,
      height: `${height}px`,
      backgroundColor: color,
      animationDuration: `${windTime}s`,
      transform: `translateX(${horizontalShift}px)`,
    }}
  />
);

const GrassyBackground = () => (
  <>
    {GRASS.map((props) => (
      <Grass {...props} />
    ))}
  </>
);

export default GrassyBackground;
