"use client";

import { useEffect, useRef, useState } from "react";

export default function Video() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const tryPlayWithAudio = async () => {
      video.muted = false;
      video.volume = 1;
      try {
        await video.play();
        setAutoplayBlocked(false);
      } catch {
        setAutoplayBlocked(true);
      }
    };

    tryPlayWithAudio();
  }, []);

  useEffect(() => {
    if (!autoplayBlocked) {
      return;
    }

    const tryResumeWithAudio = async () => {
      const video = videoRef.current;
      if (!video) {
        return;
      }

      video.muted = false;
      video.volume = 1;
      try {
        await video.play();
        setAutoplayBlocked(false);
      } catch {
        // Browser still blocks autoplay with audio.
      }
    };

    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "touchstart",
      "keydown",
      "scroll",
    ];

    events.forEach((eventName) =>
      window.addEventListener(eventName, tryResumeWithAudio, { passive: true })
    );

    return () => {
      events.forEach((eventName) =>
        window.removeEventListener(eventName, tryResumeWithAudio)
      );
    };
  }, [autoplayBlocked]);

  const enableAudio = async () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.muted = false;
    video.volume = 1;

    try {
      await video.play();
      setAutoplayBlocked(false);
    } catch {
      setAutoplayBlocked(true);
    }
  };

  return (
    <div className="video-shell">
      <video
        ref={videoRef}
        className="hero-video"
        preload="auto"
        autoPlay
        playsInline
        loop
      >
        <source src="/ip-tracker.mp4" type="video/mp4" />
      </video>

      {autoplayBlocked && (
        <button className="audio-btn" onClick={enableAudio} type="button">
          Enable sound
        </button>
      )}
    </div>
  );
}
