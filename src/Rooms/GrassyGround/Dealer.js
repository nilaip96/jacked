import React from "react";

import Card from "./Card.js";
import Deck from "./Deck.js";
import { bestScore } from "../../utils.js";
import { useDealer } from "../../DealerContext.js";
const Dealer = () => {
  const { hand, deck, tossed, hidden, wallet } = useDealer();
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div>Dealer</div>
      <div>{wallet}</div>
      <div>
        {hand?.map((card, i) =>
          hidden && i === 0 ? (
            <Deck deck={["HIDDEN_CARD"]} key={"HIDDEN" + i} />
          ) : (
            <Card card={card} key={i} />
          )
        )}
      </div>
      <div>{hand && bestScore(hand)}</div>
      <div>{`Tossed Count: ${tossed.length}`}</div>
      <div>{`Deck Count: ${deck.length}`}</div>
      <Deck deck={deck} />
    </div>
  );
};

export default Dealer;
