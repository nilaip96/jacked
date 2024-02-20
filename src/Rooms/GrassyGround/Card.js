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
      return <div className="cardSuit diamond">&diams;</div>;
    case "clubs":
      return <div className="cardSuit club">&clubs;</div>;
    case "spades":
      return <div className="cardSuit spade">&spades;</div>;
    default:
      return;
  }
};

const Card = ({ card }) => (
  <div className="card">
    <div className="cardValue">{card.value}</div>
    <Suite suit={card.suit} />
  </div>
);

export default Card;
