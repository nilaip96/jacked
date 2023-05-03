

import React, { useMemo } from "react";
import "./GrassyRoom.css";
import { getRandomPosition, getRandomHorizontalShift, getRandomSaturatedLightColor, getRandomGreenColor, getRandomWindTime, getRandomHeight, getRandomSize } from "../utils.js";

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

const Flower = ({ left, top, windTime, size, color, horizontalShift }) => (
  <div
    className="Flower"
    style={{
      left,
      top,
      fontSize: `${size + 9}px`,
      color,
      animationDuration: `${windTime}s`,
      transform: `translateX(${horizontalShift}px)`,
    }}
  >
  ✿
  </div>
)

const GrassyBackground = React.memo(() => {
  const plants = useMemo(() => {
    const newPlants = [];
    for (let i = 0; i < 1000; i++) {
      const randomPosition = getRandomPosition();
      newPlants.push(
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
      if( i % 5 === 0 ){
        const flowerPosition = getRandomPosition();

        newPlants.push(
          <Flower
            left={flowerPosition.left}
            top={flowerPosition.top}
            windTime={getRandomWindTime()}
            size={getRandomSize()}
            color={getRandomSaturatedLightColor()}
            horizontalShift={getRandomHorizontalShift()}
            key={`flower_${i}`}
          />
        );
      }


    }
    return newPlants;
  }, [])


  return (
    <>{plants}</>
  );
});

export default GrassyBackground;
