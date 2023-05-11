import { useState, useEffect } from "react";
import { useSocket } from "../SocketContext";

// this is used to sync the room after all react components have loaded
const SyncRoom = () => {
  const socket = useSocket();
  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      socket.emit("sync-room");
    }
  }, [socket, isLoaded]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return null;
};

export default SyncRoom;
