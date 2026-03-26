import { useEffect, useRef, useCallback } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const viewLabelRef = useRef<HTMLSpanElement>(null);
  const isHovering = useRef(false);
  const showView = useRef(false);
  const rafId = useRef<number>(0);
  const mousePos = useRef({ x: -100, y: -100 });

  // Use a single rAF loop instead of React state for 60fps cursor
  const updateCursor = useCallback(() => {
    const { x, y } = mousePos.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const viewLabel = viewLabelRef.current;

    if (dot) {
      dot.style.transform = `translate3d(${x - 8}px, ${y - 8}px, 0) scale(${isHovering.current ? 0 : 1})`;
    }

    if (ring) {
      ring.style.transform = `translate3d(${x - 24}px, ${y - 24}px, 0) scale(${isHovering.current ? 1.5 : 1})`;
      ring.style.backgroundColor = isHovering.current ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)';
    }

    if (viewLabel) {
      viewLabel.style.opacity = showView.current ? '1' : '0';
    }
  }, []);

  useEffect(() => {
    // Don't show cursor on touch devices
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) {
      if (dotRef.current) dotRef.current.style.display = 'none';
      if (ringRef.current) ringRef.current.style.display = 'none';
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updateCursor);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isLink = target.tagName.toLowerCase() === 'a' || target.closest('a');
      const isButton = target.tagName.toLowerCase() === 'button' || target.closest('button');
      const isHoverTarget = target.classList.contains('hover-target');
      const isViewTarget = target.classList.contains('cursor-view') || target.closest('.cursor-view');
      const isIgnored = target.tagName.toLowerCase() === 'html' || target.tagName.toLowerCase() === 'body';

      isHovering.current = Boolean((isLink || isButton || isHoverTarget || isViewTarget) && !isIgnored);
      showView.current = Boolean((isLink || isViewTarget) && !isIgnored);

      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(rafId.current);
    };
  }, [updateCursor]);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ willChange: 'transform', transition: 'transform 0.1s cubic-bezier(0.18, 0.89, 0.32, 1.27)' }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-12 h-12 border-2 border-white rounded-full pointer-events-none z-[9998] mix-blend-difference flex items-center justify-center"
        style={{ willChange: 'transform', transition: 'transform 0.2s ease-out, background-color 0.2s ease-out' }}
        aria-hidden="true"
      >
        <span
          ref={viewLabelRef}
          className="text-[8px] font-sans font-bold text-black uppercase tracking-wider"
          style={{ opacity: 0, transition: 'opacity 0.15s ease' }}
        >
          View
        </span>
      </div>
    </>
  );
}
