import React from "react";

import Card from "./Card.js";
import Deck from "./Deck.js";
import { bestScore } from "../../utils.js";

const Dealer = ({ dealer }) => {
  const { hand, deck, tossed, hidden, wallet, position } = dealer;
  const { x = 45, y = 10 } = position;
  return (
    <div style={{ position: "relative", top: `${y}%`, left: `${x}%` }}>
      <div>Dealer</div>
      <div>{wallet}</div>
      <div>
        {hand.map((card, i) =>
          hidden && i === 0 ? (
            <Deck deck={["HIDDEN_CARD"]} key={"HIDDEN" + i} />
          ) : (
            <Card card={card} key={i} />
          )
        )}
        {!hidden && bestScore(hand)}
      </div>
      <div>{`Tossed Count: ${tossed.length}`}</div>
      <div>{`Deck Count: ${deck.length}`}</div>
      <Deck deck={deck} />
    </div>
  );
};

export default Dealer;
