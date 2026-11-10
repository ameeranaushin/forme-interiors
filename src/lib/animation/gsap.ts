"use client";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";

// Browser plugins are registered once per client module; importing on the server is safe.
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, Flip, SplitText, DrawSVGPlugin, CustomEase);
  CustomEase.create("figmaEaseOut", "0 0 0.58 1");
  CustomEase.create("figmaEaseInOut", "0.42 0 0.58 1");
  CustomEase.create("appleEase", "0.22 1 0.36 1");
}

export { gsap, useGSAP, ScrollTrigger, Flip, SplitText, DrawSVGPlugin };
export const motionQueries = {
  desktop: "(min-width: 900px)",
  motion: "(prefers-reduced-motion: no-preference)",
};
