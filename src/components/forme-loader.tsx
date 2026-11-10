"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/animation/gsap";
import { PageReadyContext } from "./animation/page-ready-context";
import { useSmoothScroll } from "./animation/smooth-scroll-provider";
import styles from "./forme-loader.module.css";

const frames = Array.from({ length: 8 }, (_, index) => `/images/loader/frame-${String(index + 1).padStart(2, "0")}.webp`);
const scrollKeys = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "]);

/** Initial-page photo wordmark; the homepage underneath retains its original layout. */
export function FormeLoader({ children }: { children: ReactNode }) {
  const overlay = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const scrolling = useSmoothScroll();
  const clipId = `forme-loader-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);

  useGSAP((context) => {
    if (!overlay.current || !content.current) return;
    const page = content.current;
    const previousInert = page.inert;
    const previousHidden = page.getAttribute("aria-hidden");
    const previousRestoration = window.history.scrollRestoration;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = true;
    let started = false;
    let complete = false;
    let released = false;
    let sequence: gsap.core.Timeline | undefined;
    let resourceTimer = 0;
    let handoffFrame = 0;
    let handedOff = false;

    // Fresh visits always begin at the hero, even after a reload or an incoming section link.
    window.history.scrollRestoration = "manual";
    if (window.location.hash) {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
    }
    const resetToHero = () => {
      scrolling?.current?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      ScrollTrigger.update();
    };
    resetToHero();
    page.inert = true;
    page.setAttribute("aria-hidden", "true");
    const preventScroll = (event: Event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const release = () => {
      if (released) return;
      released = true;
      window.removeEventListener("wheel", preventScroll, true);
      window.removeEventListener("touchmove", preventScroll, true);
      window.removeEventListener("keydown", onKey, true);
      media.removeEventListener("change", onMotionChange);
      window.removeEventListener("load", resetToHero);
      window.history.scrollRestoration = previousRestoration;
      page.inert = previousInert;
      if (previousHidden === null) page.removeAttribute("aria-hidden");
      else page.setAttribute("aria-hidden", previousHidden);
    };
    const revealPage = () => {
      if (!active || handedOff) return;
      handedOff = true;
      resetToHero();
      setReady(true);
      // Recheck after the homepage establishes its scroll pins, before the curtain clears.
      handoffFrame = requestAnimationFrame(() => {
        if (!active || complete) return;
        ScrollTrigger.refresh();
        resetToHero();
      });
    };
    const finish = () => {
      if (!active || complete) return;
      complete = true;
      window.clearTimeout(resourceTimer);
      revealPage();
      resetToHero();
      cancelAnimationFrame(handoffFrame);
      release();
      setVisible(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        sequence?.kill();
        finish();
      } else if (scrollKeys.has(event.key)) preventScroll(event);
    };
    const onMotionChange = () => {
      if (!media.matches) return;
      sequence?.kill();
      finish();
    };
    window.addEventListener("wheel", preventScroll, { passive: false, capture: true });
    window.addEventListener("touchmove", preventScroll, { passive: false, capture: true });
    window.addEventListener("keydown", onKey, true);
    media.addEventListener("change", onMotionChange);
    window.addEventListener("load", resetToHero);

    const select = gsap.utils.selector(overlay);
    const mark = select("[data-loader-mark]");
    const images = select("[data-loader-frame]");
    const curtain = select("[data-loader-curtain]");
    gsap.set(images, { opacity: 0 });
    gsap.set(images[0], { opacity: 1 });

    const start = () => {
      if (!active || complete || started) return;
      started = true;
      window.clearTimeout(resourceTimer);
      // Async image/font completion still records its animation in the component context.
      context.add(() => {
        if (media.matches) {
          gsap.set(mark, { autoAlpha: 1 });
          sequence = gsap.timeline({ onComplete: finish }).to({}, { duration: 0.2 });
          return;
        }
        sequence = gsap.timeline({ onComplete: finish });
        sequence.to(mark, { autoAlpha: 1, duration: 0.14, ease: "none" }, 0.04);
        for (let index = 1; index < images.length; index++) {
          const at = 0.15 + index * 0.22;
          sequence.to(images[index - 1], { opacity: 0, duration: 0.055, ease: "none" }, at)
            .to(images[index], { opacity: 1, duration: 0.055, ease: "none" }, at);
        }
        sequence.call(revealPage, [], 1.85)
          .to(curtain, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 1.85)
          .to(mark, { autoAlpha: 0, duration: 0.6, ease: "power1.inOut" }, 1.95);
      });
    };
    // Local frames normally decode immediately; a bounded fallback prevents a stuck loader.
    resourceTimer = window.setTimeout(start, 2500);
    const decoded = frames.map((src) => {
      const image = new window.Image();
      image.src = src;
      return image.decode().catch(() => undefined);
    });
    Promise.all([...decoded, document.fonts.ready]).then(start);

    return () => {
      active = false;
      cancelAnimationFrame(handoffFrame);
      window.clearTimeout(resourceTimer);
      sequence?.kill();
      release();
    };
  }, { scope: overlay });

  return <PageReadyContext.Provider value={ready}>
    <div ref={content} data-forme-page-content>{children}</div>
    {visible && <div ref={overlay} className={styles.overlay} data-forme-loader role="status" aria-live="polite" aria-atomic="true">
      <div className={styles.curtain} data-loader-curtain />
      <svg className={styles.mark} viewBox="0 0 1000 360" aria-hidden="true" data-loader-mark>
        <defs><clipPath id={clipId}><text x="500" y="288" textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontSize="340" fontWeight="400" letterSpacing="-18">forme</text></clipPath></defs>
        <g clipPath={`url(#${clipId})`}>
          <rect width="1000" height="360" fill="#fdfdfc" />
          {frames.map((src, index) => <image key={src} href={src} width="1000" height="360" preserveAspectRatio="xMidYMid slice" data-loader-frame style={{ opacity: index === 0 ? 1 : 0 }} />)}
        </g>
      </svg>
      <p className={styles.announcement}>Loading FORME</p>
    </div>}
    <noscript><style>{"[data-forme-loader]{display:none!important}"}</style></noscript>
  </PageReadyContext.Provider>;
}