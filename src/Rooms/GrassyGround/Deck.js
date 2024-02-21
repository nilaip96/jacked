import React from "react";
import diamond from "../../assets/images/diamond.png";
import heart from "../../assets/images/heart.png";
import club from "../../assets/images/club.png";
import spade from "../../assets/images/spade.png";

const Deck = ({ deck }) => {
  if (deck.length === 0) return;

  return (
    <div className="deck">
      <img className="suit" src={heart} alt="heart" />
      <img className="suit" src={diamond} alt="diamond" />
      <img className="suit" src={club} alt="club" />
      <img className="suit" src={spade} alt="spade" />
    </div>
  );
};

export default Deck;
