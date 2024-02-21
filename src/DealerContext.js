// DealerContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext.js";

const DealerContext = createContext({
  deck: [],
  hand: [],
  tossed: [],
  hidden: false,
  wallet: 0,
});

export const useDealer = () => useContext(DealerContext);

export const DealerProvider = ({ children }) => {
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
      setDealer(newDealer);
    };

    socket.on("dealer-received", dealerEvent);

    return () => {
      socket.off("dealer-received", dealerEvent);
    };
  }, [socket]);

  return (
    <DealerContext.Provider value={{ dealer, setDealer }}>
      {children}
    </DealerContext.Provider>
  );
};
