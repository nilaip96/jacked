import React from "react";
import JoinRoom from "./JoinRoom";
import Chat from "./Chat";
import Table from "./Table.js";
import "./GrassyRoom.css";
import SyncRoom from "../SyncRoom.js";
import backgroundImage from "../../assets/images/background-reflection.webp";

const Room = () => (
  <div
    className="grassy-room"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div className="grassy-room-content">
      <Table />
      <Chat />
    </div>
    <SyncRoom />
  </div>
);

export default Room;
