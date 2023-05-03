import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "../SocketContext.js";
import "./Chat.css";

const Chat = () => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const messageEvent = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    socket.on("message-received", messageEvent);

    return () => {
      socket.off("message-received", messageEvent);
    };
  }, [socket]);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    socket.emit("send-message", inputValue);
    setInputValue("");
  };

  const handleKeyPress = ({ key }) => {
    if (key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map(({ text, source, time }, i) => (
          <div key={i}>{`${time} || ${source} || ${text}`}</div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <input
        className="chat-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button style={{ width: "60px" }} onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default Chat;
