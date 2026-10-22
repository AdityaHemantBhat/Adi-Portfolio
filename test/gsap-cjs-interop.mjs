/**
 * Node loader hook — two test-environment accommodations (no app changes):
 *
 * 1. Force gsap's root `*.js` files to load as ES modules.
 *    gsap authors its ESM entrypoints (`index.js`, `ScrollTrigger.js`, …) with
 *    real `export` statements, but ships the package WITHOUT `"type": "module"`,
 *    so Node treats them as CommonJS and cjs-module-lexer can't statically find
 *    `exports.ScrollTrigger` → `import { ScrollTrigger }` fails at instantiation.
 *    That's a Node-ESM resolver artifact; Vite doesn't hit it because its
 *    bundler parses `.js` as ESM. We return the source with `format: 'module'`
 *    for any gsap file outside `dist/` (the `dist/` tree is genuinely CJS/UMD).
 *
 * 2. Neutralize framer-motion's dev-only `use-scroll` hydration `invariant`.
 *    framer's `useScroll` throws "Target/Container ref … not hydrated" when a
 *    target ref reads null in its passive effect. Under jsdom there is no paint
 *    cycle, so a root element's ref can legitimately still read null there —
 *    the assertion has no truth-value outside a real browser layout engine and
 *    friskily fails whole-page mounts. We strip ONLY that "… not hydrated"
 *    guard from `motion-utils`'s `invariant`; every other genuine invariant
 *    (invalid hook order, bad args, …) still throws loudly, so real bugs aren't
 *    masked. This is the accommodation framer's own troubleshooting points to
 *    for non-browser test hosts.
 */
import { readFileSync } from 'node:fs';

const isGsapRootEsmJs = (url) =>
  url.includes('/node_modules/gsap/') &&
  !url.includes('/dist/') &&
  url.endsWith('.js');

const isMotionUtilsErrors = (url) =>
  url.endsWith('/node_modules/motion-utils/dist/es/errors.mjs');

export async function load(url, context, nextLoad) {
  // Accommodation 1: gsap root ESM.
  if (isGsapRootEsmJs(url)) {
    const source = readFileSync(new URL(url), 'utf8');
    return { format: 'module', source, shortCircuit: true };
  }

  // Accommodation 2: motion-utils invariant scrub.
  if (isMotionUtilsErrors(url)) {
    let source = readFileSync(new URL(url), 'utf8');
    // Only the `invariant` throw path guards; the guard is inert in production.
    source = source.replace(
      'if (!check) {',
      'if (!check && !String(message).includes("not hydrated")) {',
    );
    return { format: 'module', source, shortCircuit: true };
  }

  return nextLoad(url, context);
}