import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "../../SocketContext.js";
import "./Chat.css";
import Interface from "./Interface.js";
const Chat = () => {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const messageEvent = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    const messagesEvent = (messages) => {
      setMessages(messages);
    };
    socket.on("message-received", messageEvent);
    socket.on("messages-received", messagesEvent);
    return () => {
      socket.off("message-received", messageEvent);
    };
  }, [socket]);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim().length) return;
    socket.emit("send-message", inputValue.trim());
    setInputValue("");
  };

  const handleKeyPress = ({ key }) => {
    if (key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <Interface />
      <div className="chat-messages">
        {messages.map(({ text, source, time, playerName }, i) => (
          <>
            <div>{`${time} || ${playerName || source}`}</div>
            <div key={i} className={"message"}>
              {text}
            </div>
          </>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <textarea
        className="chat-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        maxLength="300"
        onKeyPress={handleKeyPress}
      />
      <button className="send-button" onClick={sendMessage}>
        &#9650;
      </button>
    </div>
  );
};

export default Chat;
