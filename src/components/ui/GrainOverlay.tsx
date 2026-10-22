/**
 * GrainOverlay — fixed full-screen film-grain texture.
 *
 * An inline SVG `feTurbulence` noise layer rendered as a fixed, pointer-events-
 * none overlay. `mix-blend-overlay` keeps it visible over BOTH light and dark
 * sections (readable on the dark "Let's Talk" CTA too), strictly grayscale.
 *
 * The shimmer uses the CSS `.animate-grain` keyframes, which only translate an
 * oversized layer (compositor-safe — no per-frame background repaint). Under
 * reduced motion the global media block freezes it into a static grain.
 */
export default function GrainOverlay({ opacity = 0.05 }: { opacity?: number }) {
  const noise = encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/></filter><rect width="300" height="300" filter="url(#n)"/></svg>',
  );

  return (
    <div
      aria-hidden="true"
      className="fixed -inset-[25%] z-[60] pointer-events-none mix-blend-overlay animate-grain"
      style={{ opacity, backgroundImage: `url("data:image/svg+xml,${noise}")` }}
    />
  );
}