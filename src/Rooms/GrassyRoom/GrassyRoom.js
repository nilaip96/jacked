import React from "react";
import JoinRoom from "./JoinRoom";
import Chat from "./Chat";
import Table from "./Table.js";
import "./GrassyRoom.css";
import GrassyBackground from "./GrassyBackground.js";
import SyncRoom from "../SyncRoom.js"


const Room = () => {
  return (
    <div className="grassy-room">
      <div className="grassy-room-content">
        <Table />
        <Chat />
        <JoinRoom />
      </div>
      <GrassyBackground />

      <SyncRoom />
    </div>
  );
};

export default Room;
