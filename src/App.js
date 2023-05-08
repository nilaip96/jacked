import React from "react";
import Rooms from "./Rooms/Rooms.js";
import { SocketProvider } from "./SocketContext";
import "./Styles.css";

const App = () => (
  <SocketProvider>
    <Rooms />
  </SocketProvider>
);

export default App;
