"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// --- API Endpoints ---
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// --- SVG Icons (Self-Contained for zero external dependencies) ---
const GithubIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CodeIcon = () => (
  <svg className="w-6 h-6 text-accent-cyan" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg className="w-6 h-6 text-accent-purple" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 013.75 18.4V14.15m16.5 0c.513 0 .956-.346 1.086-.843l1.156-4.426a1.128 1.128 0 00-.07-.915c-.179-.316-.517-.516-.883-.516h-2.25A2.25 2.25 0 0015 9.75M20.25 14.15A2.25 2.25 0 0018 11.85V9.75M3.75 14.15c-.513 0-.956-.346-1.086-.843L1.508 8.88a1.128 1.128 0 01.07-.915c.179-.316.517-.516.883-.516h2.25A2.25 2.25 0 017 9.75M3.75 14.15A2.25 2.25 0 016 11.85V9.75m0 0a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 9.75m-12 0a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 9.75" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.096.813zM19.071 4.929l-.707 1.9-.707-1.9-1.9-.707 1.9-.707.707-1.9.707 1.9 1.9.707-1.9.707zM19.071 19.071l-.707 1.9-.707-1.9-1.9-.707 1.9-.707.707-1.9.707 1.9 1.9.707-1.9.707z" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="w-12 h-12 text-emerald-400 mx-auto mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
  </svg>
);

// --- Fallback Mock Data ---
const DEFAULT_PROJECTS = [
  {
    id: "1",
    title: "DevFlow - Developer Q&A Platform",
    description: "A comprehensive developer Q&A forum with reputation systems, thread voting, global search, and AI-generated answer summaries. Built for scalable community interaction.",
    tags: "Next.js,TypeScript,TailwindCSS,Prisma,PostgreSQL",
    githubUrl: "https://github.com/example/devflow",
    demoUrl: "https://devflow-demo.vercel.app",
    imageUrl: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=600&auto=format&fit=crop",
    features: "Interactive markdown posts & comments\nUpvote/downvote and community badge algorithms\nGlobal search using Elasticsearch\nAI integration for automatic question summaries"
  },
  {
    id: "2",
    title: "CloudTask - AI-Powered Task Management",
    description: "A collaborative Kanban workspace featuring real-time updates via WebSockets, AI-assisted subtask generation, and project progress statistics.",
    tags: "React,Node.js,Express,Socket.io,MongoDB,TailwindCSS",
    githubUrl: "https://github.com/example/cloudtask",
    demoUrl: "https://cloudtask-demo.vercel.app",
    imageUrl: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=600&auto=format&fit=crop",
    features: "Drag-and-drop Kanban interface using DnD Kit\nReal-time workspace sync via WebSockets\nOpenAI GPT API integration for automatic subtask creation\nVisual charting for team productivity metrics"
  },
  {
    id: "3",
    title: "Antigravity UI - Premium Component Library",
    description: "An elegant, lightweight component library built on React, Tailwind, and Framer Motion, optimized for smooth performance and satisfying interactive micro-animations.",
    tags: "React,TailwindCSS,Framer Motion,TypeScript,Vite",
    githubUrl: "https://github.com/example/antigravity-ui",
    demoUrl: "https://antigravity-ui.vercel.app",
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
    features: "Fully customizable glassmorphic components\nHighly performant page and list transitions\nAccessibility compliance with WCAG 2.1 AA standards\nZero-config setup with Tailwind v4"
  }
];

const DEFAULT_EXPERIENCES = [
  {
    id: "1",
    company: "TechCorp Industries",
    role: "Senior Frontend Engineer",
    duration: "Jan 2024 - Present",
    description: "Lead developer on the core client dashboard. Rebuilt the legacy application using Next.js App Router, resulting in a 40% improvement in First Contentful Paint. Mentored a team of 4 junior developers and established automated component testing guidelines.",
    skills: "Next.js,TypeScript,React,TailwindCSS,Jest,Cypress"
  },
  {
    id: "2",
    company: "WebSolutions Studio",
    role: "Full Stack Developer",
    duration: "Mar 2022 - Dec 2023",
    description: "Designed and built high-performance REST and GraphQL APIs using Node.js, Express, and PostgreSQL. Integrated Stripe payment gateways and third-party auth services. Improved query performance by 25% through database index optimizations.",
    skills: "Node.js,Express,PostgreSQL,GraphQL,Docker,Redis"
  }
];

const SKILL_CATEGORIES = [
  {
    name: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5/CSS3", "Framer Motion", "Redux Toolkit"]
  },
  {
    name: "Backend & Databases",
    skills: ["Node.js", "Express.js", "Prisma ORM", "PostgreSQL", "MongoDB", "SQLite", "GraphQL", "REST APIs"]
  },
  {
    name: "DevOps & Tools",
    skills: ["Git & GitHub", "Docker", "AWS (S3/EC2)", "Vercel", "Jest/Cypress", "Postman", "CI/CD Actions"]
  }
];

export default function PortfolioHome() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [experiences, setExperiences] = useState(DEFAULT_EXPERIENCES);
  const [activeFilter, setActiveFilter] = useState("All");
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Contact Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formErrorMsg, setFormErrorMsg] = useState("");

  // Fetch Projects & Experiences
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await fetch(`${BACKEND_URL}/api/projects`);
        if (projRes.ok) {
          const projData = await projRes.json();
          if (projData.status === "success" && projData.data.length > 0) {
            setProjects(projData.data);
          }
        }
      } catch (err) {
        console.log("Could not connect to backend projects API, using local fallback data.");
      }

      try {
        const expRes = await fetch(`${BACKEND_URL}/api/experiences`);
        if (expRes.ok) {
          const expData = await expRes.json();
          if (expData.status === "success" && expData.data.length > 0) {
            setExperiences(expData.data);
          }
        }
      } catch (err) {
        console.log("Could not connect to backend experiences API, using local fallback data.");
      }
    };
    fetchData();
  }, []);

  // Compute all tags
  useEffect(() => {
    const tagsSet = new Set<string>();
    projects.forEach((proj) => {
      proj.tags.split(",").forEach((tag) => {
        tagsSet.add(tag.trim());
      });
    });
    setAllTags(Array.from(tagsSet));
  }, [projects]);

  // Filter projects by active tag
  const filteredProjects = projects.filter((proj) => {
    if (activeFilter === "All") return true;
    return proj.tags.split(",").map((t) => t.trim().toLowerCase()).includes(activeFilter.toLowerCase());
  });

  // Handle Contact Submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) {
      setFormStatus("error");
      setFormErrorMsg("Please fill in all required fields.");
      return;
    }

    setFormStatus("loading");
    setFormErrorMsg("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          subject: formSubject || null,
          message: formMessage
        })
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setFormStatus("success");
        setFormName("");
        setFormEmail("");
        setFormSubject("");
        setFormMessage("");
      } else {
        setFormStatus("error");
        setFormErrorMsg(data.message || "Failed to submit message.");
      }
    } catch (err) {
      setFormStatus("error");
      setFormErrorMsg("Unable to connect to backend server. Please try again later.");
    }
  };

  return (
    <div className="relative min-h-screen font-sans antialiased text-slate-100 flex flex-col">
      {/* Background Glow Ring */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent-purple/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent-cyan/10 blur-[150px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
        <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center font-mono font-extrabold text-sm text-white">
            A
          </span>
          <span>Ashish</span>
        </Link>

        <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-slate-300">
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <a href="#experience" className="hover:text-white transition-colors">Experience</a>
          <a href="#skills" className="hover:text-white transition-colors">Skills</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>

        <div className="flex gap-4 items-center">
          <Link
            href="/login"
            className="text-xs font-semibold px-4 py-2 rounded-full border border-white/10 hover:border-accent-purple/50 bg-white/5 hover:bg-accent-purple/10 text-slate-300 hover:text-white transition-all duration-200"
          >
            Admin Panel
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 max-w-6xl mx-auto pt-24 pb-20 flex flex-col md:flex-row items-center gap-12 flex-1 w-full animate-fade-in-up">
        <div className="flex-1 text-center md:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/30 text-xs font-semibold text-accent-purple">
            <SparklesIcon />
            <span>Available for new projects</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Hi, I&apos;m <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan">Ashish</span>
            <br />
            Full-Stack Developer
          </h1>

          <p className="text-lg text-slate-400 max-w-xl">
            I design, architect, and implement sleek digital solutions. Specializing in high-performance web applications using the Node.js backend and Next.js React ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#projects"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 border-glow"
            >
              <span>Explore My Work</span>
            </a>
            <a
              href="#contact"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Get in Touch</span>
            </a>
          </div>
        </div>

        <div className="flex-1 max-w-md w-full relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent-purple to-accent-cyan opacity-30 blur-lg group-hover:opacity-50 transition duration-1000" />
          <div className="relative glass-panel rounded-2xl p-6 border border-white/10 space-y-4 animate-float">
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="font-mono text-sm space-y-2 text-slate-300">
              <p><span className="text-pink-400">const</span> developer = &#123;</p>
              <p className="pl-4"><span className="text-indigo-300">name</span>: <span className="text-emerald-300">&quot;Ashish&quot;</span>,</p>
              <p className="pl-4"><span className="text-indigo-300">role</span>: <span className="text-emerald-300">&quot;Full-Stack Engineer&quot;</span>,</p>
              <p className="pl-4"><span className="text-indigo-300">techStack</span>: [</p>
              <p className="pl-8 text-cyan-300">&quot;Next.js&quot;, &quot;Express&quot;, &quot;Prisma&quot;,</p>
              <p className="pl-8 text-cyan-300">&quot;SQLite&quot;, &quot;Tailwind CSS&quot;</p>
              <p className="pl-4">],</p>
              <p className="pl-4"><span className="text-indigo-300">philosophy</span>: <span className="text-emerald-300">&quot;Pixel perfection & clean APIs&quot;</span></p>
              <p>&#125;;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 md:px-12 max-w-6xl mx-auto w-full border-t border-white/5">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white flex justify-center items-center gap-3">
            <CodeIcon />
            <span>Featured Projects</span>
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            A curated showcase of dynamic full-stack applications.
          </p>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2 justify-center pt-6">
            <button
              onClick={() => setActiveFilter("All")}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                activeFilter === "All"
                  ? "bg-accent-purple/20 border-accent-purple text-white shadow-lg"
                  : "bg-white/5 border-white/5 hover:border-white/20 text-slate-400 hover:text-white"
              }`}
            >
              All Projects
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  activeFilter === tag
                    ? "bg-accent-purple/20 border-accent-purple text-white shadow-lg"
                    : "bg-white/5 border-white/5 hover:border-white/20 text-slate-400 hover:text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden border border-white/10 cursor-pointer flex flex-col group/card"
            >
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 flex items-center justify-center">
                    <CodeIcon />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  {project.tags.split(",").slice(0, 2).map((tag, idx) => (
                    <span key={idx} className="bg-slate-950/80 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-accent-cyan">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover/card:text-accent-purple transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="flex gap-4 pt-2 text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5 text-accent-purple hover:underline">
                    View Details &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-6 md:px-12 max-w-6xl mx-auto w-full border-t border-white/5">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white flex justify-center items-center gap-3">
            <BriefcaseIcon />
            <span>Work Experience</span>
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            A look at my professional journey and engineering history.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="max-w-3xl mx-auto relative pl-6 border-l border-white/10 space-y-12">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative group">
              {/* Pulsing Timeline Node */}
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-accent-purple border-4 border-slate-950 group-hover:scale-125 transition-transform" />

              <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                  <div>
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <p className="text-sm font-semibold text-accent-purple">{exp.company}</p>
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-slate-400">
                    {exp.duration}
                  </span>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {exp.skills.split(",").map((skill, idx) => (
                    <span key={idx} className="bg-white/5 border border-white/5 px-2.5 py-1 rounded-md text-xs text-slate-400">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6 md:px-12 max-w-6xl mx-auto w-full border-t border-white/5">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white flex justify-center items-center gap-3">
            <SparklesIcon />
            <span>My Toolkit</span>
          </h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Technologies, frameworks, and methodologies I master.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SKILL_CATEGORIES.map((category, idx) => (
            <div key={idx} className="glass-panel rounded-2xl p-6 border border-white/10 space-y-6">
              <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:border-accent-purple/45 hover:bg-accent-purple/10 text-xs font-semibold text-slate-300 hover:text-white transition-all duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 md:px-12 max-w-6xl mx-auto w-full border-t border-white/5 flex flex-col md:flex-row gap-12">
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
            <EnvelopeIcon />
            <span>Get in Touch</span>
          </h2>
          <p className="text-slate-400 max-w-md">
            Have a project in mind, want to collaborate, or simply say hello? Send me a message, and I will get back to you shortly.
          </p>

          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-accent-purple">
                <EnvelopeIcon />
              </span>
              <span>ashish.dev.eng@example.com</span>
            </div>
          </div>
        </div>

        <div className="flex-[1.5] w-full">
          {formStatus === "success" ? (
            <div className="glass-panel rounded-2xl p-8 border border-emerald-500/20 text-center space-y-4 animate-fade-in-up">
              <ShieldCheckIcon />
              <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
              <p className="text-slate-400 max-w-sm mx-auto">
                Thank you for reaching out. Your message has been submitted successfully and stored in the database.
              </p>
              <button
                onClick={() => setFormStatus("idle")}
                className="mt-4 px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-semibold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="glass-panel rounded-2xl p-8 border border-white/10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-semibold text-slate-400">
                    Your Name <span className="text-accent-purple">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-400">
                    Email Address <span className="text-accent-purple">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-xs font-semibold text-slate-400">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="Collaborating on a project"
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs font-semibold text-slate-400">
                  Message <span className="text-accent-purple">*</span> (min 10 characters)
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Describe your request..."
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple transition-all"
                />
              </div>

              {formStatus === "error" && (
                <div className="text-red-400 text-xs font-semibold bg-red-950/20 border border-red-900/30 p-3 rounded-lg">
                  {formErrorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={formStatus === "loading"}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 border-glow"
              >
                {formStatus === "loading" ? "Sending Message..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-8 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} Ashish. All rights reserved.
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="hover:text-slate-300">
            Admin Panel Login
          </Link>
        </div>
      </footer>

      {/* Project Detail Modal Overlay */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in-up">
          <div className="relative w-full max-w-2xl bg-slate-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Image Header */}
            <div className="relative h-64 bg-slate-900">
              {selectedProject.imageUrl ? (
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 flex items-center justify-center">
                  <CodeIcon />
                </div>
              )}
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/70 border border-white/10 hover:bg-slate-900 transition-colors flex items-center justify-center text-white"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-white">
                  {selectedProject.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.tags.split(",").map((tag: string, idx: number) => (
                    <span key={idx} className="bg-accent-purple/10 border border-accent-purple/20 px-2.5 py-0.5 rounded-full text-xs font-semibold text-accent-purple">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Overview</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {selectedProject.features && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Key Features</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-300">
                    {selectedProject.features.split("\n").map((feature: string, idx: number) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-xs font-bold text-slate-200"
                  >
                    <GithubIcon />
                    <span>View GitHub Repo</span>
                  </a>
                )}
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-xs font-bold text-white shadow-lg"
                  >
                    <ExternalLinkIcon />
                    <span>Live Demonstration</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
