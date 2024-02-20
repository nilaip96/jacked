import React, { createContext, useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const SocketContext = createContext();

const endPoint = "https://jacked-1.onrender.com";

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
