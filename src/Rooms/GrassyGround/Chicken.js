import React, { useState, useEffect, useMemo } from "react";
import { brown, light } from "../../assets/images/chicken.js";

const statusMap = {
  spectator: "rest",
  ready: "strut",
  playing: "run",
  bust: "rest",
  stay: "feed",
  won: "run",
  push: "strut",
  lost: "rest",
};

const Dancers = ({ status }) => {
  const [loaded, setLoaded] = useState(false);
  const chicken = useMemo(() => {
    const options = [brown, light];
    return options[Math.floor(Math.random() * options.length)];
  }, []);

  useEffect(() => {
    const loadImage = (image) => {
      return new Promise((resolve, reject) => {
        const loadImg = new Image();
        loadImg.src = image;
        loadImg.onload = () => resolve(image.url);
        loadImg.onerror = (err) => reject(err);
      });
    };
    const promises = [brown, light].reduce((acc, cur) => {
      Object.values(cur).forEach((image) => {
        acc.push(loadImage(image));
      });
      return acc;
    }, []);

    Promise.all(promises).then(() => setLoaded(true));
  }, []);

  return (
    loaded && (
      <img
        className="Chicken"
        alt="red dancer"
        src={chicken[statusMap[status]]}
      />
    )
  );
};

export default Dancers;
