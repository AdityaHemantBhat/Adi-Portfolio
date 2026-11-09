import { createContext, useContext, ReactNode } from 'react';

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  challenge?: string;
  technologies?: string[];
  mainImage: string;
  mainImageAlt?: string;
  galleryImages: string[];
  galleryImageAlts?: string[];
  galleryImageFits?: ('cover' | 'contain')[];
  liveLink?: string;
  githubRepo?: string;
}

export const projects: ProjectData[] = [
  {
    id: "1",
    title: "Nirakar Education Society",
    category: "Full-Stack Development",
    year: "2026",
    description: "A comprehensive digital platform for an educational society, featuring institutional information, dynamic content management, an administrative dashboard, and a digital library.",
    challenge: "Engineering a scalable, multi-campus education platform capable of managing institutional portals across three schools (Shri Nirakar High School, Tudal High School, and S.S. Angle Higher Secondary School). Key technical hurdles included building a robust role-based administrative dashboard, integrating dynamic content management with deterministic classical PDF processing for student archives, and implementing secure document management and alumni networking across distributed campus databases.",
    technologies: ["React 19", "Node.js", "Express", "PostgreSQL", "Prisma", "Tailwind CSS"],
    mainImage: "/images/Nirakar%20Education%20Society/NEC-Single.png",
    mainImageAlt: "Shri Nirakar Education Society website homepage",
    galleryImages: [
      "/images/Nirakar%20Education%20Society/Nirakar-Education-Society.png"
    ],
    galleryImageAlts: ["Full-page screenshot of the Shri Nirakar Education Society website"],
    galleryImageFits: ["contain"],
    liveLink: "https://nirakar-education-society.vercel.app/",
    githubRepo: "https://github.com/AdityaHemantBhat"
  },
  {
    id: "2",
    title: "The Daily Edit",
    category: "Full-Stack Development",
    year: "2026",
    description: "A modern digital publishing platform featuring articles, blogs, editorial content, and dynamic content management with an administrative panel.",
    challenge: "Developing a high-throughput content architecture and scalable publishing infrastructure with real-time editorial workflows. Key technical challenges included fine-tuning programmatic SEO with dynamic metadata and sitemaps, optimizing server response times through Socket.IO cache invalidation, and seamlessly integrating a browser-based client-side processing suite alongside rich article management, scheduling, and view tracking.",
    technologies: ["React", "Express", "PostgreSQL", "Prisma", "Socket.IO", "Tailwind CSS"],
    mainImage: "/images/TheDailyEdit/TheDailyEdit-Main.png",
    galleryImages: [
      "/images/TheDailyEdit/TheDailyEdit-Fullscreen.png"
    ],
    galleryImageAlts: ["Full-page screenshot of The Daily Edit website"],
    galleryImageFits: ["contain"],
    liveLink: "https://frontend.getvoroa.com/",
    githubRepo: "https://github.com/AdityaHemantBhat/The-Daily-Edit"
  },
  {
    id: "3",
    title: "Damodar Dental Care",
    category: "Frontend Development",
    year: "2026",
    description: "A modern, responsive website for Damodar Dental Care, built with React.js to introduce the clinic, its dental services, and patient information.",
    technologies: ["React.js"],
    mainImage: "/images/Damodar%20Dental%20Care/Damodar-dental-care-front.png",
    mainImageAlt: "Damodar Dental Care website homepage",
    galleryImages: [
      "/images/Damodar%20Dental%20Care/Damodar-Dental-Care-fullscreen.png"
    ],
    galleryImageAlts: ["Full-page screenshot of the Damodar Dental Care website"],
    galleryImageFits: ["contain"],
    liveLink: "https://www.damodardental.co.in/"
  },
  {
    id: "4",
    title: "Nizachem",
    category: "Full-Stack Development",
    year: "2026",
    description: "A complete web development project showcasing a modern digital presence with frontend and backend functionality.",
    challenge: "Developing a production-grade restaurant and bar web application with real-time operational state tracking. Challenges included synchronizing live opening status and reservation queues via WebSocket and REST APIs, architecting a responsive digital menu with structured schema markup for local SEO, and maintaining ultra-smooth 60fps animations with GSAP and Lenis without compromising mobile loading performance.",
    technologies: ["React", "Node.js", "NestJS", "Prisma", "PostgreSQL", "GSAP"],
    mainImage: "/images/Nizachem/Nizachem-Main.png",
    galleryImages: [
      "/images/Nizachem/Nizachem-fullscreen.png"
    ],
    galleryImageAlts: ["Full-page screenshot of the Nizachem website"],
    galleryImageFits: ["contain"],
    liveLink: "https://nizachem.vercel.app/",
    githubRepo: "https://github.com/AdityaHemantBhat/Nizachem"
  }
];

interface ProjectContextType {
  projects: ProjectData[];
  getProjectById: (id: string) => ProjectData | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const getProjectById = (id: string) => {
    return projects.find(p => p.id === id);
  };

  return (
    <ProjectContext.Provider value={{ projects, getProjectById }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
