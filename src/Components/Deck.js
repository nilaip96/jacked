import React from "react";

const Deck = ({ deck }) => {
  if (deck.length === 0) return;

  return (
    <div className="deck">
      <div className="cardSuit heart">&hearts;</div>
      <div className="cardSuit diamond">&diams;</div>
      <div className="cardSuit club">&clubs;</div>
      <div className="cardSuit spade">&spades;</div>
    </div>
  );
};

export default Deck;
