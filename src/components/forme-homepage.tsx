"use client";

import Image from "next/image";
import { StudioVideo } from "./studio-video";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useHomepageMotion } from "@/hooks/use-homepage-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useSmoothScroll } from "./animation/smooth-scroll-provider";

const assets = {
  warm: "/images/warm-residence.png",
  kitchen: "/images/kitchen.png",
  living: "/images/modern-living.png",
  colour: "/images/colour-accent.png",
  chair: "/images/objects/curve-chair.jpg",
};
const heroPhotos = [
  { src: assets.warm, alt: "A warm residence with sunlight and plants", height: "100%" },
  { src: assets.kitchen, alt: "A kitchen in black and white", height: "50%" },
  { src: assets.living, alt: "A light-filled modern living room", height: "76%" },
  { src: assets.colour, alt: "A colourful living space with a blue sofa", height: "50%" },
  { src: "/images/objects/materials.jpg", alt: "Timber and pale stone in a contemporary home", height: "76%" },
  { src: "/images/stories/dining-room.jpg", alt: "A thoughtfully arranged wooden dining table", height: "56%" },
  { src: "/images/stories/quiet-living.jpg", alt: "A quiet bedroom with natural materials", height: "100%" },
  { src: "/images/stories/soft-light.jpg", alt: "Soft light through arched living-room windows", height: "70%" },
];
const studioText = "FORME is an independent interior design studio creating homes, gathering places and objects with a quiet sense of character. We work with light, honest materials and the lives that unfold around them.";
const projects = [
  { title: "The Light House", meta: "RESIDENTIAL / KOLKATA / 2026", src: assets.warm, alt: "A sunlit living room with warm wood, greenery and a gallery wall" },
  { title: "A Quiet Contrast", meta: "PRIVATE RESIDENCE / 2026", src: assets.kitchen, alt: "An open kitchen with a dark island and tall windows" },
];
type Detail = { title: string; text: string; image?: string; meta?: string };
const panels: Array<Detail & { note: string; image: string; alt: string }> = [
  { title: "Our approach", note: "A dialogue between\nform and feeling.", text: studioText, image: "/images/objects/approach.jpg", alt: "Warm sunlight, natural furniture and a carefully composed living room" },
  { title: "The curve chair", note: "A softer silhouette.\nA quiet presence.", text: "Furniture with presence. Designed to be lived with. An illustrative object from the FORME design concept.", image: assets.chair, alt: "A sculpted cream chair with a softly curved upholstered back" },
  { title: "Our materials", note: "Natural textures.\nUnexpected combinations.", text: "We work with light, honest materials and the lives that unfold around them. Natural textures. Unexpected combinations.", image: "/images/objects/materials.jpg", alt: "Warm timber, pale stone and tactile fabrics in a light-filled interior" },
  { title: "Made to stay", note: "Objects for the\nlonger story.", text: "A dialogue between form and feeling. Objects for the longer story.", image: "/images/objects/made-to-stay.jpg", alt: "A timeless black shell chair with natural wooden legs" },
];
const stories = [
  { src: assets.warm, title: "The Light House", caption: "The Light House — a study in warmth" },
  { src: assets.kitchen, title: "A Quiet Contrast", caption: "A Quiet Contrast — light and material" },
  { src: assets.colour, title: "A different perspective", caption: "A different perspective — colour and character" },
  { src: assets.living, title: "A slower morning", caption: "A slower morning — texture and light" },
  { src: "/images/objects/materials.jpg", title: "Honest materials", caption: "Honest materials — timber, stone and softness" },
  { src: "/images/stories/dining-room.jpg", title: "Around the table", caption: "Around the table — warmth in the everyday" },
  { src: "/images/stories/quiet-living.jpg", title: "Quiet compositions", caption: "Quiet compositions — a considered balance" },
  { src: "/images/stories/soft-light.jpg", title: "A softer light", caption: "A softer light — framed by architecture" },
];
// Two neighbours on either side keep the deck filled throughout all eight stories.
const storyCards = Array.from({ length: stories.length + 4 }, (_, index) => ({ ...stories[((index - 2) % stories.length + stories.length) % stories.length], slot: index - 2 }));

function Photo({ src, alt, sizes = "(max-width: 700px) 90vw, 60vw", priority = false, className = "" }: {
  src: string; alt: string; sizes?: string; priority?: boolean; className?: string;
}) {
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />;
}

export function FormeHomepage() {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const objectGallery = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [motionDisabled, setMotionDisabled] = useState(false);
  const [activePanel, setActivePanel] = useState<number | null>(null);
  const [activeStory, setActiveStory] = useState(0);
  const [detail, setDetail] = useState<Detail | null>(null);
  const reducedMotion = useReducedMotion();
  const scrolling = useSmoothScroll();
  useHomepageMotion(root, motionDisabled, setActiveStory, stories.length);
  const detailOpen = detail !== null;

  useEffect(() => {
    if (reducedMotion || motionDisabled) setActiveStory(0);
  }, [reducedMotion, motionDisabled]);

  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !objectGallery.current?.contains(event.target)) setActivePanel(null);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  useEffect(() => {
    if (!detailOpen || !dialog.current) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    modal.showModal();
    scrolling?.current?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
      scrolling?.current?.start();
    };
  }, [detailOpen, scrolling]);

  const showProject = (project: typeof projects[number]) => setDetail({
    title: project.title, meta: project.meta, image: project.src,
    text: "An illustrative project from the FORME interior architecture design concept. Thoughtful spaces. Extraordinary everyday living.",
  });
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <main ref={root} id="main-content">
      <section className="hero" aria-labelledby="hero-title" id="top" data-node-id="3:3">
        <div className="hero-scene" data-hero-scene>
        <header className="site-header inset">
          <a className="wordmark" href="#top" aria-label="FORME home">forme</a>
          <button className="menu-toggle" data-hero-button aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? "Close −" : "Menu +"}</button>
          <nav id="main-navigation" className={menuOpen ? "navigation is-open" : "navigation"} aria-label="Main navigation" onClick={() => setMenuOpen(false)}>
            <a href="#work" data-hero-button>Selected work</a><a href="#studio" data-hero-button>The studio</a><a href="#objects" data-hero-button>Objects</a><a href="#contact" data-hero-button>Start a project ↗</a>
          </nav>
        </header>
        <div className="hero-intro inset">
          <div className="hero-title-frame" data-hero-title-frame><h1 id="hero-title" data-apple-heading data-node-id="3:13">Space to feel.</h1></div>
        </div>
        <div className="hero-meta inset eyebrow">
            <a href="#studio" data-hero-button>Scroll to explore ↓</a>
            <button className="motion-toggle" data-hero-button onClick={() => setMotionDisabled(!motionDisabled)} aria-label="Reduce motion" aria-pressed={motionDisabled || reducedMotion} disabled={reducedMotion}>
              {reducedMotion ? "Motion reduced" : motionDisabled ? "Enable motion" : "Reduce motion"}
            </button>
            <span>Interior architecture</span>
        </div>
        <div className="hero-images" role="region" tabIndex={0} aria-label="FORME interior photography">
          <div className="hero-ribbon-scale" data-hero-ribbon-scale>
            <div className="hero-ribbon-drift" data-hero-ribbon-drift>
              <div className="hero-track" data-hero-track>
                {[false, true].map((clone) => <div className="hero-group" data-hero-group-clone={clone} aria-hidden={clone || undefined} key={String(clone)}>
                  {heroPhotos.map((photo, index) => <div key={photo.src} className="hero-tile" data-hero-tile style={{ "--hero-height": photo.height } as CSSProperties}>
                    <div className="hero-reveal" data-hero-entry><div className="hero-image-motion"><Photo src={photo.src} alt={clone ? "" : photo.alt} sizes="(max-width: 700px) 48vw, 21vw" priority={!clone && index < 5} /></div></div>
                  </div>)}
                </div>)}
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="studio section" id="studio" aria-labelledby="studio-title" data-node-id="3:22">
        <div className="studio-background"><StudioVideo motionReduced={motionDisabled || reducedMotion} /></div>
        <div className="studio-statement inset">
          <p className="eyebrow section-kicker" data-word-reveal>01 — The studio</p>
          <h2 id="studio-title" data-apple-heading>We make room for a different way of living.</h2>
          <p className="eyebrow studio-location" data-copy-reveal>FORME / Kolkata</p>
        </div>
        <div className="studio-details inset">
          <div className="studio-content">
            <p className="studio-description" data-copy-reveal>{studioText}</p>
            <button className="text-link" onClick={() => setDetail({ title: "The studio", text: studioText, image: assets.living })}>Meet the studio ↗</button>
          </div>
          <p className="studio-italic" data-copy-reveal>Less, but with feeling.</p>
          <div className="studio-detail" data-node-id="3:27"><div className="scale-image-motion" data-scale-reveal><Photo src={assets.living} alt="Natural materials in a thoughtfully composed living room" sizes="(max-width: 700px) 90vw, 44vw" /></div></div>
        </div>
      </section>

      <section className="objects inset section" id="objects" aria-labelledby="objects-title" data-node-id="3:29">
        <div className="rule" /><p className="eyebrow" data-word-reveal>02 — The object collection</p>
        <div className="section-heading"><h2 id="objects-title" data-apple-heading>Good company.</h2><p data-copy-reveal>Furniture with presence.<br />Designed to be lived with.</p></div>
        <div ref={objectGallery} className="objects-gallery" data-node-id="3:34" data-expanded={activePanel !== null}
          onPointerLeave={(event) => { if (event.pointerType === "mouse") setActivePanel(null); }}
          onKeyDown={(event) => { if (event.key === "Escape") setActivePanel(null); }}>
          {panels.map((panel, index) => <article key={panel.title} className={`object-panel ${activePanel === index ? "is-active" : ""}`}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") setActivePanel(index); }}
            onFocusCapture={() => setActivePanel(index)}>
            <button className="panel-select" onClick={() => setActivePanel(index)} aria-expanded={activePanel === index} aria-label={`Expand ${panel.title.toLowerCase()}`}>
              <span className="panel-photo"><span className="scale-image-motion" data-scale-reveal><Photo src={panel.image} alt={panel.alt} sizes="(max-width: 700px) 95vw, 55vw" /></span></span>
              <span className="panel-shade" aria-hidden="true" />
              <span className="panel-number eyebrow">0{index + 1}</span><span className="panel-note">{panel.note}</span>
              <span className="panel-title" data-word-reveal>{panel.title}</span>
            </button>
            <button className="panel-detail" onClick={() => setDetail(panel)} aria-label={`Read about ${panel.title.toLowerCase()}`}><span aria-hidden="true">↗</span></button>
          </article>)}
        </div>
      </section>

      <section className="projects inset section" id="work" aria-labelledby="work-title" data-node-id="3:55">
        <p className="eyebrow" data-word-reveal>03 — Selected spaces</p><h2 id="work-title" data-apple-heading>Places, with personality.</h2>
        <div className="projects-grid">
          {projects.map((project, index) => <button className={`project-card project-${index + 1}`} key={project.title} onClick={() => showProject(project)}>
            <span className="project-image" data-node-id={index === 0 ? "3:58" : "3:61"}><span className="scale-image-motion" data-scale-reveal><Photo src={project.src} alt={project.alt} sizes={index === 0 ? "(max-width: 700px) 93vw, 55vw" : "(max-width: 700px) 75vw, 30vw"} /></span></span>
            <span className="project-title" data-copy-reveal>{project.title}</span><span className="eyebrow project-meta" data-copy-reveal>{project.meta}</span>
          </button>)}
        </div>
        <button className="text-link all-projects" onClick={() => setDetail({ title: "Selected spaces", text: "Places, with personality. Explore the illustrative projects in the FORME collection.", meta: "PROJECT ARCHIVE" })}>Explore all projects ↗</button>
      </section>

      <section className="stories section" id="stories" aria-labelledby="stories-title" data-node-id="3:65">
        <div className="inset stories-content">
          <p className="eyebrow" data-word-reveal>04 — A world within</p>
          <div className="stories-heading"><h2 id="stories-title" data-apple-heading>Every space<br />holds a story.</h2><p data-copy-reveal>A collection of perspectives,<br />materials and moments.</p></div>
          <div className="story-stage" role="region" aria-label="Scroll through the project stories" tabIndex={0}>
            {storyCards.map((card, index) => <div key={index} className="story-card" data-story-card data-story-clone={index < 2 || index >= stories.length + 2} aria-hidden={index < 2 || index >= stories.length + 2} style={{
              "--deck-offset": `${-card.slot * 62}px`,
              "--deck-scale": 1 - Math.min(Math.abs(card.slot) * 0.09, 0.36),
              "--deck-order": 100 - Math.abs(card.slot) * 10,
              "--deck-opacity": Math.abs(card.slot) <= 2 ? 1 : 0,
            } as CSSProperties}><Photo src={card.src} alt={card.title} sizes="(max-width: 700px) 90vw, 65vw" /></div>)}
            <span className="story-progress eyebrow" aria-hidden="true">{String(activeStory + 1).padStart(2, "0")} / {String(stories.length).padStart(2, "0")}</span>
          </div>
          <div className="stories-bottom eyebrow"><p aria-live="polite" aria-atomic="true">{stories[activeStory].caption}</p><button onClick={() => setDetail({ title: stories[activeStory].title, image: stories[activeStory].src, meta: "FORME / Interior stories", text: "A perspective from the FORME design concept. Light, materials and the moments that make a space feel like home." })}>Explore the stories ↗</button></div>
        </div>
      </section>

      <section className="practice inset section" id="practice" aria-labelledby="practice-title" data-node-id="3:74">
        <div><p className="eyebrow" data-word-reveal>05 — Our practice</p><h2 id="practice-title" data-scroll-heading>From first thought<br />to final detail.</h2><p className="practice-caption eyebrow" data-copy-reveal>Considered at every scale.</p></div>
        <div className="practice-list">
          {[
            ["Interior architecture", "Spaces shaped around how you live."],
            ["Furniture & objects", "Bespoke pieces with a point of view."],
            ["Styling & curation", "The finishing layers that make it yours."],
          ].map(([title, description], index) => <a href="#contact" className="practice-row" key={title}><span className="eyebrow" data-text-rise>0{index + 1}</span><div><h3 data-word-reveal>{title}</h3><p data-text-rise>{description}</p></div><span className="practice-arrow" aria-hidden="true">↗</span></a>)}
        </div>
      </section>

      <section className="contact inset section" id="contact" aria-labelledby="contact-title" data-node-id="3:93">
        <div className="rule" /><p className="eyebrow" data-word-reveal>Have a space in mind?</p>
        <div className="contact-main"><h2 id="contact-title" data-scroll-heading>Let’s make<br />room for it.</h2><a className="text-link" href="mailto:hello@forme.studio?subject=Let%E2%80%99s%20make%20room">Tell us about your project ↗</a></div>
        <div className="contact-bottom"><a href="mailto:hello@forme.studio" className="contact-email" data-word-reveal>hello@forme.studio</a><p className="eyebrow" data-text-rise>Based in Kolkata<br />Working everywhere</p></div>
      </section>
      <footer className="site-footer section" data-node-id="3:100">
        <div className="inset"><div className="footer-main"><a href="#top" className="footer-wordmark" aria-label="FORME — Back to top"><span className="footer-letter-mask" aria-hidden="true">{"forme".split("").map((letter, index) => <span className="footer-letter" data-footer-letter key={index}>{letter}</span>)}</span></a><nav aria-label="Social and contact links"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.pinterest.com/" target="_blank" rel="noreferrer">Pinterest ↗</a><a href="#contact">Contact ↗</a></nav></div>
          <div className="footer-bottom eyebrow" data-copy-reveal><p>© FORME STUDIO 2026</p><p>An imaginary studio / design concept</p></div></div>
      </footer>
    </main>
    <dialog ref={dialog} className="detail-dialog" aria-labelledby="detail-title" data-lenis-prevent onClose={() => { if (!dialog.current?.open) setDetail(null); }} onClick={(event) => { if (event.target === event.currentTarget) setDetail(null); }}>
      {detail && <article className="detail-content"><button className="dialog-close" onClick={() => setDetail(null)} aria-label="Close details">Close ×</button><p className="eyebrow">{detail.meta ?? "FORME / A closer look"}</p><h2 id="detail-title">{detail.title}</h2>
        {detail.image && <div className="detail-photo"><Photo src={detail.image} alt={detail.title} sizes="(max-width: 700px) 90vw, 700px" /></div>}
        <p>{detail.text}</p>
        {detail.title === "Selected spaces" && <div className="archive-links">{projects.map((project) => <button key={project.title} onClick={() => showProject(project)}>{project.title} ↗</button>)}</div>}
        <a className="text-link" href="#contact" onClick={() => setDetail(null)}>Start a conversation ↗</a>
      </article>}
    </dialog>
  </>;
}
