"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/animation/gsap";
import { useMotion } from "./use-motion";

export function useParallax(scope: RefObject<HTMLElement | null>, selector = "[data-parallax]", distance = 40) {
  useMotion(scope, () => {
    gsap.utils.toArray<HTMLElement>(selector, scope.current).forEach((element) => {
      gsap.fromTo(element, { y: -distance }, { y: distance, ease: "none", scrollTrigger: {
        trigger: element.parentElement, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true,
      } });
    });
  }, [selector, distance]);
}
