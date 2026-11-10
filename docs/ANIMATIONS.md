# Animation guide

## Entry points

`src/lib/animation/gsap.ts` is a client-only module registering GSAP plugins behind a browser guard. Import hooks individually for focused usage, or use `@/lib/animation`. Browser APIs are used only in lifecycle callbacks and event handlers. Server-rendered content is visible before hydration, with no random coordinates or viewport-dependent markup.

`SmoothScrollProvider` is installed once in the root App Router layout. It connects `lenis.on("scroll", ScrollTrigger.update)` and `lenis.raf(time * 1000)` to GSAP's ticker. It does not start a second RAF loop. Native window scrolling needs no scrollerProxy. Touch scrolling stays native. The Lenis stylesheet is imported at the root. Path changes refresh dimensions and triggers; fonts and the window load event also refresh triggers.

The provider removes its ticker callback, scroll and load listeners, destroys Lenis, and reverts its matchMedia context on unmount. It restores GSAP's default lag-smoothing configuration when removed. Use only one provider at a time.

## Reusable APIs

| API | Use | Required markup |
| --- | --- | --- |
| `useMotion(ref, setup, dependencies?)` | Scoped GSAP setup only when motion is permitted; reverts on dependencies, preference changes, and unmount | A stable HTMLElement ref |
| `useScrollTimeline(ref, build, triggerOptions?)` | One scrubbed timeline with overridable ScrollTrigger options | Elements selected within the scope |
| `useHorizontalScroll(ref)` | Desktop pinned horizontal rail; native horizontal scrolling on smaller screens and with reduced motion | `[data-horizontal-viewport]` containing `[data-horizontal-track]` |
| `useInfiniteLoop(ref, paused?, duration?)` | Seamless equal-width two-group loop; pauses offscreen and in background tabs | `[data-loop-track]` with two equal groups, second `aria-hidden` |
| `useParallax(ref, selector?, distance?)` | Scoped transform-only parallax | `[data-parallax]` in an overflow-clipped parent with extra image height |
| `useTextReveal(ref, selector?)` | SplitText lines and words; autoSplit for font and width changes | Text-only `[data-text-reveal]` headings |
| `useSvgDraw(ref, selector?)` | DrawSVG stroke reveal on entry | Inline SVG with `[data-draw]` paths |
| `useFlipLayout(ref, layoutKey, selector?)` | Capture before a state change, Flip after React commits | Stable keyed `[data-flip]` elements |
| `useSectionTransition(ref, selector?)` | Desktop section entry with a scrubbed dissolve and translation | `[data-section-content]` |
| `useReducedMotion()` | Hydration-safe media preference; updates live | No markup requirement |
| `CircularCarousel` | Lazy client-only Three.js circular card gallery with previous/next and arrow-key controls | `items: { src, title }[]`; optional accessible label |

Animation setup callbacks capture values from the listed dependencies. Include any changing setup parameters in the dependency array. Event-created GSAP work should use `useGSAP().contextSafe()` so it belongs to the component context. Do not use global `ScrollTrigger.killAll()` during component cleanup; it would destroy other sections' triggers.

```tsx
"use client";
import { useRef } from "react";
import { useScrollTimeline } from "@/lib/animation";

export function Section() {
  const section = useRef<HTMLElement>(null);
  useScrollTimeline(section, (timeline) => {
    timeline.to("[data-photo]", { y: -40 });
  }, { start: "top 80%", end: "bottom 20%" });
  return <section ref={section}><div data-photo>Content</div></section>;
}
```

## Accessibility and performance

- `useMotion` uses GSAP matchMedia and reverts to the original DOM and inline styles when reduced motion is enabled. No content is hidden in baseline CSS.
- Text splitting uses `aria: "auto"`; use it on text-only headings, not containers with interactive children. All SplitText instances revert on cleanup.
- The homepage has a Reduce motion control for its looping imagery. The hero photo ribbon pauses offscreen and when the tab is hidden, then resumes from its paused position. The example marquee has its own pause control; its duplicate content is hidden from assistive technology.
- Reduced motion disables Lenis smoothing, pinning, loops, parallax, reveals, SVG drawing, section choreography, and CSS transitions. The 3D gallery becomes a static image with the same manual controls.
- Three.js is dynamically imported with `ssr: false` inside a client component. The gallery mounts near the viewport, unmounts out of view, uses demand rendering and a capped pixel ratio, and catches WebGL failures with an image fallback. Fiber disposes scene objects at unmount.
- The carousel has no autoplay and can be controlled with arrow keys while a control is focused.
- Horizontal rails preserve native scrolling for keyboard users and small screens. Do not nest a pinned horizontal section inside another pinned timeline.
- Smooth scrolling uses the browser's native document scroll coordinate system. Keep modal content marked `data-lenis-prevent`; pause Lenis and restore scrolling on dialog close.
- Use transforms and opacity for motion; avoid per-frame React state updates. Reserve will-change for active effects rather than every image.

## Homepage motion direction

The original Figma composition is the base. The homepage includes the subsequently requested photography and animation changes.

- Header: slides down 70px over 1.45 seconds. Hero navigation and controls grow from scale 0 to 1 with a stagger.
- Hero typography: SplitText word reveals combine upward translation, a small scale change, and blur-to-sharp fading. Headline duration is 1.9 seconds per word, with a .14-second stagger.
- Hero composition and motion follow the supplied `homepage recording.mp4` (4.10 seconds, 386 x 258 pixels). Its frames were inspected locally; the video is not included in the website. FORME branding, copy, and local interior photography are retained.
- Hero headline: initially fills the width below the compact header. The first 44% of a viewport of scrolling holds the hero scene while the title scales from 1 to .58 on desktop (.68 on phones). A .7-second scrub smooths the transition, and scrolling upward restores the large title. The scene then releases into the studio statement.
- Hero photographs: eight photos in a bottom-aligned ribbon, with alternating heights of 100%, 50%, 76%, 50%, 76%, 56%, 100%, and 70%. Two equal groups make a continuous, linear 38-second horizontal loop without a boundary jump. During the title shrink, a separate wrapper reduces the ribbon scale from 1.12 to 1 and adds a 6.5vw leftward drift. The loop and scroll transforms belong to separate elements. The loop pauses outside the viewport and in hidden tabs. Individual entry reveals last 1.85 seconds, with a .045-second stagger.
- Studio opening: a full-height white statement screen on desktop. Phones use a compact statement with labels above the heading, 64px top padding and 40px below it. Supporting copy, studio link, and the scale-revealed photograph follow without a viewport-sized blank area.
- Section headings and supporting text: Apple-inspired word reveals and upward fades replay every time their section enters from either scroll direction. Timed reveals reset after leaving the viewport, using toggleActions "restart reset restart reset" with stable trigger frames. The custom ease is cubic-bezier(.22,1,.36,1).
- Studio, Good company, and selected-project pictures: all seven photographs scale from 0 to 1 over 1.95 seconds on every viewport entry. Static outer frames preserve layout and define trigger geometry independently of each transformed inner picture. The photo wrappers are separate from the object panels and their hover/tap effects.
- Object collection: four local 1800 x 2200 photographs. Hover, keyboard focus, or tap expands the selected panel. Desktop panels grow horizontally; mobile panels expand vertically. The separate arrow button opens details. Escape, tapping outside, or leaving with a mouse clears the selection.
- Every space holds a story: eight distinct interior photographs in a vertical card stack informed by the supplied [Pinterest video](https://in.pinterest.com/pin/736901557818416809/). Two decorative neighbours at each end maintain the stack. The entire section, including its heading and current caption, is pinned. Downward scrolling brings the next card forward from above while the outgoing card recedes below; reverse scrolling reverses the sequence. A .9-second scrub smooths the input. Each photo receives max(440px, 80% of viewport height) of scrolling, with the final beat holding the eighth photograph. The following section enters only after the eight-photo sequence completes. The counter and Explore button refer to the focused story. There is no autoplay. Reduced motion presents all eight photos in a native horizontal gallery with decorative copies hidden.
- Our practice: the main heading sharpens and rises word by word in response to scroll progress. The section label and three service titles reveal on entry; descriptions and numbers fade upward.
- Have a space in mind: the eyebrow and email reveal word by word. The large heading uses the same scroll-progress reveal as Our practice, and supporting copy fades upward.
- Footer: letters in "forme" rise separately with a .15-second stagger on every visit; assistive technology receives a single link label. On phones the logo, navigation, and legal text occupy separate rows with no shared horizontal space.

The hero uses separate grid rows for the header, title, controls, and photographs, reserving a gap below the title even in short viewports. Mobile object-panel height transitions refresh downstream trigger positions after the layout settles. The hero pin is created first, the story pin second, and downstream text triggers last so their measured positions include both scroll distances. Scroll-heading endpoints use ScrollTrigger clamp() so even the last contact word finishes within the available page scroll. The homepage's Reduce motion control settles its animation contexts; the system reduced-motion preference additionally disables smooth scrolling. Both revert GSAP styles, SplitText markup, and pins. Animation-created DOM and properties belong to the scoped context, and each SplitText instance also has explicit cleanup.

Photography provenance is listed in [ASSETS.md](ASSETS.md). Images are local under public/images. No temporary Figma or remote stock-image URLs are used at runtime.
