import React, { useState, useEffect } from "react";
import { useSocket } from "../../SocketContext.js";

import Card from "./Card.js";
import Deck from "./Deck.js";
import { bestScore } from "../../utils.js";
import './Dealer.css'
const Dealer = () => {
  const socket = useSocket();

  const [dealer, setDealer] = useState({
    deck: [],
    hand: [],
    tossed: [],
    hidden: false,
    wallet: 0,
  });

  useEffect(() => {
    const dealerEvent = (newDealer) => {
      setDealer(() => newDealer);
    };

    socket.on("dealer-received", dealerEvent);

    return () => {
      socket.off("dealer-received", dealerEvent);
    };
  }, [dealer, socket]);

  const { hand, deck, tossed, hidden, wallet } = dealer;
  return (
    <div
      className="Dealer"
    >
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
      </div>
      <div>{bestScore(hand)}</div>
      <div>{`Tossed Count: ${tossed.length}`}</div>
      <div>{`Deck Count: ${deck.length}`}</div>
      <Deck deck={deck} />
    </div>
  );
};

export default Dealer;
