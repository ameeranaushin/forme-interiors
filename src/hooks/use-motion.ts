"use client";

import type { DependencyList, RefObject } from "react";
import { gsap, motionQueries, useGSAP } from "@/lib/animation/gsap";

type Scope = RefObject<HTMLElement | null>;
type Setup = () => void | (() => void);

/** Creates animations only when motion is allowed. Reverts styles, tweens and triggers. */
export function useMotion(scope: Scope, setup: Setup, dependencies: DependencyList = []) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(motionQueries.motion, setup, scope);
    return () => media.revert();
  }, { scope, dependencies: [...dependencies], revertOnUpdate: true });
}
