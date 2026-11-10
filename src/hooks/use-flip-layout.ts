"use client";

import { useRef, type RefObject } from "react";
import { Flip, useGSAP } from "@/lib/animation/gsap";

/** Capture before a React state update; animate after React commits the new layout. */
export function useFlipLayout(scope: RefObject<HTMLElement | null>, layoutKey: unknown, selector = "[data-flip]") {
  const previous = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const { contextSafe } = useGSAP(() => {
    if (!previous.current) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      Flip.from(previous.current, { duration: 0.65, ease: "power2.inOut", absolute: true, stagger: 0.04 });
    }
    previous.current = null;
  }, { scope, dependencies: [layoutKey], revertOnUpdate: true });
  return contextSafe(() => {
    const elements = scope.current?.querySelectorAll(selector);
    if (elements?.length) previous.current = Flip.getState(elements);
  });
}
