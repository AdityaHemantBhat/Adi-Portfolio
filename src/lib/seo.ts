import type { ProjectData } from '../context/ProjectContext';

export const siteConfig = {
  name: 'Aditya Bhat',
  title: 'Aditya Bhat | Full Stack Developer & Web Designer in Goa, India',
  description:
    'Aditya Bhat is a full stack developer and web designer in Goa, India, building modern websites and web applications with React, TypeScript, and Node.js.',
  url: 'https://adityahemantbhat.com',
  image: '/images/profile.webp',
  social: {
    github: 'https://github.com/AdityaHemantBhat',
    linkedin: 'https://www.linkedin.com/in/aditya-bhat-3661a8200/',
    instagram: 'https://www.instagram.com/aditya.bhat.dev/',
  },
};

export interface PageMetadata {
  title: string;
  description: string;
  path: string;
  image: string;
  robots: string;
  structuredData: Record<string, unknown>;
}

const pageDefinitions: Record<string, { title: string; description: string }> = {
  '/': {
    title: siteConfig.title,
    description: siteConfig.description,
  },
  '/lookbook': {
    title: 'Selected Projects | Aditya Bhat Portfolio',
    description:
      'Explore websites and web applications designed and developed by Aditya Bhat, a Goa-based full stack developer and web designer.',
  },
  '/contact': {
    title: 'Contact Aditya Bhat | Web Developer in Goa, India',
    description:
      'Contact Aditya Bhat in Goa, India, to discuss a website, React application, full stack development, or a digital project.',
  },
  '/privacy': {
    title: 'Privacy Policy | Aditya Bhat Portfolio',
    description: 'Read the privacy policy for the Aditya Bhat portfolio website.',
  },
  '/terms': {
    title: 'Terms of Service | Aditya Bhat Portfolio',
    description: 'Read the terms of service for the Aditya Bhat portfolio website.',
  },
};

function personStructuredData() {
  return {
    '@type': 'Person',
    '@id': `${siteConfig.url}/#person`,
    name: siteConfig.name,
    url: `${siteConfig.url}/`,
    jobTitle: 'Full Stack Developer and Web Designer',
    email: 'mailto:aditya.bhat.dev@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Goa',
      addressCountry: 'IN',
    },
    sameAs: Object.values(siteConfig.social),
    knowsAbout: ['Web Design', 'React', 'TypeScript', 'Node.js', 'Full Stack Development'],
  };
}

function getStructuredData(path: string, project?: ProjectData) {
  const person = personStructuredData();

  if (project) {
    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      url: `${siteConfig.url}${path}`,
      image: new URL(project.mainImage, siteConfig.url).href,
      author: { '@id': `${siteConfig.url}/#person` },
      ...(project.liveLink ? { sameAs: project.liveLink } : {}),
      keywords: [
        project.category,
        ...(project.technologies ?? []),
        'Aditya Bhat',
        'Goa',
      ].join(', '),
    };
  }

  if (path === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        person,
        {
          '@type': 'WebSite',
          '@id': `${siteConfig.url}/#website`,
          name: 'Aditya Bhat Portfolio',
          url: `${siteConfig.url}/`,
          description: siteConfig.description,
          inLanguage: 'en-IN',
          author: { '@id': `${siteConfig.url}/#person` },
        },
      ],
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageDefinitions[path]?.title ?? siteConfig.title,
    description: pageDefinitions[path]?.description ?? siteConfig.description,
    url: `${siteConfig.url}${path}`,
    inLanguage: 'en-IN',
    author: { '@id': `${siteConfig.url}/#person` },
  };
}

export function getPageMetadata(pathname: string, projects: ProjectData[]): PageMetadata {
  const path = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const projectMatch = path.match(/^\/project\/([^/]+)$/);
  const project = projectMatch
    ? projects.find((item) => item.id === projectMatch[1])
    : undefined;

  if (project) {
    return {
      title: `${project.title} | Project by Aditya Bhat`,
      description: `${project.description} View project details and more work by Aditya Bhat, a full stack developer and web designer in Goa, India.`,
      path,
      image: project.mainImage,
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      structuredData: getStructuredData(path, project),
    };
  }

  const definition = pageDefinitions[path];
  return {
    title: definition?.title ?? siteConfig.title,
    description: definition?.description ?? siteConfig.description,
    path,
    image: siteConfig.image,
    robots: definition
      ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      : 'noindex, follow',
    structuredData: getStructuredData(path),
  };
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function applyPageMetadata(metadata: PageMetadata) {
  const canonicalUrl = new URL(metadata.path, siteConfig.url).href;
  const imageUrl = new URL(metadata.image, siteConfig.url).href;

  document.title = metadata.title;
  upsertMeta('name', 'description', metadata.description);
  upsertMeta('name', 'robots', metadata.robots);
  upsertMeta('property', 'og:type', metadata.path.startsWith('/project/') ? 'article' : 'website');
  upsertMeta('property', 'og:title', metadata.title);
  upsertMeta('property', 'og:description', metadata.description);
  upsertMeta('property', 'og:image', imageUrl);
  upsertMeta('property', 'og:image:alt', `${metadata.title} — Aditya Bhat`);
  upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:site_name', 'Aditya Bhat Portfolio');
  upsertMeta('property', 'og:locale', 'en_IN');
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', metadata.title);
  upsertMeta('name', 'twitter:description', metadata.description);
  upsertMeta('name', 'twitter:image', imageUrl);

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;

  let structuredData = document.getElementById('page-structured-data');
  if (!structuredData) {
    structuredData = document.createElement('script');
    structuredData.id = 'page-structured-data';
    structuredData.type = 'application/ld+json';
    document.head.appendChild(structuredData);
  }
  structuredData.textContent = JSON.stringify(metadata.structuredData);
}
