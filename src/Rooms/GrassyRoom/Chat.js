import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "../../SocketContext.js";
import "./Chat.css";

const Chat = ({ chatOpen, messages, closeChat, name }) => {
  const socket = useSocket();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target)
      ) {
        closeChat();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeChat]);

  const scrollToBottom = () => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (chatOpen) {
      document.querySelector(".transparent-input").focus();
    }
  }, [chatOpen]);

  const sendMessage = () => {
    socket.emit("send-message", inputValue);
    setInputValue("");
  };

  const joinRoom = () => {
    const room = inputValue.split(" ")[1];
    if (!room) return;
    socket.emit("leave-room").emit("join-room", room, name).emit("sync-room");
    setInputValue("");
  };

  const handleKeyPress = ({ key }) => {
    if (key !== "Enter") return;

    if (inputValue === "") {
      closeChat();
    } else if (inputValue.startsWith("join")) {
      joinRoom();
    } else {
      sendMessage();
    }
  };

  if (!chatOpen) return null;
  return (
    <div className="transparent-chat" ref={chatContainerRef}>
      <div className="transparent-messages">
        {messages.map(({ text, source, time, playerName }, i) => (
          <div key={i}>{`${time} || ${playerName || source} || ${text}`}</div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <input
        className="transparent-input"
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

export default Chat;
