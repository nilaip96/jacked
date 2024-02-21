import React, { useState, useEffect } from "react";
import "./Table.css";
import Players from "./Players.js";
import Dealer from "./Dealer.js";
import { useSocket } from "../../SocketContext.js";
import { DealerProvider } from "../../DealerContext.js";

const Table = () => {
  return (
    <DealerProvider>
      <Dealer />
      <Players />
    </DealerProvider>
  );
};

export default Table;
