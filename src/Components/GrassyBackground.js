import React, { useMemo } from "react";
import "./GrassyRoom.css";
import {
  getRandomPosition,
  getRandomHorizontalShift,
  getRandomSaturatedLightColor,
  getRandomGreenColor,
  getRandomHeight,
  getRandomSize,
} from "../utils.js";

const Grass = ({
  left,
  top,
  windTime,
  height,
  color,
  horizontalShift,
  zIndex,
}) => (
  <div
    className="Grass"
    style={{
      left,
      top,
      height: `${height + 3}px`,
      backgroundColor: color,
      animationDuration: windTime,
      transform: `translateX(${horizontalShift}px)`,
      zIndex: zIndex,
    }}
  />
);

const Flower = ({
  left,
  top,
  windTime,
  size,
  color,
  horizontalShift,
  zIndex,
}) => (
  <div
    className="Flower"
    style={{
      left,
      top,
      fontSize: `${size + 12}px`,
      color,
      animationDuration: windTime,
      transform: `translateX(${horizontalShift}px)`,
      zIndex: zIndex,
    }}
  >
    ✿
  </div>
);

const GrassyBackground = React.memo(() => {
  const plants = useMemo(() => {
    const newPlants = [];
    for (let i = 0; i < 1000; i++) {
      const randomPosition = getRandomPosition();
      newPlants.push(
        <Grass
          left={randomPosition.left}
          top={randomPosition.top}
          windTime={randomPosition.windTime}
          height={getRandomHeight()}
          color={getRandomGreenColor()}
          horizontalShift={getRandomHorizontalShift()}
          key={`grass_${i}`}
          zIndex={randomPosition.zIndex}
        />
      );
      if (i % 2 === 0) {
        newPlants.push(
          <Flower
            left={randomPosition.leftFlower}
            top={randomPosition.topFlower}
            windTime={randomPosition.windTime}
            size={getRandomSize()}
            color={getRandomSaturatedLightColor()}
            horizontalShift={getRandomHorizontalShift()}
            key={`flower_${i}`}
            zIndex={randomPosition.zIndex}
          />
        );
      }
    }
    return newPlants;
  }, []);

  return <>{plants}</>;
});

export default GrassyBackground;
