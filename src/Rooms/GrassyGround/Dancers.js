import React, { useState, useEffect } from "react";
import { red, blue, blonde } from "../../assets/images/dancers.js";

const Dancers = ({ dealer }) => {
  const [loaded, setLoaded] = useState(false);
  const { hand, hidden } = dealer;
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
        {["walk", "dance", "swing"].map((move) => (
          <>
            <img
              className={`Dancer red ${move !== current ? "hiding" : ""}`}
              alt="red dancer"
              src={red[move]}
            />
            <img
              className={`Dancer blonde ${move !== current ? "hiding" : ""}`}
              alt="blonde dancer"
              src={blonde[move]}
            />
            <img
              className={`Dancer blue ${move !== current ? "hiding" : ""}`}
              alt="blue dancer"
              src={blue[move]}
            />
          </>
        ))}
      </div>
    )
  );
};

export default Dancers;
