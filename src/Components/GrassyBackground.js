

import React, { useMemo } from "react";
import "./GrassyRoom.css";
import { getRandomPosition, getRandomHorizontalShift, getRandomGreenColor, getRandomWindTime, getRandomHeight } from "../utils.js";

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
)

const GrassyBackground = React.memo(() => {
  const grass = useMemo(() => {
    const newGrass = [];
    for (let i = 0; i < 1000; i++) {
      const randomPosition = getRandomPosition();
      newGrass.push(
        <Grass
          left={randomPosition.left}
          top={randomPosition.top}
          windTime={getRandomWindTime()}
          height={getRandomHeight()}
          color={getRandomGreenColor()}
          horizontalShift={getRandomHorizontalShift()}
          key={`grass_${i}`}
        />
      );
    }
    return newGrass;
  }, [])


  return (
    <>{grass}</>
  );
});

export default GrassyBackground;
