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
    let inView = false;
    const syncPlayback = () => {
      if (inView && !document.hidden && !motionReduced) film.play().catch(() => undefined);
      else film.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0 });
    observer.observe(frame);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      film.pause();
    };
  }, [motionReduced]);

  return <div ref={container} className={styles.frame} aria-hidden="true">
    <video ref={video} className={styles.video}
      src="/videos/studio-aesthetic.mp4" poster="/videos/studio-aesthetic-poster.webp"
      muted loop playsInline preload="metadata" tabIndex={-1} />
  </div>;
}
