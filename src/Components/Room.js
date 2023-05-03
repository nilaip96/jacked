import React from "react";
import JoinRoom from "./JoinRoom";
import Chat from "./Chat";
import Table from "./Table.js";

const Room = () => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <Table />
    <Chat />
    <JoinRoom />
  </div>
);

export default Room;
