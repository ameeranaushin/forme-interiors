"use client";

import { useEffect, useRef, Suspense } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Image as ThreeImage, AdaptiveDpr } from "@react-three/drei";
import { DoubleSide, type Group } from "three";
import { gsap } from "@/lib/animation/gsap";

export type CarouselItem = { src: string; title: string };

function Ring({ items, index, reducedMotion }: { items: CarouselItem[]; index: number; reducedMotion: boolean }) {
  const group = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    if (!group.current || !items.length) return;
    const target = -index * Math.PI * 2 / items.length;
    if (reducedMotion) { group.current.rotation.y = target; invalidate(); return; }
    const tween = gsap.to(group.current.rotation, { y: target, duration: 0.85, ease: "power3.out", onUpdate: invalidate });
    return () => { tween.kill(); };
  }, [index, items.length, reducedMotion, invalidate]);
  return <group ref={group}>
    {items.map((item, position) => {
      const angle = position * Math.PI * 2 / items.length;
      return <ThreeImage key={item.src} url={item.src} position={[Math.sin(angle) * 3.4, 0, Math.cos(angle) * 3.4]}
        rotation={[0, angle, 0]} scale={[2.4, 3.1]} side={DoubleSide} transparent={false} />;
    })}
  </group>;
}

export default function CircularCarouselScene(props: { items: CarouselItem[]; index: number; reducedMotion: boolean }) {
  return <Canvas camera={{ position: [0, 0, 10.5], fov: 43 }} dpr={[1, 1.5]} frameloop="demand"
    gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}>
    <Suspense fallback={null}><Ring {...props} /><AdaptiveDpr /></Suspense>
  </Canvas>;
}
