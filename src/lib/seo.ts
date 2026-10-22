import { Metadata } from 'react-router-dom';

/**
 * SEO configuration for the portfolio.
 * Provides structured data and meta-tag generators to ensure optimal indexing.
 */

export const siteConfig = {
  name: "Aditya Bhat",
  title: "Aditya Bhat — Full Stack Developer & Web Designer",
  description: "Aditya Bhat is a Full Stack Developer and Web Designer based in Goa, India. Specializing in React, Node.js, TypeScript, and modern web development.",
  url: "https://adityahemantbhat.vercel.app/",
  image: "/images/profile.webp",
  social: {
    github: "https://github.com/AdityaHemantBhat",
    linkedin: "https://www.linkedin.com/in/aditya-bhat-3661a8200/",
    instagram: "https://www.instagram.com/aditya.bhat.dev/"
  }
};

export const generateStructuredData = (type: 'Person' | 'WebSite' | 'Project', data?: any) => {
  switch (type) {
    case 'Person':
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": siteConfig.name,
        "jobTitle": "Full Stack Developer",
        "url": siteConfig.url,
        "sameAs": [siteConfig.social.github, siteConfig.social.linkedin, siteConfig.social.instagram]
      };
    case 'Project':
      return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": data?.title,
        "description": data?.description,
        "applicationCategory": "DeveloperApplication"
      };
    default:
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteConfig.name,
        "url": siteConfig.url
      };
  }
};
