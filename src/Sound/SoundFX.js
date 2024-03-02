import React, { useState, useEffect, useRef } from "react";
import shortCluck from "../assets/audio/clips/Chicken-Clucking-Short.mp3";
import crowC from "../assets/audio/clips/Rooster-Crowing-C.mp3";
import crowE from "../assets/audio/clips/Rooster-Crowing-E.mp3";
import multiCluck from "../assets/audio/clips/Rooster-Multiple-Clucks.mp3";
import smallCluck from "../assets/audio/clips/Three-Small-Chicken-Clucks.mp3";
import cashRegister from "../assets/audio/clips/cash-register.mp3";
import { useSocket } from "../SocketContext";
const Clips = {
  shortCluck,
  crowC,
  crowE,
  multiCluck,
  smallCluck,
  cashRegister,
};

const SoundFX = () => {
  const socket = useSocket();
  const [isMuted, setIsMuted] = useState(
    localStorage.getItem("mute-fx") === "true"
  );
  const shortCluck = useRef(null);
  const crowC = useRef(null);
  const crowE = useRef(null);
  const multiCluck = useRef(null);
  const smallCluck = useRef(null);
  const cashRegister = useRef(null);
  const audio = [
    [shortCluck, Clips["shortCluck"]],
    [crowC, Clips["crowC"]],
    [crowE, Clips["crowE"]],
    [multiCluck, Clips["multiCluck"]],
    [smallCluck, Clips["smallCluck"]],
    [cashRegister, Clips["cashRegister"]],
  ];
  const toggleMute = () => {
    const newMuteState = !isMuted;
    localStorage.setItem("mute-fx", newMuteState.toString());
    setIsMuted(newMuteState);
  };

  useEffect(() => {
    const handleSound = (type) => {
      const map = {
        hit: shortCluck,
        bet: cashRegister,
        won: cashRegister,
        stay: smallCluck,
        lost: crowC,
        bust: multiCluck,
        join: crowC,
        leave: crowE,
        push: smallCluck,
        message: [shortCluck, multiCluck, smallCluck][
          Math.floor(Math.random() * 3)
        ],
      };

      const soundToPlay = map[type];
      if (!soundToPlay?.current) return;
      soundToPlay.current.play();
    };

    socket?.on("sound", handleSound);

    return () => {
      socket?.off("sound", handleSound); // Cleanup
    };
  }, [socket]);

  if (!socket) return null;
  return (
    <>
      <button className={isMuted ? "muted" : ""} onClick={toggleMute}>
        FX
      </button>
      {audio.map(([ref, src]) => (
        <audio ref={ref} muted={isMuted} src={src} />
      ))}
    </>
  );
};

export default SoundFX;
