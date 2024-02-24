import React, { useState, useEffect } from "react";
import { useSocket } from "../../SocketContext.js";
import Card from "./Card.js";
import Deck from "./Deck.js";
import { bestScore } from "../../utils.js";
import "./Dealer.css";
import saki from "../../assets/images/saki_happy.png";
import reina from "../../assets/images/reina_laugh.png";
import "./Dealer.css";
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
    <div className="dealer-container">
      <div className="Dealer">
        <img className="Saki" src={saki} alt="Dealer Saki" />
        <div>
          {hand.map((card, i) =>
            hidden && i === 0 ? (
              <Deck deck={["HIDDEN_CARD"]} key={"HIDDEN" + i} />
            ) : (
              <Card card={card} key={i} />
            )
          )}
        </div>
        <img className="Reina" src={reina} alt={"Dealer Saki"} />
      </div>
    </div>
  );
};

export default Dealer;
