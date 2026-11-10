"use client";

import type { RefObject } from "react";
import { gsap } from "@/lib/animation/gsap";
import { useMotion } from "./use-motion";

export function useSvgDraw(scope: RefObject<HTMLElement | null>, selector = "[data-draw]") {
  useMotion(scope, () => {
    gsap.from(selector, { drawSVG: "0%", duration: 1.6, ease: "power2.inOut", scrollTrigger: {
      trigger: scope.current, start: "top 80%", once: true,
    } });
  }, [selector]);
}
