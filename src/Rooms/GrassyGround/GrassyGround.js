import React from "react";
import Chat from "./Chat";
import Table from "./Table.js";
import "./GrassyRoom.css";
import { PlayersProvider } from "../../PlayersContext.js";
import SyncRoom from "../SyncRoom.js";

const Room = () => (
  <PlayersProvider>

  <div className="grassy-room">
    <div className="grassy-room-content">
      <Table />
      <Chat />
    </div>
    <SyncRoom />
  </div>
  </PlayersProvider>
);

export default Room;
