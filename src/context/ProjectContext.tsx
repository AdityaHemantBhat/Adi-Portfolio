import React, { createContext, useContext, ReactNode } from 'react';

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  mainImage: string;
  galleryImages: string[];
  liveLink?: string;
  githubRepo?: string;
}

const projects: ProjectData[] = [
  {
    id: "1",
    title: "CanvasTech",
    category: "Full Stack Development",
    year: "2026",
    description: "A modern redo of a job consultant and recruitment platform, specializing in streamlining the manpower hunt for clients. Built with the full MERN stack, it features automated email resume authentication and a seamless professional workflow. The core challenge was re-architecting the entire platform with completely new technology and a premium design language from the ground up.",
    mainImage: "/images/CanvasTech/CanvasTech.png",
    galleryImages: [
      "/images/CanvasTech/CanvasTech-Apply.png",
      "/images/CanvasTech/CanvasTech-Clients.png"
    ],
    liveLink: "https://canvatech-1.onrender.com/",
    githubRepo: "https://github.com/AdityaHemantBhat/canvatech"
  },
  {
    id: "2",
    title: "Customer Relationship Management (CRM)",
    category: "Full Stack Development",
    year: "2026",
    description: "A modern reimagining of a Customer Relationship Management (CRM) platform, designed specifically to streamline manpower acquisition and operational workflows for clients. Built using the full MERN stack, the platform delivers a seamless, scalable, and high-performance experience with a refined, professional design language.The system includes a dedicated Admin/Staff Panel that enables staff to efficiently fetch and manage user details, assign diagnostic tests, and oversee the entire patient lifecycle. Customers are provided with flexible payment options — they can either pay instantly within the platform, complete payment later via a WhatsApp notification link, or use a QR code-based payment system integrated with Razorpay.A core feature of the platform is its structured Workflow Management System, which allows staff to track each patient’s journey step-by-step:Patient Registration,Sample Pending,Sample Collected,Processing,Report Ready.This ensures complete transparency and smooth operational flow within pathology labs.Once reports are generated, staff can upload and deliver them directly through the system. Patients can securely log in using their phone number to access and download their reports anytime, ensuring convenience and accessibility.The core challenge of this project was re-architecting the entire platform from scratch using modern technologies, while also introducing a premium UI/UX experience tailored for healthcare workflows.",
    mainImage: "/images/Pathology/Pathology-Dashboard.png",
    galleryImages: [
      "/images/Pathology/Pathology-Dashboard.png",
      "/images/Pathology/Pathology-Workflow.png"
    ],
    liveLink: "https://pathology-lab-5ylr.onrender.com/login",
    githubRepo: "https://github.com/AdityaHemantBhat/Pathology-Lab"
  },
  {
    id: "3",
    title: "EcoBazzar",
    category: "React Development",
    year: "2025",
    description: "EcoBazzar is a modern, user-friendly e-commerce platform built with React and Node.js, designed to provide a seamless shopping experience for customers while offering powerful management tools for administrators. The platform features a clean, intuitive interface with easy navigation, product browsing, and secure checkout. For administrators, EcoBazzar includes a comprehensive dashboard to manage products, track orders, and oversee store operations efficiently. The core challenge of this project was to create a scalable, high-performance e-commerce solution that balances ease of use with robust functionality, ensuring a smooth experience for both shoppers and store owners.",
    mainImage: "/images/EcoBazzar/EcoBazzar-Home.png",
    galleryImages: [
      "/images/EcoBazzar/EcoBazzar-Home.png",
      "/images/EcoBazzar/EcoBazzar-Cart.png"
    ],
    liveLink: "https://eco-bazzar-rho.vercel.app/",
    githubRepo: "https://github.com/AdityaHemantBhat/EcoBazzar"
  },
  {
    id: "4",
    title: "Restaurant Website",
    category: "Frontend Design",
    year: "2025",
    description: "Modern restaurant website built with pure HTML and CSS featuring elegant design, responsive layout, and smooth animations. Includes menu showcase, gallery section, contact information, and mobile first approach with clean typography and visual hierarchy.",
    mainImage: "/images/Restaurant/Restaurant-Home.png",
    galleryImages: [
      "/images/Restaurant/Restaurant-Home.png"
    ],
    liveLink: "https://adityahemantbhat.github.io/cohort-2.0/Project%20-%20B/",
    githubRepo: "https://github.com/AdityaHemantBhat/cohort-2.0/tree/main/Project%20-%20B"
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
