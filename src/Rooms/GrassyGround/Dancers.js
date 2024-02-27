import React, { useState, useEffect } from "react";
import { red, blue, blonde } from "../../assets/images/dancers.js";

const Dancers = ({ dealer }) => {
  const [loaded, setLoaded] = useState(false);
  const { hand, deck, tossed, hidden, wallet } = dealer;
  const current = hidden ? (hand.length === 0 ? "walk" : "dance") : "swing";

  useEffect(() => {
    const loadImage = (image) => {
      return new Promise((resolve, reject) => {
        const loadImg = new Image();
        loadImg.src = image;
        loadImg.onload = () => resolve(image.url);
        loadImg.onerror = (err) => reject(err);
      });
    };
    const promises = [red, blue, blonde].reduce((acc, cur) => {
      Object.values(cur).forEach((image) => {
        acc.push(loadImage(image));
      });
      return acc;
    }, []);

    Promise.all(promises).then(() => setLoaded(true));
  }, []);

  return (
    loaded && (
      <div className="Dancers">
        <img className="Dancer red" alt="red dancer" src={red[current]} />
        <img
          className="Dancer blonde"
          alt="blonde dancer"
          src={blonde[current]}
        />
        <img className="Dancer blue" alt="blue dancer" src={blue[current]} />
      </div>
    )
  );
};

export default Dancers;
