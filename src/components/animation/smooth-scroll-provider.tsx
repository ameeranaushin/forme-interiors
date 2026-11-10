"use client";

import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, motionQueries } from "@/lib/animation/gsap";

const ScrollContext = createContext<{ current: Lenis | null } | null>(null);
export const useSmoothScroll = () => useContext(ScrollContext);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const instance = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(motionQueries.motion, () => {
      const lenis = new Lenis({ autoRaf: false, smoothWheel: true, syncTouch: false, anchors: true, duration: 1.05 });
      instance.current = lenis;
      const update = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(update);
        lenis.off("scroll", ScrollTrigger.update);
        lenis.destroy();
        instance.current = null;
      };
    });
    let active = true;
    const refresh = () => { if (active) ScrollTrigger.refresh(); };
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      active = false;
      window.removeEventListener("load", refresh);
      media.revert();
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      instance.current?.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return <ScrollContext.Provider value={instance}>{children}</ScrollContext.Provider>;
}
