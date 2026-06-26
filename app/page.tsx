import { CONFIG } from "./config";
import PortfolioClient from "./PortfolioClient";
import { Project, Experience } from "./api";

// Set cache revalidation time (ISR - Incremental Static Regeneration)
// Revalidate page data every 60 seconds
export const revalidate = 60;

async function getPortfolioData(): Promise<{ projects: Project[]; experiences: Experience[] }> {
  try {
    // Perform server-side fetches over HTTP with a timeout / fallback check
    const [projectsRes, experiencesRes] = await Promise.all([
      fetch(`${CONFIG.apiUrl}/projects`, { next: { revalidate: 60 } }),
      fetch(`${CONFIG.apiUrl}/experiences`, { next: { revalidate: 60 } })
    ]);

    if (!projectsRes.ok || !experiencesRes.ok) {
      throw new Error("HTTP error while fetching dynamic portfolio collections.");
    }

    const projectsJson = await projectsRes.json();
    const experiencesJson = await experiencesRes.json();

    return {
      projects: projectsJson.data || [],
      experiences: experiencesJson.data || []
    };
  } catch (error) {
    console.warn(
      "[Next SSR Warning] Backend database is offline or unreachable. Initializing static fallback context.",
      error
    );
    
    // In production, fallback to a solid predefined set of items from the resume so the website never displays a blank page
    const fallbackProjects: Project[] = [
      {
        id: "seen-jeem",
        title: "Seen Jeem",
        description: "A real-time collaborative game platform built using the MERN Stack, supporting high concurrency for web and mobile players.",
        tags: "ReactJS,Node.js,Express.js,MongoDB,WebSockets,MERN",
        order: 1,
        features: "Real-time game synchronization via WebSockets\nBackend performance tuning for heavy concurrency\nLeaderboards and progress tracking configurations"
      },
      {
        id: "prompass",
        title: "Prompass",
        description: "A vendor-facing admin campaign platform that enables promotions management, tracking campaign performance, and user analytics.",
        tags: "ReactJS,Node.js,Express.js,MongoDB,AWS,MERN",
        order: 2,
        features: "Campaign creation, edit actions, and real-time vendor insights representation\nExpress.js backend services and database handlers"
      },
      {
        id: "cred-mantra",
        title: "Cred Mantra",
        description: "A responsive web application allowing users to request, process, and manage educational and organization certificate verifications online.",
        tags: "ReactJS,Node.js,Prisma,PostgreSQL,PayPal,JWT",
        order: 3,
        features: "Node.js RESTful API using Prisma ORM\nJWT student and organization secure authorization gates\nPayPal payment gateway integrations"
      }
    ];

    const fallbackExperiences: Experience[] = [
      {
        id: "eww",
        company: "Excellent Web World, Ahmedabad",
        role: "Software Engineer",
        duration: "Apr 2025 - Present",
        description: "Engineered Seen Jeem real-time gaming platform using MERN Stack, optimized Node.js API endpoints for low-latency queries, and built Prompass campaign analytics vendor-dashboard using AWS services integration.",
        skills: "MERN Stack,ReactJS,Node.js,Express.js,MongoDB,WebSockets,AWS",
        order: 1
      },
      {
        id: "netpair",
        company: "Netpair Infotech, Ahmedabad",
        role: "Software Engineer",
        duration: "Sep 2024 - Feb 2025",
        description: "Contributed to HDFC Ergo desktop application optimizing load speeds. Designed and implemented PostgreSQL database schemas for Cred Mantra and structured Express.js APIs for Vital Step health tracking app.",
        skills: "ReactJS,Node.js,Prisma ORM,PostgreSQL,MongoDB,Express.js,JWT,PayPal",
        order: 2
      }
    ];

    return {
      projects: fallbackProjects,
      experiences: fallbackExperiences
    };
  }
}

export default async function Page() {
  // Fetch data on the server side
  const { projects, experiences } = await getPortfolioData();

  return (
    <PortfolioClient
      initialProjects={projects}
      initialExperiences={experiences}
    />
  );
}
