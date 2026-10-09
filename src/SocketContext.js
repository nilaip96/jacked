import React, { createContext, useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const SocketContext = createContext();

// In production the Express server serves the client, so connect to the same
// origin. In development the CRA dev server (3001) talks to the API on 3000.
const endPoint =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000";

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = socketIOClient(endPoint);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => React.useContext(SocketContext);
