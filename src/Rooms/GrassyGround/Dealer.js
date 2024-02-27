import React, { useState, useEffect } from "react";
import { useSocket } from "../../SocketContext.js";
import Card from "./Card.js";
import Deck from "./Deck.js";
import { bestScore } from "../../utils.js";
import "./Dealer.css";
import Dancers from "./Dancers.js";
import background from "../../assets/images/background.gif";

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

  const { hand, hidden } = dealer;
  return (
    <div
      className="dealer-container"
      style={{ background: `url("${background}") center/cover no-repeat` }}
    >
      <Dancers dealer={dealer} />
      <div className="Dealer">
        {hand.length > 0 && (
          <div
            className={`hand ${bestScore(hand) > 21 ? "bust" : ""}`}
            style={{
              animationDuration: `1s`,
            }}
          >
            {hand.map((card, i) =>
              hidden && i === 0 ? (
                <Deck deck={["HIDDEN_CARD"]} key={"HIDDEN" + i} />
              ) : (
                <Card card={card} key={i} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dealer;
