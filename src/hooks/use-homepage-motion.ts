"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/animation/gsap";
import { useMotion } from "./use-motion";
import { usePageReady } from "@/components/animation/page-ready-context";

/** Reference-led hero choreography, a pinned story sequence, and scoped text reveals. */
export function useHomepageMotion(
  scope: RefObject<HTMLElement | null>,
  disabled: boolean,
  onStoryChange: (index: number) => void,
  storyCount: number,
) {
  const pageReady = usePageReady();
  useMotion(scope, () => {
    if (!pageReady) return;
    onStoryChange(0);
    if (disabled || !scope.current) return;
    const select = gsap.utils.selector(scope);
    const splits: SplitText[] = [];
    const storySection = select(".stories")[0] as HTMLElement | undefined;
    const stage = select(".story-stage")[0] as HTMLElement | undefined;
    const cards = select("[data-story-card]") as HTMLElement[];
    let storySequence: gsap.core.Timeline | undefined;
    // Text inside the pinned story stays revealed until the entire section scrolls away.
    const replay = (trigger: Element) => {
      const storyPin = storySection?.contains(trigger) ? storySequence?.scrollTrigger : undefined;
      return {
        trigger, start: "top bottom",
        end: storyPin && storySection ? () => storyPin.end + storySection.offsetHeight : "bottom top",
        toggleActions: "restart reset restart reset", invalidateOnRefresh: true,
      };
    };

    const heroSection = select(".hero")[0] as HTMLElement | undefined;
    const heroScene = select("[data-hero-scene]")[0] as HTMLElement | undefined;
    const heroTrack = select("[data-hero-track]")[0] as HTMLElement | undefined;

    // Establish the first pin before the story pin and all later text triggers.
    if (heroSection && heroScene) {
      heroSection.classList.add("is-reference-motion");
      gsap.set(select("[data-hero-ribbon-scale]"), { scale: 1.12, transformOrigin: "0% 100%" });
      gsap.timeline({
        scrollTrigger: {
          trigger: heroSection, start: "top top", end: () => "+=" + Math.round(window.innerHeight * 0.44),
          pin: heroScene, pinSpacing: true, scrub: 0.7, anticipatePin: 1,
          refreshPriority: 3, invalidateOnRefresh: true,
        },
      })
        .to(select("[data-hero-title-frame]"), {
          scale: () => window.innerWidth < 701 ? 0.68 : 0.58,
          y: () => -window.innerHeight * 0.045, transformOrigin: "0% 50%", ease: "none", duration: 1,
        }, 0)
        .to(select("[data-hero-ribbon-scale]"), { scale: 1, ease: "none", duration: 1 }, 0)
        .to(select("[data-hero-ribbon-drift]"), { x: () => -window.innerWidth * 0.065, ease: "none", duration: 1 }, 0)
        .to(select(".hero-meta"), { autoAlpha: 0, duration: 0.45, ease: "none" }, 0.15);
    }

    // Create the pin before downstream triggers so practice/contact measure their real positions.
    if (storySection && stage && cards.length) {
      storySection.classList.add("is-scroll-story");
      const position = { value: 2 };
      let step = stage.clientHeight * 0.11;
      let active = -1;
      gsap.set(cards, { y: 0, scale: 1, autoAlpha: 1, zIndex: 1, transformOrigin: "50% 50%" });
      const setters = cards.map((card) => gsap.quickSetter(card, "css"));
      const render = () => {
        setters.forEach((set, index) => {
          const distance = index - position.value;
          const depth = Math.abs(distance);
          set({ y: -distance * step, scale: Math.max(0.56, 1 - depth * 0.11),
            autoAlpha: Math.max(0, Math.min(1, 3 - depth)), zIndex: 100 - Math.round(depth * 10) });
        });
        const next = Math.max(0, Math.min(storyCount - 1, Math.round(position.value) - 2));
        if (next !== active) { active = next; onStoryChange(next); }
      };
      render();
      storySequence = gsap.timeline({
        scrollTrigger: {
          trigger: storySection, start: "top top",
          end: () => `+=${storyCount * Math.max(440, window.innerHeight * 0.8)}`,
          pin: true, pinSpacing: true, scrub: 0.9, anticipatePin: 1,
          refreshPriority: 2, invalidateOnRefresh: true,
          onRefresh: () => { step = stage.clientHeight * 0.11; render(); },
        },
      });
      storySequence.to(position, { value: storyCount + 1, duration: Math.max(1, storyCount - 1), ease: "none", onUpdate: render })
        // Give the last image a full scroll beat before releasing the following section.
        .to({}, { duration: 1 });
    }

    gsap.set(select("[data-hero-button]"), { scale: 0, autoAlpha: 0 });
    gsap.set(select("[data-hero-entry]"), { yPercent: 35, autoAlpha: 0 });
    const intro = gsap.timeline({ defaults: { ease: "appleEase" },
      ...(heroSection ? { scrollTrigger: replay(heroSection) } : {}),
    });
    intro.fromTo(select(".site-header"), { y: -70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.45 }, 0);
    intro.to(select("[data-hero-button]"), {
      scale: 1, autoAlpha: 1, duration: 1.15, stagger: 0.09, transformOrigin: "50% 50%",
    }, 0.35);
    intro.to(select("[data-hero-entry]"), {
      yPercent: 0, autoAlpha: 1, duration: 1.85, stagger: 0.045,
    }, 0.55);

    // Two equal groups make the horizontal ribbon loop without a jump at its boundary.
    const heroLoop = heroTrack ? gsap.to(heroTrack, {
      xPercent: -50, duration: 38, delay: 1.1, repeat: -1, ease: "none", paused: true,
    }) : undefined;
    let heroVisible = true;
    const syncHero = () => heroLoop?.paused(!heroVisible || document.hidden);
    const heroObserver = new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting && entry.intersectionRatio > 0; syncHero(); }, { threshold: 0.01 });
    if (heroScene) heroObserver.observe(heroScene);
    document.addEventListener("visibilitychange", syncHero);
    syncHero();

    select("[data-apple-heading], [data-word-reveal]").forEach((element: HTMLElement) => {
      const hero = element.id === "hero-title";
      splits.push(SplitText.create(element, {
        type: "lines,words", mask: "lines", autoSplit: true, aria: "auto",
        linesClass: "apple-line", wordsClass: "apple-word",
        onSplit(split) {
          gsap.set(split.words, { yPercent: 105, scale: 0.96, autoAlpha: 0, filter: "blur(9px)" });
          return gsap.to(split.words, {
            yPercent: 0, scale: 1, autoAlpha: 1, filter: "blur(0px)",
            duration: hero ? 1.9 : 1.5, stagger: hero ? 0.14 : 0.085,
            delay: hero ? 0.55 : 0, ease: "appleEase", clearProps: "filter",
            scrollTrigger: replay(hero && heroSection ? heroSection : element),
          });
        },
      }));
    });
    select("[data-scroll-heading]").forEach((element: HTMLElement) => {
      splits.push(SplitText.create(element, {
        type: "lines,words", autoSplit: true, aria: "auto", wordsClass: "scroll-word",
        onSplit(split) {
          gsap.set(split.words, { y: 24, opacity: 0.16, filter: "blur(5px)" });
          return gsap.to(split.words, {
            y: 0, opacity: 1, filter: "blur(0px)", duration: 1, stagger: 0.13, ease: "none",
            scrollTrigger: { trigger: element, start: "top 88%", end: "clamp(bottom 48%)", scrub: 0.65, invalidateOnRefresh: true },
          });
        },
      }));
    });
    select("[data-copy-reveal], [data-text-rise], .contact-main .text-link, .footer-main nav a, .studio-content > .text-link, .all-projects").forEach((element: HTMLElement) => {
      gsap.fromTo(element, { y: 28, autoAlpha: 0, filter: "blur(6px)" }, {
        y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.4, ease: "appleEase", clearProps: "filter",
        scrollTrigger: replay(element),
      });
    });
    select("[data-scale-reveal]").forEach((element: HTMLElement) => {
      gsap.fromTo(element, { scale: 0, autoAlpha: 0 }, {
        scale: 1, autoAlpha: 1, duration: 1.95, ease: "appleEase", transformOrigin: "50% 50%",
        scrollTrigger: replay(element.parentElement ?? element),
      });
    });
    gsap.set(select("[data-footer-letter]"), { yPercent: 115, autoAlpha: 0, filter: "blur(4px)" });
    gsap.to(select("[data-footer-letter]"), {
      yPercent: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1.35, stagger: 0.15, ease: "appleEase", clearProps: "filter",
      scrollTrigger: replay(select(".footer-wordmark")[0]),
    });

    // The mobile accordion changes document height; refresh later section positions after it settles.
    const gallery = select(".objects-gallery")[0] as HTMLElement | undefined;
    let refreshFrame = 0;
    const refreshAfterExpansion = (event: TransitionEvent) => {
      if (event.propertyName !== "height" || !(event.target instanceof HTMLElement) || !event.target.classList.contains("object-panel")) return;
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    gallery?.addEventListener("transitionend", refreshAfterExpansion);

    return () => {
      heroObserver.disconnect();
      gallery?.removeEventListener("transitionend", refreshAfterExpansion);
      cancelAnimationFrame(refreshFrame);
      document.removeEventListener("visibilitychange", syncHero);
      splits.forEach((split) => split.revert());
      storySection?.classList.remove("is-scroll-story");
      heroSection?.classList.remove("is-reference-motion");
    };
  }, [pageReady, disabled, onStoryChange, storyCount]);
}