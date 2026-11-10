# FORME

A responsive Next.js App Router implementation of the FORME interior architecture Figma concept, with a reusable TypeScript animation toolkit.

## Run locally

Requires Node.js 20.9 or newer. Verified with Node.js 24.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. The homepage is `/`; working animation examples are at `/motion`.

```sh
npm run typecheck
npm run build
npm run start
```

## Design source

[Figma: FORME — Interior Architecture](https://www.figma.com/design/Eb3oyt8n6zhb9jxCAvvyXT/FORME-%E2%80%94-Interior-Architecture?node-id=3-2)

Source file: `Eb3oyt8n6zhb9jxCAvvyXT`. Homepage frame: `3:2`. Motion study: `3:106`.

All image assets are stored under `public/images`; fonts are self-hosted through Fontsource. No temporary Figma asset links or runtime credentials are needed. The Figma reference is documented in source, not a live two-way synchronization: subsequent design changes require another implementation pass.

The Figma file describes an imaginary studio. Project names, contact details, and photographs are illustrative. Replace the illustrative project and contact details with final approved content before a real business launch. The object panels now use high-resolution stock photography. The social links open the platforms because no studio accounts were supplied.

## Animation toolkit

See [docs/ANIMATIONS.md](docs/ANIMATIONS.md) for hook APIs, cleanup, reduced motion, performance choices, and source timings.

- GSAP: ScrollTrigger, Flip, SplitText, DrawSVGPlugin, CustomEase, and `@gsap/react` registered centrally.
- Lenis: one root instance driven by GSAP's ticker, synchronized with ScrollTrigger.
- Three.js: a lazy-loaded, keyboard-controlled circular image carousel using React Three Fiber and Drei.
- Reusable hooks for scroll timelines, horizontal scrolling, continuous loops, text reveals, parallax, SVG drawing, Flip layout changes, and section transitions.
- Native scrolling and settled content when reduced motion is requested, including live preference changes.

Homepage updates include a reference-led shrinking headline and continuous horizontal photo ribbon, a centered studio statement with compact phone spacing, replayable Apple-inspired text and image scale reveals, touch-expanding object panels, an eight-photo pinned scroll sequence, scroll-progress practice and contact headings, and a staggered footer wordmark.

No database, environment variables, or Figma API token is required. Deployment has not been configured; this is a local development project.
