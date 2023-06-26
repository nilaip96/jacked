import React, { useMemo } from "react";
import "./GrassyRoom.css";
import {
  getRandomPosition,
  getRandomHorizontalShift,
  getRandomSaturatedLightColor,
  getRandomGreenColor,
  getRandomBrownColor,
  getRandomHeight,
  getRandomSize,
} from "../../utils.js";

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
}) => {
  const flower = useMemo(() => {
    const style = {
      left,
      top,
      fontSize: `${size + 8}px`,
      color,
      animationDuration: windTime,
      transform: `translateX(${horizontalShift}px)`,
      zIndex: zIndex,
    };
    const flowers = [
      <div className="Flower" style={style}>
        &hearts;
      </div>,
      <div className="Flower" style={style}>
        &diams;
      </div>,
      <div className="Flower" style={style}>
        &clubs;
      </div>,
      <div className="Flower" style={style}>
        &spades;
      </div>,
    ];

    const randomNumber = Math.floor(Math.random() * flowers.length);
    return flowers[randomNumber];
  }, [color, horizontalShift, left, size, top, windTime, zIndex]);

  return flower;
};

const Dirt = ({ left, top, size, backgroundColor }) => (
  <div
    className="Dirt"
    style={{
      left,
      top,
      height: `${size * 6}px`,
      width: `${size * 6}px`,
      backgroundColor,
    }}
  />
);

const GrassyBackground = React.memo(() => {
  const ground = useMemo(() => {
    const newGround = [];
    for (let i = 0; i < 500; i++) {
      const randomPosition = getRandomPosition();
      newGround.push(
        <Grass
          left={randomPosition.left}
          top={randomPosition.top}
          windTime={randomPosition.windTime}
          height={getRandomHeight()}
          color={getRandomGreenColor()}
          horizontalShift={getRandomHorizontalShift()}
          zIndex={randomPosition.zIndex}
          key={`grass_${i}`}
        />
      );
      if (i % 2 === 0) {
        newGround.push(
          <Flower
            left={randomPosition.leftFlower}
            top={randomPosition.topFlower}
            windTime={randomPosition.windTime}
            size={getRandomSize()}
            color={getRandomSaturatedLightColor()}
            horizontalShift={getRandomHorizontalShift()}
            zIndex={randomPosition.zIndex}
            key={`flower_${i}`}
          />
        );
      }
      if (i % 50 === 0) {
        const randomDirtPosition = getRandomPosition();
        newGround.push(
          <Dirt
            left={randomDirtPosition.left}
            top={randomDirtPosition.top}
            size={getRandomSize()}
            backgroundColor={getRandomBrownColor()}
            key={`dirt_${i}`}
          />
        );
        const randomDirtTwoPosition = getRandomPosition();

        newGround.push(
          <Dirt
            left={randomDirtTwoPosition.left}
            top={randomDirtTwoPosition.top}
            size={getRandomSize()}
            backgroundColor={getRandomGreenColor()}
            key={`dirt2_${i}`}
          />
        );
      }
    }
    return newGround;
  }, []);

  return <>{ground}</>;
});

export default GrassyBackground;
