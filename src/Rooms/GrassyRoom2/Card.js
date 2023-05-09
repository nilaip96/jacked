import React from "react";
import "./Card.css";

const Suite = ({ suit }) => {
  switch (suit) {
    case "hearts":
      return <div className="cardSuit heart">&hearts;</div>;
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
