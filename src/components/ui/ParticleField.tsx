import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * ParticleField — a lightweight canvas of drifting, gently-twinkling dots with
 * faint nearest-neighbour constellation lines. Used as a monochrome (white)
 * backdrop for the dark "Let's Talk" CTA.
 *
 * Correctness (the "right" way):
 *  - DPR-aware (scaled backing store + `ctx.scale`) so dots stay crisp on HiDPI.
 *  - Sized via ResizeObserver against its parent; re-initialized on resize.
 *  - Pauses the rAF loop when the tab is hidden (saves battery).
 *  - Reduced motion → draws ONE static frame (no loop, no drift, no twinkle),
 *    so the CTA is never empty.
 *  - `pointer-events-none` so it never intercepts the CTA button.
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
}

interface ParticleFieldProps {
  className?: string;
  color?: string;
  /** Particles per 10,000 px² of canvas area. */
  density?: number;
  /** Max px distance for constellation lines. */
  connect?: number;
  /** Drift speed in px/s. */
  speed?: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export default function ParticleField({
  className,
  color = '#ffffff',
  density = 1,
  connect = 140,
  speed = 0.6,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    const rgb = hexToRgb(color);

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let last = performance.now();
    let running = true;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);

    const build = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(8, Math.min(140, Math.floor((width * height) / 10000) * density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: Math.random() * 1.5 + 0.6,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const drawOnce = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        const a = 0.4 + 0.4 * Math.sin(p.phase);
        ctx.globalAlpha = a;
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;

      ctx.clearRect(0, 0, width, height);

      // Constellation lines (nearest pairs).
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < connect * connect) {
            const dist = Math.sqrt(dist2);
            const alpha = (1 - dist / connect) * 0.18;
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Twinkling particles with gentle drift.
      for (const p of particles) {
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const a = 0.35 + 0.4 * (0.5 + 0.5 * Math.sin(t * 1.5 + p.phase));
        ctx.globalAlpha = a;
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduce) {
        drawOnce(); // static single frame
      } else {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    const onVis = () => {
      const hidden = document.hidden;
      if (hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduce) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const ro = new ResizeObserver(build);
    ro.observe(parent);

    build();
    start();
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [color, density, connect, speed, reduce]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className ?? ''}`}
      aria-hidden="true"
    />
  );
}