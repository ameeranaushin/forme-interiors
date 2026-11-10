"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useTextReveal, useHorizontalScroll, useInfiniteLoop, useFlipLayout, useSvgDraw, useParallax, useScrollTimeline, useSectionTransition, useReducedMotion } from "@/lib/animation";
import { CircularCarousel } from "./animation/circular-carousel";
import { ArrowIcon } from "./arrow-icon";

const items = [
  { src: "/images/warm-residence.png", title: "A study in warmth" },
  { src: "/images/kitchen.png", title: "A quiet contrast" },
  { src: "/images/modern-living.png", title: "Light and material" },
  { src: "/images/colour-accent.png", title: "A different perspective" },
];
export function MotionLab() {
  const root = useRef<HTMLElement>(null);
  const rail = useRef<HTMLElement>(null);
  const loop = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const drawing = useRef<HTMLDivElement>(null);
  const parallax = useRef<HTMLDivElement>(null);
  const timeline = useRef<HTMLDivElement>(null);
  const handoff = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [reversed, setReversed] = useState(false);
  const reducedMotion = useReducedMotion();
  useTextReveal(root);
  useHorizontalScroll(rail);
  useInfiniteLoop(loop, paused);
  const capture = useFlipLayout(grid, reversed);
  useSvgDraw(drawing);
  useParallax(parallax);
  useScrollTimeline(timeline, (sequence) => sequence.to("[data-orbit]", { rotation: 90, scale: 1.2, x: 70, duration: 1 }));
  useSectionTransition(handoff);

  return <main ref={root} className="lab">
    <nav className="lab-nav" aria-label="Examples navigation"><Link href="/">forme</Link><span>Animation examples</span><a href="#carousel">3D gallery<ArrowIcon direction="down" className="inline-arrow" /></a></nav>
    <header className="lab-intro"><p className="eyebrow">FORME / Development reference</p><h1 data-text-reveal>Room for motion.</h1><p>Working examples of the reusable animation toolkit. All effects respect reduced-motion preferences, and content stays accessible with animations disabled.</p></header>
    <section className="lab-section"><p className="eyebrow">01 / SplitText</p><h2 data-text-reveal>Every word has its place.</h2><p>Responsive line and word reveals resplit when fonts load or the container changes size.</p></section>
    <section className="lab-section"><p className="eyebrow">02 / Infinite loop</p><h2>A continuous conversation.</h2><button className="lab-button" disabled={reducedMotion} aria-pressed={paused} onClick={() => setPaused(!paused)}>{reducedMotion ? "Reduced motion enabled" : paused ? "Play loop" : "Pause loop"}</button>
      <div ref={loop} className="loop-window"><div className="loop-track" data-loop-track>{[0,1].map((copy) => <div key={copy} className="loop-group" aria-hidden={copy === 1 ? true : undefined}>{["Form", "Feeling", "Light", "Material", "Space", "Story"].map((word) => <span key={word}>{word} ·</span>)}</div>)}</div></div>
    </section>
    <section className="lab-section"><p className="eyebrow">03 / Flip</p><h2>A change of perspective.</h2><button className="lab-button" onClick={() => { capture(); setReversed(!reversed); }}>Reverse the collection</button>
      <div ref={grid} className="flip-grid">{(reversed ? [...items].reverse() : items).map((item) => <div key={item.src} className="flip-card" data-flip><Image src={item.src} alt={item.title} fill sizes="(max-width: 700px) 45vw, 23vw" /><span>{item.title}</span></div>)}</div>
    </section>
    <section ref={rail} className="lab-section horizontal-section"><p className="eyebrow">04 / Horizontal scroll</p><h2>Follow the spaces.</h2>
      <div className="horizontal-viewport" data-horizontal-viewport tabIndex={0} role="region" aria-label="Horizontally scrolling interiors"><div className="horizontal-track" data-horizontal-track>{items.map((item) => <div className="horizontal-card" key={item.src}><figure><Image src={item.src} alt={item.title} fill sizes="(max-width: 700px) 80vw, 55vw" /></figure><p>{item.title}</p></div>)}</div></div>
    </section>
    <section className="lab-section"><p className="eyebrow">05 / Parallax</p><h2>Light, in layers.</h2><div ref={parallax} className="parallax-frame"><div className="parallax-image" data-parallax><Image src={items[0].src} alt="Sunlight across a warm interior" fill sizes="95vw" /></div></div></section>
    <section className="lab-section"><p className="eyebrow">06 / Scroll-triggered timeline</p><h2>One considered movement.</h2><div ref={timeline} className="timeline-stage"><div className="timeline-shape" data-orbit aria-hidden="true" /></div></section>
    <section className="lab-section"><p className="eyebrow">07 / DrawSVGPlugin</p><h2>A line becomes a form.</h2><div ref={drawing}><svg ref={svg} className="lab-path" viewBox="0 0 700 220" fill="none" role="img" aria-label="A continuous architectural line drawing"><path data-draw d="M20 190H100V70H200V190H300V30H400V190H500V110H600V190H680" stroke="currentColor" strokeWidth="2" /></svg></div></section>
    <section id="carousel" className="lab-section"><p className="eyebrow">08 / Three.js + React Three Fiber + Drei</p><h2>A world in the round.</h2><CircularCarousel items={items} /></section>
    <section ref={handoff} className="lab-section handoff"><div data-section-content><p className="eyebrow">09 / Section transitions</p><h2>From one story<br />to the next.</h2><Link href="/" className="lab-button">Return to FORME</Link></div></section>
  </main>;
}
