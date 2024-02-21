import React from "react";
import "./Card.css";
import diamond from "../../assets/images/diamond.png";
import heart from "../../assets/images/heart.png";
import club from "../../assets/images/club.png";
import spade from "../../assets/images/spade.png";

const Suite = ({ suit }) => {
  switch (suit) {
    case "hearts":
      return <img src={heart} alt="heart" />;
    case "diamonds":
      return <img src={diamond} alt="diamond" />;
    case "clubs":
      return <img src={club} alt="club" />;
    case "spades":
      return <img src={spade} alt="spade" />;
    default:
      return;
  }
};

const Card = ({ card }) => (
  <div className="card">
    <div className="value">{card.value}</div>
    <Suite className="suit" suit={card.suit} />
  </div>
);

export default Card;
