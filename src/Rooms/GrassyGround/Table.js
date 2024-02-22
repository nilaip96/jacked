import React from "react";
import "./Table.css";
import Players from "./Players.js";
import Dealer from "./Dealer.js";

const Table = () => {
  //hand event

  //dealer event

  return (
    <div className="table-container">
      <Dealer />
      <Players />
    </div>
  );
};

export default Table;
