type Direction = "right" | "left" | "down";

/** A consistent stroke icon that renders without platform emoji glyphs. */
export function ArrowIcon({ direction = "right", className = "" }: { direction?: Direction; className?: string }) {
  const rotation = { right: 0, left: 180, down: 90 }[direction];
  return <svg className={`arrow-icon ${className}`.trim()} width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" focusable="false">
    <path d="M4 12h16m-6-6 6 6-6 6" transform={rotation ? `rotate(${rotation} 12 12)` : undefined} />
  </svg>;
}
