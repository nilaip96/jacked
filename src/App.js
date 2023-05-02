import React, { useState } from "react";
import Login from "./Components/Login.js";
import Room from "./Components/Room.js";
import { SocketProvider } from "./SocketContext";
import "./Styles.css";

function App() {
  const [app, setApp] = useState("login");

  return (
    <SocketProvider>
      {app === "login" && <Login app={app} setApp={setApp} />}
      {app === "room" && <Room app={app} setApp={setApp} />}
    </SocketProvider>
  );
}

export default App;
