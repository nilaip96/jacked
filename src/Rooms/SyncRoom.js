import React, { useState, useEffect} from "react";
import { useSocket } from "../SocketContext";

const SyncRoom = () => {
  const  socket  = useSocket();
  const [ isLoaded, setLoaded ] = useState(false)
  
  useEffect(() => {
    if (isLoaded) {
      socket.emit('sync-room'); 
    }
  }, [socket, isLoaded]);

  useEffect(() => {
    setLoaded(true)
  }, []);

  return null
}

export default SyncRoom;