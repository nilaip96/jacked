import React from "react";

const Deck = ({ deck }) => {
  if (deck.length === 0) return;

  return (
    <div className="deck">
      <div className="suit heart">&hearts;</div>
      <div className="suit diamond">&diams;</div>
      <div className="suit club">&clubs;</div>
      <div className="suit spade">&spades;</div>
    </div>
  );
};

export default Deck;
