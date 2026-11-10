"use client";

import type { RefObject } from "react";
import { gsap, SplitText } from "@/lib/animation/gsap";
import { useMotion } from "./use-motion";

/** Use on text-only headings; aria:auto preserves a single screen-reader label. */
export function useTextReveal(scope: RefObject<HTMLElement | null>, selector = "[data-text-reveal]") {
  useMotion(scope, () => {
    const splits = gsap.utils.toArray<HTMLElement>(selector, scope.current).map((element) => SplitText.create(element, {
      type: "lines,words", mask: "lines", autoSplit: true, aria: "auto",
      onSplit(split) {
        return gsap.from(split.words, {
          yPercent: 110, opacity: 0, duration: 0.8, stagger: 0.035, ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 90%", once: true },
        });
      },
    }));
    return () => splits.forEach((split) => split.revert());
  }, [selector]);
}
