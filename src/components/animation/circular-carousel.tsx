"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { CarouselItem } from "./circular-carousel-scene";
import { ArrowIcon } from "../arrow-icon";

const Scene = dynamic(() => import("./circular-carousel-scene"), { ssr: false, loading: () => <p className="scene-loading">Loading gallery…</p> });

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export function CircularCarousel({ items, label = "Project gallery" }: { items: CarouselItem[]; label?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (!container.current) return;
    const observer = new IntersectionObserver(([entry]) => setReady(entry.isIntersecting), { rootMargin: "100px" });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  if (!items.length) return null;
  const active = ((index % items.length) + items.length) % items.length;
  const fallback = <div className="carousel-fallback"><Image src={items[active].src} alt={items[active].title} fill sizes="(max-width: 700px) 90vw, 500px" /></div>;
  return <div ref={container} className="circular-carousel" role="region" aria-roledescription="carousel" aria-label={label}
    onKeyDown={(event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); setIndex((value) => value - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); setIndex((value) => value + 1); }
    }}>
    <div className="carousel-canvas" aria-hidden="true">
      <SceneBoundary fallback={fallback}>{ready && !reducedMotion ? <Scene items={items} index={index} reducedMotion={reducedMotion} /> : fallback}</SceneBoundary>
    </div>
    <div className="carousel-controls">
      <button onClick={() => setIndex((value) => value - 1)} aria-label="Previous project"><ArrowIcon direction="left" /></button>
      <p aria-live="polite" aria-atomic="true">{items[active].title} <span>{active + 1} / {items.length}</span></p>
      <button onClick={() => setIndex((value) => value + 1)} aria-label="Next project"><ArrowIcon /></button>
    </div>
  </div>;
}
