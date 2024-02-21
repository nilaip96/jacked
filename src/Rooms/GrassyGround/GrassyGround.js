import React from "react";
import JoinRoom from "./JoinRoom";
import Chat from "./Chat";
import Table from "./Table.js";
import "./GrassyRoom.css";
import SyncRoom from "../SyncRoom.js";

const Room = () => (
  <div className="grassy-room">
    <div className="grassy-room-content">
      <Table />
      <Chat />
      <JoinRoom />
    </div>
    <SyncRoom />
  </div>
);

export default Room;
