import React from "react";
import Rooms from "./Rooms/Rooms.js";
import { SocketProvider } from "./SocketContext";
import "./Styles.css";
import Sound from "./Sound/Sound.js";

const App = () => (
  <SocketProvider>
    <Rooms />
    <Sound />
  </SocketProvider>
);

export default App;
