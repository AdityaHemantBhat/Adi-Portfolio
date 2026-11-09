import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { projects } from '../src/context/ProjectContext';
import { getPageMetadata, siteConfig } from '../src/lib/seo';

const root = process.cwd();
const distDirectory = path.join(root, 'dist');
const template = await readFile(path.join(distDirectory, 'index.html'), 'utf8');

const routes = [
  '/',
  '/lookbook',
  '/contact',
  '/privacy',
  '/terms',
  ...projects.map((project) => `/project/${project.id}`),
];

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function setMeta(html: string, attribute: 'name' | 'property', key: string, content: string) {
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  const matcher = new RegExp(`<meta\\s+${attribute}="${escapeRegex(key)}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
  return matcher.test(html) ? html.replace(matcher, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}

function renderRouteHtml(route: string) {
  const metadata = getPageMetadata(route, projects);
  const canonicalUrl = new URL(metadata.path, siteConfig.url).href;
  const imageUrl = new URL(metadata.image, siteConfig.url).href;
  let html = template.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`);

  html = setMeta(html, 'name', 'description', metadata.description);
  html = setMeta(html, 'name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  html = setMeta(html, 'property', 'og:type', route.startsWith('/project/') ? 'article' : 'website');
  html = setMeta(html, 'property', 'og:title', metadata.title);
  html = setMeta(html, 'property', 'og:description', metadata.description);
  html = setMeta(html, 'property', 'og:image', imageUrl);
  html = setMeta(html, 'property', 'og:image:alt', `${metadata.title} — Aditya Bhat`);
  html = setMeta(html, 'property', 'og:url', canonicalUrl);
  html = setMeta(html, 'property', 'og:site_name', 'Aditya Bhat Portfolio');
  html = setMeta(html, 'property', 'og:locale', 'en_IN');
  html = setMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = setMeta(html, 'name', 'twitter:title', metadata.title);
  html = setMeta(html, 'name', 'twitter:description', metadata.description);
  html = setMeta(html, 'name', 'twitter:image', imageUrl);
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
  );
  html = html.replace(
    /<script\s+id="page-structured-data"[\s\S]*?<\/script>/i,
    `<script id="page-structured-data" type="application/ld+json">${JSON.stringify(metadata.structuredData).replaceAll('<', '\\u003c')}</script>`,
  );
  return html;
}

const sitemapDate = new Date().toISOString().slice(0, 10);
const sitemapEntries = routes.map((route) => {
  const location = new URL(route, siteConfig.url).href;
  const project = route.startsWith('/project/')
    ? projects.find((item) => `/project/${item.id}` === route)
    : undefined;
  const image = project
    ? `\n    <image:image><image:loc>${escapeHtml(new URL(project.mainImage, siteConfig.url).href)}</image:loc></image:image>`
    : '';
  return `  <url>\n    <loc>${escapeHtml(location)}</loc>\n    <lastmod>${sitemapDate}</lastmod>${image}\n  </url>`;
});
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${sitemapEntries.join('\n')}\n</urlset>\n`;

for (const route of routes.filter((entry) => entry !== '/')) {
  const routeDirectory = path.join(distDirectory, ...route.split('/').filter(Boolean));
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(path.join(routeDirectory, 'index.html'), renderRouteHtml(route), 'utf8');
}

await writeFile(path.join(distDirectory, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(path.join(root, 'public', 'sitemap.xml'), sitemap, 'utf8');
