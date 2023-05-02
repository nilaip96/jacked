import React from "react";
import JoinRoom from "./JoinRoom";
import Chat from "./Chat";
import Table from "./Table.js";

function Room({ app, setApp }) {
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Table />
        <Chat />
        <JoinRoom app={app} setApp={setApp} />
      </div>
    </div>
  );
}

export default Room;
