"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/animation/gsap";
import { useMotion } from "./use-motion";

/** Optional section handoff. Do not combine with pinned horizontal sections. */
export function useSectionTransition(scope: RefObject<HTMLElement | null>, selector = "[data-section-content]") {
  useMotion(scope, () => {
    const media = gsap.matchMedia();
    media.add("(min-width: 900px)", () => {
      gsap.from(selector, { y: 64, autoAlpha: 0, ease: "none", scrollTrigger: {
        trigger: scope.current, start: "top 95%", end: "top 45%", scrub: 0.6, invalidateOnRefresh: true,
      } });
    });
    return () => media.revert();
  }, [selector]);
}
