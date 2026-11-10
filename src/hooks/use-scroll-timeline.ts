"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/animation/gsap";
import { useMotion } from "./use-motion";

/** Build all section choreography on a single scrubbed timeline. */
export function useScrollTimeline(
  scope: RefObject<HTMLElement | null>,
  build: (timeline: gsap.core.Timeline) => void,
  options: ScrollTrigger.Vars = {},
) {
  useMotion(scope, () => {
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: 0.7, invalidateOnRefresh: true, ...options },
    });
    build(timeline);
  });
}
