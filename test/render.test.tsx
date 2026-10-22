/**
 * Headless render smoke-tests for the 2026 animation layer and the pages that
 * integrate it. Run with: `npm run test:render`.
 *
 * Verified against a jsdom DOM (composition/DOM-structure guarantee only — not
 * pixels), asserting that:
 *  1. Each new primitive mounts and produces its expected DOM markers.
 *  2. The real pages (Home inside Layout — so Lenis + global layers exercise —
 *     plus Contact and Project) mount without GSAP/Framer/Lenis throwing.
 *
 * The IntersectionObserver + ResizeObserver polyfills in setup-env report
 * targets as intersecting, so `useInView`/`whileInView` scroll reveals fire.
 * Mounts use async `act` so React attaches host refs before running passive
 * effects — required to satisfy framer's dev-only `use-scroll` hydration guard.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { ProjectProvider } from '../src/context/ProjectContext';

import SvgMorph, { MORPH_BLOBS, MORPH_DIVIDER } from '../src/components/ui/SvgMorph';
import AnimatedText from '../src/components/ui/AnimatedText';
import ScrollText from '../src/components/ui/ScrollText';
import ScrollProgress from '../src/components/ui/ScrollProgress';
import GrainOverlay from '../src/components/ui/GrainOverlay';
import AuroraBackground from '../src/components/ui/AuroraBackground';
import MagneticButton from '../src/components/ui/MagneticButton';
import ParticleField from '../src/components/ui/ParticleField';
import CountUp from '../src/components/ui/CountUp';
import TiltCard from '../src/components/ui/TiltCard';
import RotatingWord from '../src/components/ui/RotatingWord';
import Reveal from '../src/components/ui/Reveal';

import Home from '../src/pages/Home';
import Contact from '../src/pages/Contact';
import Project from '../src/pages/Project';
import Layout from '../src/components/layout/Layout';

interface Mounted {
  root: Root;
  container: HTMLElement;
  $: <T extends Element = Element>(sel: string) => T | null;
  $$: <T extends Element = Element>(sel: string) => T[];
  text: string;
  cleanup: () => Promise<void>;
}

/** Mount a React tree into a detached container via async act (refs settle). */
async function mount(node: React.ReactElement): Promise<Mounted> {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(node);
  });
  const $ = <T extends Element = Element>(sel: string) =>
    container.querySelector<T>(sel);
  const $$ = <T extends Element = Element>(sel: string) =>
    Array.from(container.querySelectorAll<T>(sel));
  const text = container.textContent ?? '';
  const cleanup = async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  };
  return { root, container, $, $$, text, cleanup };
}

describe('2026 animation primitives', () => {
  it('SvgMorph mounts an <svg><path> with a valid d and both blob sets are compatible', async () => {
    const { $, cleanup } = await mount(<SvgMorph paths={MORPH_BLOBS} />);
    const path = $('svg path');
    assert.ok($('svg'), 'renders an <svg>');
    assert.ok(path, 'renders a <path> inside the svg');
    assert.ok((path as unknown as SVGPathElement).getAttribute('d'));
    assert.ok(MORPH_BLOBS.length >= 2, 'morph blob set has ≥2 shapes');
    assert.ok(MORPH_DIVIDER.length >= 2, 'divider set has ≥2 shapes');
    await cleanup();
  });

  it('AnimatedText renders the source tag with aria-label and split mask units', async () => {
    const { $, cleanup } = await mount(
      <AnimatedText as="h2" text="Featured Work" mode="words" />,
    );
    const el = $('h2');
    assert.ok(el, 'renders the h2');
    assert.equal(el!.getAttribute('aria-label'), 'Featured Work');
    // Masked word spans carry the text; at least one overflow-hidden mask exists.
    assert.ok(el!.querySelector('[class*="overflow-hidden"]'), 'renders masked units');
    await cleanup();
  });

  it('ScrollText renders a typed element containing the words', async () => {
    const { $, text, cleanup } = await mount(
      <ScrollText text="design engineering delivery" as="p" />,
    );
    assert.ok($('p'), 'renders a <p>');
    assert.match(text, /design/);
    assert.match(text, /delivery/);
    await cleanup();
  });

  it('ScrollProgress mounts a fixed z-[70] progress bar', async () => {
    const { $, cleanup } = await mount(<ScrollProgress />);
    const bar = $('div[class*="z-[70]"]');
    assert.ok(bar, 'renders the z-[70] progress bar');
    await cleanup();
  });

  it('GrainOverlay mounts a div with the feTurbulence data-URI background', async () => {
    const { container, cleanup } = await mount(<GrainOverlay />);
    const hasGrain = Array.from(container.querySelectorAll('div')).some(
      (d) =>
        (d as HTMLElement).style.backgroundImage.includes('data:image/svg+xml') &&
        (d as HTMLElement).style.backgroundImage.includes('feTurbulence'),
    );
    assert.ok(hasGrain, 'renders the grain layer with an feTurbulence data URI');
    await cleanup();
  });

  it('AuroraBackground renders three grayscale animate-aurora blobs', async () => {
    const { $$, cleanup } = await mount(<AuroraBackground mode="light" />);
    const blobs = $$('div[class*="animate-aurora"]');
    assert.equal(blobs.length, 3, 'renders exactly three aurora blobs');
    await cleanup();
  });

  it('MagneticButton wraps its child and keeps it mounted', async () => {
    const { $, cleanup } = await mount(
      <MagneticButton>
        <button type="button">Go</button>
      </MagneticButton>,
    );
    const btn = $('button');
    assert.ok(btn, 'renders the child button inside the magnetic wrapper');
    assert.equal(btn!.textContent, 'Go');
    await cleanup();
  });

  it('ParticleField mounts a <canvas>', async () => {
    const { $, cleanup } = await mount(<ParticleField />);
    assert.ok($('canvas'), 'renders a canvas');
    await cleanup();
  });

  it('RotatingWord renders an aria-live region showing the first word', async () => {
    const { $, cleanup } = await mount(
      <RotatingWord words={['Full Stack', 'Designer']} />,
    );
    const region = $('span[aria-live="polite"]');
    assert.ok(region, 'renders an aria-live=polite region');
    assert.match(region!.textContent ?? '', /Full Stack|Designer/);
    await cleanup();
  });

  it('CountUp renders an aria-label with prefix/value/suffix', async () => {
    const { $, cleanup } = await mount(<CountUp value={14} suffix="+" />);
    const span = $('span[aria-label="14+"]');
    assert.ok(span, 'renders a span labelled with the final value');
    await cleanup();
  });

  it('TiltCard wraps and keeps its children', async () => {
    const { $, cleanup } = await mount(<TiltCard><section>card</section></TiltCard>);
    assert.ok($('section'), 'renders child inside tilt wrapper');
    await cleanup();
  });

  it('Reveal wraps and keeps its children', async () => {
    const { $, cleanup } = await mount(<Reveal as="div"><p>revealed</p></Reveal>);
    assert.ok($('p'), 'renders child inside reveal wrapper');
    await cleanup();
  });
});

describe('page integration mounts', () => {
  it('Home mounts inside Layout (Lenis + global layers) with all effects present', async () => {
    const { $, $$, text, cleanup } = await mount(
      <MemoryRouter initialEntries={['/']}>
        <ProjectProvider>
          <Layout>
            <Home />
          </Layout>
        </ProjectProvider>
      </MemoryRouter>,
    );

    // GSAP hero headline renders.
    assert.ok($('#main-content'), 'renders the main content element');
    assert.match(text, /aditya|Aditya|Adi/i, 'hero text is present');

    // Global layers from Layout.
    assert.ok($('div[class*="z-[70]"]'), 'ScrollProgress bar present');
    const hasGrain = Array.from($$('div')).some(
      (d) => (d as HTMLElement).style.backgroundImage.includes('data:image/svg+xml'),
    );
    assert.ok(hasGrain, 'GrainOverlay layer present');

    // Home's own effect layers: particle canvas + SVG morph path.
    assert.ok($('canvas'), 'ParticleField canvas present (Let\'s Talk CTA)');
    assert.ok($('svg path'), 'SvgMorph path present (hero/body blobs)');

    await cleanup();
  });

  it('Contact mounts with its AnimatedText heading, morph blob, and magnetic submit', async () => {
    const { $, text, cleanup } = await mount(
      <MemoryRouter initialEntries={['/contact']}>
        <ProjectProvider>
          <Contact />
        </ProjectProvider>
      </MemoryRouter>,
    );

    const heading = $('h1[aria-label="Hello."]');
    assert.ok(heading, 'AnimatedText heading "Hello." present');
    assert.ok($('svg path'), 'morph blob present');
    assert.ok($('button[type="submit"]'), 'submit button present');
    assert.match(text, /aditya\.bhat\.dev@gmail\.com/, 'email address renders');

    await cleanup();
  });

  it('Project mounts with reveal blocks and the magnetic next-project link', async () => {
    const { $, text, cleanup } = await mount(
      <MemoryRouter initialEntries={['/project/1']}>
        <ProjectProvider>
          {/* Tools/instruments for loading as a lifted `fixture`:
              resolve useParams('id') via a matched route. */}
          <Routes>
            <Route path="/project/:id" element={<Project />} />
          </Routes>
        </ProjectProvider>
      </MemoryRouter>,
    );

    assert.ok($('[class*="reveal-img"]'), 'gallery reveal blocks present');
    // Project 1's next project is id "2" → "Customer Relationship Management (CRM)".
    assert.match(text, /Next Project/);
    assert.match(text, /CRM|Customer Relationship/);

    await cleanup();
  });
});