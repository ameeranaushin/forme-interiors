"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/animation/gsap";
import { useMotion } from "./use-motion";

/** Track must contain two identical, equal-width, non-interactive groups. */
export function useInfiniteLoop(scope: RefObject<HTMLElement | null>, paused = false, duration = 24) {
  const tween = useRef<gsap.core.Tween | null>(null);
  const pauseRequested = useRef(paused);
  const sync = useRef<() => void>(() => {});
  useMotion(scope, () => {
    const track = scope.current?.querySelector<HTMLElement>("[data-loop-track]");
    if (!track || !scope.current) return;
    let visible = true;
    tween.current = gsap.to(track, { xPercent: -50, duration, ease: "none", repeat: -1 });
    sync.current = () => tween.current?.paused(pauseRequested.current || !visible || document.hidden);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync.current(); });
    observer.observe(scope.current);
    document.addEventListener("visibilitychange", sync.current);
    sync.current();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync.current);
      tween.current = null;
      sync.current = () => {};
    };
  }, [duration]);
  useEffect(() => { pauseRequested.current = paused; sync.current(); }, [paused]);
}
