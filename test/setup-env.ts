/**
 * Headless DOM environment for the render smoke-tests.
 *
 * Builds a jsdom window (with `pretendToBeVisual` so rAF/idle callbacks exist),
 * promotes it onto `globalThis`, then polyfills the browser APIs the app's
 * animation stack (framer-motion, GSAP ScrollTrigger, Lenis) and our new canvas
 * / scroll primitives require but jsdom does not implement. Everything here is
 * idempotent so the module can be imported more than once.
 *
 * This makes effects *mount* headlessly — it is a composition/DOM-structure
 * check, NOT a pixel render (jsdom has no layout engine, so GSAP pins compute
 * to zero offsets and animations "play" against a virtual timeline). See
 * README note; a real browser is needed to validate pixels.
 */
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  pretendToBeVisual: true,
  url: 'http://localhost/',
});

const window = dom.window as any;
const g: any = globalThis;

// ── Promote jsdom's constructors + runtime globals onto globalThis ─────────
const COPY: string[] = [
  'navigator', 'HTMLElement', 'SVGElement', 'SVGPathElement', 'HTMLCanvasElement',
  'HTMLDivElement', 'HTMLSpanElement', 'HTMLAnchorElement', 'HTMLInputElement',
  'HTMLTextAreaElement', 'HTMLFormElement', 'HTMLImageElement', 'Element', 'Node',
  'Text', 'Document', 'DocumentFragment', 'Event', 'EventTarget', 'CustomEvent',
  'MouseEvent', 'KeyboardEvent', 'WheelEvent', 'TouchEvent', 'InputEvent',
  'UIEvent', 'FocusEvent', 'DragEvent', 'getComputedStyle', 'requestAnimationFrame',
  'cancelAnimationFrame', 'requestIdleCallback', 'cancelIdleCallback', 'performance',
  'MutationObserver', 'DOMException', 'DOMParser', 'XMLSerializer', 'Range',
  'DOMRect', 'File', 'Blob', 'FormData', 'Headers', 'URL', 'URLSearchParams',
  'MessageChannel', 'MessagePort', 'CSS', 'CSSStyleSheet', 'getSelection', 'Path2D',
  'ShadowRoot', 'HTMLStyleElement', 'HTMLHeadingElement', 'HTMLButtonElement',
  'Window',
];
for (const k of COPY) {
  if (window[k] !== undefined && g[k] === undefined) g[k] = window[k];
}
g.window = window;
g.document = window.document;

// ── matchMedia (jsdom lacks it; framer/lenis consult it for reduced motion) ──
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return false; },
  });
}

// ── ResizeObserver (jsdom lacks it; ParticleField, Lenis, framer use it) ────
if (typeof window.ResizeObserver === 'undefined') {
  class FakeResizeObserver {
    constructor(private cb?: any) {}
    observe() { this.cb?.({}); }
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = FakeResizeObserver;
  g.ResizeObserver = FakeResizeObserver;
}

// ── IntersectionObserver (jsdom lacks it; framer useInView/whileInView use it)
//    Immediately report the target as intersecting so scroll-reveals fire. ────
if (typeof window.IntersectionObserver === 'undefined') {
  class FakeIntersectionObserver {
    private readonly cb: any;
    constructor(cb: any) { this.cb = cb; }
    observe(target: Element) {
      this.cb(
        [{
          isIntersecting: true,
          intersectionRatio: 1,
          target,
          boundingClientRect: {},
          intersectionRect: {},
          rootBounds: null,
          time: 0,
        }],
        this,
      );
    }
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
    get root() { return null; }
    get rootMargin() { return '0px'; }
    get thresholds() { return [0]; }
  }
  window.IntersectionObserver = FakeIntersectionObserver;
  g.IntersectionObserver = FakeIntersectionObserver;
}

// ── Scroll stubs (jsdom logs "not implemented" for these — silence it) ──────
window.scrollTo = function scrollTo() {};
window.scroll = function scroll() {};
g.scrollTo = window.scrollTo;
typeof Element !== 'undefined' &&
  ((Element as any).prototype.scrollIntoView = function scrollIntoView() {});
typeof Element !== 'undefined' &&
  ((Element as any).prototype.scrollTo = function scrollTo() {});

// ── Canvas 2D no-op context (jsdom has no rasteriser; ParticleField needs it) ─
// get() returns a function for any method call; set() swallows property writes.
const ctxStub = new Proxy(
  {},
  {
    get(_t: any, prop: string | symbol) {
      if (prop === 'canvas') return null;
      return (...args: any[]) => {
        if (
          prop === 'createLinearGradient' ||
          prop === 'createRadialGradient' ||
          prop === 'createPattern'
        ) {
          return { addColorStop() {} };
        }
        return 0;
      };
    },
    set() { return true; },
  },
);
if (typeof HTMLCanvasElement !== 'undefined') {
  (HTMLCanvasElement as any).prototype.getContext = function getContext(type: string) {
    if (type === '2d') return ctxStub;
    return null;
  };
  (HTMLCanvasElement as any).prototype.toDataURL = function toDataURL() { return ''; };
}

// ── PointerEvent (older jsdom lacks it; framer feature-detects it) ──────────
if (typeof window.PointerEvent === 'undefined') {
  window.PointerEvent = class PointerEvent extends (window.Event as any) {
    clientX: number;
    clientY: number;
    constructor(type: string, init?: any) {
      super(type, init);
      this.clientX = init?.clientX ?? 0;
      this.clientY = init?.clientY ?? 0;
    }
  };
  g.PointerEvent = window.PointerEvent;
}

// ── visualViewport (Lenis consults it) ──────────────────────────────────────
if (!window.visualViewport) {
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: {
      width: window.innerWidth,
      height: window.innerHeight,
      offsetLeft: 0,
      offsetTop: 0,
      scale: 1,
      addEventListener() {},
      removeEventListener() {},
    },
  });
}

// ── Present a "laid-out" element (jsdom measures everything as 0×0) ─────────
// Framer-motion's `useScroll` has a dev-only hydration guard that throws when a
// target ref measures zero — and GSAP offsets all collapse to 0 — under jsdom.
// Report a plausible non-zero size so scroll measurement and hydration logic
// behave as they would in a real browser. Monotonic `top` keeps distinct
// elements at different offsets.
let rectCounter = 0;
if (typeof Element !== 'undefined') {
  Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
    configurable: true,
    value() {
      const i = rectCounter++;
      return {
        x: 0,
        y: 0,
        top: i * 10,
        right: 800,
        bottom: i * 10 + 600,
        left: 0,
        width: 800,
        height: 600,
        toJSON() { return this; },
      };
    },
  });
  if (typeof HTMLElement !== 'undefined') {
    for (const key of ['offsetWidth', 'offsetHeight', 'clientWidth', 'clientHeight']) {
      Object.defineProperty(HTMLElement.prototype, key, {
        configurable: true,
        get() { return key === 'offsetWidth' || key === 'clientWidth' ? 800 : 600; },
      });
    }
  }
}

// ── react-dom act() flush requires this flag in non-jsdom-testing setups ────
g.IS_REACT_ACT_ENVIRONMENT = true;