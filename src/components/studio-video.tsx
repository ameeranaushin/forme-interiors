"use client";

import { useEffect, useRef } from "react";
import styles from "./studio-video.module.css";

/** Decorative background that loops while any part of the studio remains in view. */
export function StudioVideo({ motionReduced }: { motionReduced: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const film = video.current;
    const frame = container.current;
    if (!film || !frame) return;
    let active = true;
    let inView = false;
    let pending = false;
    let retries = 0;
    let retryTimer = 0;
    const clearRetry = () => { window.clearTimeout(retryTimer); retryTimer = 0; };
    const shouldPlay = () => active && inView && !document.hidden && !motionReduced;

    // Set both the properties and reflected attributes before requesting mobile playback.
    film.defaultMuted = true;
    film.muted = true;
    film.playsInline = true;

    const syncPlayback = () => {
      film.autoplay = shouldPlay();
      if (!shouldPlay()) {
        clearRetry();
        film.pause();
        return;
      }
      if (!film.paused || pending) return;
      clearRetry();
      film.muted = true;
      pending = true;
      film.play().then(() => {
        pending = false;
        if (!active) return;
        clearRetry();
        retries = 0;
        if (!shouldPlay()) film.pause();
      }).catch((error: DOMException) => {
        pending = false;
        if (!shouldPlay() || error.name === "NotSupportedError" || retries >= 2) return;
        // A bounded retry handles temporary loading failures without polling indefinitely.
        retries += 1;
        retryTimer = window.setTimeout(syncPlayback, retries * 500);
      });
    };
    const retryFromPage = () => {
      const bounds = frame.getBoundingClientRect();
      inView = bounds.bottom > 0 && bounds.top < window.innerHeight && bounds.right > 0 && bounds.left < window.innerWidth;
      retries = 0;
      syncPlayback();
    };
    const guardNativePlayback = () => { if (!shouldPlay()) film.pause(); };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      retries = 0;
      syncPlayback();
    }, { threshold: 0 });
    const gestures = ["pointerdown", "touchend", "keydown"] as const;
    const mediaEvents = ["loadeddata", "canplay"] as const;
    observer.observe(frame);
    mediaEvents.forEach((event) => film.addEventListener(event, syncPlayback));
    film.addEventListener("play", guardNativePlayback);
    // A normal tap or completed swipe can unlock playback if Chrome rejected autoplay.
    gestures.forEach((event) => window.addEventListener(event, retryFromPage, { capture: true, passive: true }));
    window.addEventListener("pageshow", retryFromPage);
    document.addEventListener("visibilitychange", retryFromPage);
    syncPlayback();
    return () => {
      active = false;
      clearRetry();
      observer.disconnect();
      mediaEvents.forEach((event) => film.removeEventListener(event, syncPlayback));
      film.removeEventListener("play", guardNativePlayback);
      gestures.forEach((event) => window.removeEventListener(event, retryFromPage, true));
      window.removeEventListener("pageshow", retryFromPage);
      document.removeEventListener("visibilitychange", retryFromPage);
      film.autoplay = false;
      film.pause();
    };
  }, [motionReduced]);

  return <div ref={container} className={styles.frame} aria-hidden="true">
    <video ref={video} className={styles.video}
      src="/videos/studio-aesthetic-h264.mp4" poster="/videos/studio-aesthetic-poster.webp"
      autoPlay={!motionReduced} muted loop playsInline preload="auto" tabIndex={-1} />
  </div>;
}
