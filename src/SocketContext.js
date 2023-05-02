import React, { createContext, useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const SocketContext = createContext();

const endPoint = "http://localhost:3001";

export function SocketProvider({ children }) {
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
}

export function useSocket() {
  return React.useContext(SocketContext);
}
