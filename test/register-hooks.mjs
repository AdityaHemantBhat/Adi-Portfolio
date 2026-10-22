/**
 * Registers the gsap ESM-interop loader hook so Node composes it before tsx.
 * Imported (via `--import`) ahead of the test entrypoint, so the hook is active
 * before any page module imports gsap.
 */
import { register } from 'node:module';

register(new URL('./gsap-cjs-interop.mjs', import.meta.url).href, import.meta.url);