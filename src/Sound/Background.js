import React, { useState, useEffect, useRef } from "react";
import jazzComedy from "../assets/audio/tracks/jazzcomedy.mp3";

const Tracks = {
  jazzComedy,
};

const Background = () => {
  const [isMuted, setIsMuted] = useState(
    localStorage.getItem("mute-background") === "true"
  );
  const audioRefBackgroundMusic = useRef(null);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    localStorage.setItem("mute-background", newMuteState.toString());
    setIsMuted(newMuteState);
  };

  useEffect(() => {
    const tryPlayAudio = () => {
      audioRefBackgroundMusic.current.play().catch(() => {
        setTimeout(() => {
          if (!isMuted) tryPlayAudio();
        }, 1000);
      });
    };
    if (audioRefBackgroundMusic.current) {
      audioRefBackgroundMusic.current.loop = true;
      audioRefBackgroundMusic.current.muted = isMuted;
      audioRefBackgroundMusic.current.volume = 0.5;

      if (!isMuted) {
        tryPlayAudio();
      } else {
        audioRefBackgroundMusic.current.pause();
      }
    }
  }, [isMuted]);
  return (
    <>
      <button className={isMuted ? "muted" : ""} onClick={toggleMute}>
        BGM
      </button>
      <audio ref={audioRefBackgroundMusic} src={Tracks.jazzComedy} />
    </>
  );
};

export default Background;
