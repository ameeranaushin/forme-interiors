"use client";

import type { RefObject } from "react";
import { gsap, motionQueries, ScrollTrigger } from "@/lib/animation/gsap";
import { useMotion } from "./use-motion";

/** Mobile and reduced motion retain a native, keyboard-accessible scrolling rail. */
export function useHorizontalScroll(scope: RefObject<HTMLElement | null>) {
  useMotion(scope, () => {
    const media = gsap.matchMedia();
    media.add(motionQueries.desktop, () => {
      const section = scope.current;
      const viewport = section?.querySelector<HTMLElement>("[data-horizontal-viewport]");
      const track = section?.querySelector<HTMLElement>("[data-horizontal-track]");
      if (!section || !viewport || !track) return;
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      if (distance() < 1) return;
      const tween = gsap.to(track, { x: () => -distance(), ease: "none", scrollTrigger: {
        trigger: section, pin: true, scrub: 0.8, start: "top top", end: () => `+=${distance()}`,
        invalidateOnRefresh: true,
      } });
      const observer = new ResizeObserver(() => ScrollTrigger.refresh());
      observer.observe(viewport);
      // If a keyboard user focuses an offscreen link, native scroll still exposes it.
      return () => { observer.disconnect(); tween.scrollTrigger?.kill(); tween.revert(); };
    });
    return () => media.revert();
  });
}
