"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "./config";
import { api, Project, Experience } from "./api";

interface PortfolioClientProps {
  initialProjects: Project[];
  initialExperiences: Experience[];
}

export default function PortfolioClient({ initialProjects, initialExperiences }: PortfolioClientProps) {
  // Theme state
  const [isDark, setIsDark] = useState(true);

  // Active navigation section
  const [activeSection, setActiveSection] = useState("hero");

  // Project filter tags
  const [filterTag, setFilterTag] = useState("All");

  // Mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Selected project for details modal
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Hero Cube Interactivity
  const [cubeRotation, setCubeRotation] = useState({ x: -15, y: 45 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Contact form state
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  // 1. Mouse move tracking for Global Background Spotlight Glow
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  // 2. Scroll tracking for Nav highlight
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "experience", "projects", "contact"];
      const scrollPos = window.scrollY + 120;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 3. Set Dark/Light theme class on document HTML
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      setContactStatus({ type: "error", message: "Please fill out all required fields." });
      return;
    }

    setContactStatus({ type: "loading", message: "Sending your message..." });
    try {
      const res = await api.submitContact(formState);
      if (res.status === "success") {
        setContactStatus({ type: "success", message: "Thank you! Your message was sent successfully." });
        setFormState({ name: "", email: "", subject: "", message: "" });
      } else {
        setContactStatus({ type: "error", message: res.message || "Something went wrong. Please try again." });
      }
    } catch (err) {
      setContactStatus({ type: "error", message: "Failed to connect to backend server. Please email directly." });
    }
  };

  // Interactive Drag for 3D Hero Widget
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setCubeRotation((prev) => ({
      x: prev.x - deltaY * 0.5,
      y: prev.y + deltaX * 0.5,
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Mouse move handler for Card Spotlight Glow
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--card-mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--card-mouse-y", `${y}px`);
  };

  // Get project tags list for filtering
  const allTags = ["All", ...new Set(initialProjects.flatMap((p) => p.tags.split(",")))];

  // Filtered projects
  const filteredProjects = filterTag === "All"
    ? initialProjects
    : initialProjects.filter((p) => p.tags.split(",").includes(filterTag));

  return (
    <div className="min-h-screen bg-bg-custom text-fg-custom selection:bg-accent-custom selection:text-white transition-colors duration-200 bg-grid-overlay relative">
      
      {/* Dynamic Cursor Spotlight background aura */}
      <div className="spotlight-bg"></div>

      {/* HEADER / NAVIGATION */}
      <header className="fixed top-0 left-0 w-full z-40 bg-bg-custom/80 backdrop-blur-md border-b border-border-custom transition-all duration-300">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#hero" className="text-sm font-bold tracking-widest text-primary-custom flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-primary-custom text-primary-fg flex items-center justify-center font-extrabold text-xs">AK</span>
            ASHISH KAVA
          </a>

          {/* Desktop Nav Links with sliding indicator */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider">
            {["Hero", "About", "Experience", "Projects", "Contact"].map((sec) => {
              const id = sec.toLowerCase();
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`nav-link pb-1 transition-colors duration-200 hover:text-accent-custom ${
                    activeSection === id ? "active text-accent-custom font-bold" : "text-muted-fg"
                  }`}
                >
                  {sec}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded border border-border-custom hover:bg-muted-custom transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Quick Admin Dashboard Link (hidden on tiny screens, shown on sm and up) */}
            <a
              href="/admin"
              className="hidden sm:inline-block px-3 py-1.5 text-3xs uppercase tracking-widest font-bold rounded border border-border-custom text-muted-fg hover:text-primary-custom hover:border-primary-custom transition-all duration-200"
            >
              Admin
            </a>

            {/* Hamburger menu icon toggle button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded border border-border-custom hover:bg-muted-custom transition-colors cursor-pointer text-muted-fg hover:text-primary-custom"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border-custom bg-bg-custom/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4">
            {["Hero", "About", "Experience", "Projects", "Contact"].map((sec) => {
              const id = sec.toLowerCase();
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
                    activeSection === id ? "text-accent-custom" : "text-muted-fg hover:text-primary-custom"
                  }`}
                >
                  {sec}
                </a>
              );
            })}
            <a
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs uppercase tracking-widest font-bold rounded border border-border-custom text-muted-fg hover:text-primary-custom hover:border-primary-custom transition-all"
            >
              Admin Portal
            </a>
          </div>
        )}
      </header>

      {/* HERO SECTION WITH 3D INTERACTIVE CARD */}
      <section id="hero" className="pt-32 pb-24 px-6 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 min-h-[90vh] relative z-10">
        <div className="flex-1 max-w-2xl space-y-6 text-center md:text-left">
          <p className="text-xs uppercase tracking-widest font-mono text-accent-custom">
            Software Engineer / Full-Stack Developer
          </p>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-primary-custom leading-none">
            {CONFIG.name}.
          </h1>

          <p className="text-lg leading-relaxed text-muted-fg font-normal">
            I design and build stable backend architectures, optimize API query speeds, and assemble responsive user interfaces. Based in {CONFIG.location}, I specialize in Node.js, Express, React, PostgreSQL, and AWS solutions.
          </p>

          <div className="flex items-center justify-center md:justify-start gap-4 pt-4">
            <a
              href="#contact"
              className="shine-btn px-6 py-2.5 text-xs uppercase tracking-wider font-bold rounded bg-primary-custom text-primary-fg hover:bg-accent-custom hover:text-white transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Contact Me
            </a>
            <a
              href="#projects"
              className="px-6 py-2.5 text-xs uppercase tracking-wider font-bold rounded border border-border-custom hover:bg-muted-custom transition-all duration-200"
            >
              View Projects
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center md:justify-start gap-5 pt-8">
            <a href={CONFIG.github} target="_blank" rel="noreferrer" className="text-muted-fg hover:text-primary-custom transition-colors transform hover:scale-115">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
            </a>
            <a href={CONFIG.linkedin} target="_blank" rel="noreferrer" className="text-muted-fg hover:text-primary-custom transition-colors transform hover:scale-115">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>
            <a href={`mailto:${CONFIG.email}`} className="text-muted-fg hover:text-primary-custom transition-colors transform hover:scale-115">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </a>
          </div>
        </div>

        {/* 3D INTERACTIVE HERO COMPONENT (ROTATABLE BOARD) */}
        <div className="flex-1 flex justify-center perspective-1000">
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            style={{
              transform: `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg)`,
              cursor: isDragging ? "grabbing" : "grab",
            }}
            className="w-64 h-64 sm:w-72 sm:h-72 preserve-3d border border-border-custom bg-muted-custom rounded-2xl flex flex-col justify-center items-center shadow-2xl relative transition-transform duration-100 ease-out select-none"
          >
            {/* Front facing face */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center preserve-3d">
              <span className="text-8xl font-black tracking-tighter text-primary-custom select-none transform translateZ(30px)">
                AK
              </span>
              <p className="font-bold text-xs uppercase tracking-widest text-accent-custom mt-2 transform translateZ(20px)">
                Software Engineer
              </p>
              <div className="w-12 h-1 bg-gradient-to-r from-accent-custom to-blue-300 rounded mt-4 transform translateZ(10px)"></div>
              <p className="text-[10px] text-muted-fg mt-6 font-mono transform translateZ(5px)">
                [ drag to rotate board ]
              </p>
            </div>

            {/* Subtle rotating helper orbit ring */}
            <div className="absolute w-80 h-80 border border-dashed border-border-custom/50 rounded-full -z-10 pointer-events-none transform rotateX(75deg)"></div>
          </div>
        </div>
      </section>

      {/* ABOUT & SKILLS */}
      <section id="about" className="py-24 px-6 max-w-5xl mx-auto border-t border-border-custom relative z-10">
        <div className="grid md:grid-cols-3 gap-16">
          <div className="md:col-span-1 space-y-6">
            <h2 className="text-xs uppercase tracking-widest font-mono text-accent-custom font-bold">About</h2>
            <h3 className="text-3xl font-extrabold text-primary-custom leading-tight">My Engineering Focus</h3>
            <p className="text-sm text-muted-fg leading-relaxed">
              I am a results-oriented developer specializing in web technologies. I structure high-capacity database queries, establish secure authentication systems, and optimize frontend assets for seamless loading speeds.
            </p>
            <div className="pt-4 border-t border-border-custom space-y-2 text-xs">
              <p className="text-muted-fg"><strong>Degree:</strong> {CONFIG.education.degree}</p>
              <p className="text-muted-fg"><strong>Institution:</strong> {CONFIG.education.institution}</p>
              <p className="text-muted-fg"><strong>Training:</strong> AWS - Generative AI Essentials</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-8">
            <h2 className="text-xs uppercase tracking-widest font-mono text-accent-custom font-bold">Technical Stack</h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { title: "Frontend Development", items: CONFIG.skills.frontend },
                { title: "Backend Engineering", items: CONFIG.skills.backend },
                { title: "Database Systems", items: CONFIG.skills.databases },
                { title: "Tools & DevOps", items: CONFIG.skills.tools },
              ].map((category, idx) => (
                <div key={idx} className="p-6 bg-muted-custom border border-border-custom rounded-lg space-y-3 transition-transform duration-350 hover:-translate-y-1 hover:border-accent-custom hover:shadow-md">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-primary-custom">
                    {category.title}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {category.items.map((s) => (
                      <span key={s} className="px-2 py-0.5 text-2xs font-bold border border-border-custom rounded bg-bg-custom text-muted-fg transition-all duration-200 hover:rotate-3 hover:text-accent-custom hover:border-accent-custom">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE TIMELINE */}
      <section id="experience" className="py-24 px-6 max-w-5xl mx-auto border-t border-border-custom relative z-10">
        <div className="grid md:grid-cols-3 gap-16">
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-xs uppercase tracking-widest font-mono text-accent-custom font-bold">Experience</h2>
            <h3 className="text-3xl font-extrabold text-primary-custom leading-tight">Career Journey</h3>
            <p className="text-sm text-muted-fg leading-relaxed">
              Professional software engineer timeline showcasing previous contracts, developer environments, and core contributions.
            </p>
          </div>

          <div className="md:col-span-2 relative border-l border-border-custom ml-4 space-y-12">
            {initialExperiences.map((exp, idx) => (
              <div key={exp.id || idx} className="relative pl-8 group">
                {/* Timeline Square Dot with rotating outline border */}
                <div className="absolute -left-[4.5px] top-2.5 w-2 h-2 bg-border-custom border border-bg-custom rounded transition-all duration-350 group-hover:bg-accent-custom group-hover:scale-125 group-hover:rotate-45"></div>
                
                <div className="space-y-3 transition-transform duration-300 group-hover:translate-x-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="text-base font-bold text-primary-custom transition-colors duration-200 group-hover:text-accent-custom">{exp.role}</h4>
                      <p className="text-xs font-semibold text-accent-custom">{exp.company}</p>
                    </div>
                    <span className="text-2xs font-mono font-bold text-muted-fg self-start sm:self-center uppercase tracking-wider">
                      {exp.duration}
                    </span>
                  </div>

                  <p className="text-xs text-muted-fg leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {exp.skills.split(",").map((sk) => (
                      <span key={sk} className="px-2 py-0.5 text-3xs font-mono font-bold rounded bg-muted-custom text-muted-fg border border-border-custom transition-all hover:bg-bg-custom hover:border-accent-custom">
                        {sk.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS PORTFOLIO (WITH SPOTLIGHT GLOW TILES) */}
      <section id="projects" className="py-24 px-6 max-w-5xl mx-auto border-t border-border-custom relative z-10">
        <div className="space-y-8 mb-12">
          <div className="space-y-2">
            <h2 className="text-xs uppercase tracking-widest font-mono text-accent-custom font-bold">Showcase</h2>
            <h3 className="text-3xl font-extrabold text-primary-custom tracking-tight font-sans">Key Projects</h3>
          </div>

          {/* Project Tag Filters */}
          <div className="flex flex-wrap gap-1.5">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 text-2xs uppercase tracking-wider font-bold border rounded transition-colors duration-150 ${
                  filterTag === tag
                    ? "bg-primary-custom border-primary-custom text-primary-fg"
                    : "border-border-custom text-muted-fg hover:bg-muted-custom hover:text-primary-custom"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid with 3D Perspective */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              onMouseMove={handleCardMouseMove}
              className="tilt-card spotlight-card preserve-3d p-6 flex flex-col justify-between cursor-pointer"
              onClick={() => setSelectedProject(proj)}
            >
              <div className="space-y-4 preserve-3d relative z-10">
                <div className="flex items-center justify-between border-b border-border-custom/50 pb-3 transform translateZ(15px)">
                  <h4 className="text-sm font-bold text-primary-custom line-clamp-1">{proj.title}</h4>
                  <svg className="w-3.5 h-3.5 text-muted-fg transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
                <p className="text-xs text-muted-fg line-clamp-3 leading-relaxed transform translateZ(10px)">
                  {proj.description}
                </p>
              </div>

              <div className="space-y-3 pt-6 transform translateZ(5px) relative z-10">
                <div className="flex flex-wrap gap-1">
                  {proj.tags.split(",").slice(0, 3).map((tg) => (
                    <span key={tg} className="px-1.5 py-0.5 text-3xs font-mono font-semibold rounded bg-bg-custom text-muted-fg border border-border-custom">
                      {tg.trim()}
                    </span>
                  ))}
                  {proj.tags.split(",").length > 3 && (
                    <span className="px-1.5 py-0.5 text-3xs font-mono font-semibold text-accent-custom">
                      +{proj.tags.split(",").length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECT DETAILS MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto bg-bg-custom border border-border-custom rounded-lg shadow-2xl p-6 md:p-8 animate-scale-up">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-1.5 rounded border border-border-custom hover:bg-muted-custom text-muted-fg hover:text-primary-custom transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="space-y-6">
              <div>
                <span className="text-2xs uppercase tracking-widest font-mono text-accent-custom">Project Profile</span>
                <h3 className="text-2xl font-extrabold text-primary-custom mt-1">{selectedProject.title}</h3>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-bold text-primary-custom">Overview</h4>
                <p className="text-xs leading-relaxed text-muted-fg">
                  {selectedProject.description}
                </p>
              </div>

              {selectedProject.features && (
                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-wider font-bold text-primary-custom">Core Contributions & Features</h4>
                  <ul className="list-disc pl-4 space-y-1.5 text-xs text-muted-fg leading-relaxed">
                    {selectedProject.features.split("\n").map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs uppercase tracking-wider font-bold text-primary-custom">Technology Stack</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedProject.tags.split(",").map((tg) => (
                    <span key={tg} className="px-2 py-0.5 text-2xs font-mono font-bold rounded bg-muted-custom text-muted-fg border border-border-custom">
                      {tg.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-border-custom">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2 text-xs uppercase tracking-wider font-bold rounded border border-border-custom hover:bg-muted-custom transition-all"
                  >
                    Repository Link
                  </a>
                )}
                {selectedProject.demoUrl && (
                  <a
                    href={selectedProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2 text-xs uppercase tracking-wider font-bold rounded bg-accent-custom text-white hover:bg-blue-600 transition-all"
                  >
                    View Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT FORM */}
      <section id="contact" className="py-24 px-6 max-w-5xl mx-auto border-t border-border-custom relative z-10">
        <div className="grid md:grid-cols-3 gap-16">
          <div className="md:col-span-1 space-y-6">
            <h2 className="text-xs uppercase tracking-widest font-mono text-accent-custom font-bold">Contact</h2>
            <h3 className="text-3xl font-extrabold text-primary-custom leading-tight">Get In Touch</h3>
            <p className="text-sm text-muted-fg leading-relaxed">
              If you have a professional role, freelance query, or collaboration outline, feel free to submit the form.
            </p>
            <div className="space-y-4 pt-4 border-t border-border-custom text-xs">
              <p className="text-muted-fg"><strong>Email:</strong> {CONFIG.email}</p>
              <p className="text-muted-fg"><strong>Phone:</strong> {CONFIG.phone}</p>
              <p className="text-muted-fg"><strong>Location:</strong> {CONFIG.location}</p>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="md:col-span-2 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-3xs uppercase tracking-widest font-bold text-muted-fg">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded border border-border-custom bg-transparent outline-none focus:border-accent-custom focus:ring-1 focus:ring-accent-custom transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-3xs uppercase tracking-widest font-bold text-muted-fg">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs rounded border border-border-custom bg-transparent outline-none focus:border-accent-custom focus:ring-1 focus:ring-accent-custom transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-3xs uppercase tracking-widest font-bold text-muted-fg">Subject</label>
              <input
                type="text"
                placeholder="Collaboration Outline"
                value={formState.subject}
                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded border border-border-custom bg-transparent outline-none focus:border-accent-custom focus:ring-1 focus:ring-accent-custom transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-3xs uppercase tracking-widest font-bold text-muted-fg">Message *</label>
              <textarea
                required
                rows={4}
                placeholder="Please describe the opportunity or outline..."
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full px-4 py-2.5 text-xs rounded border border-border-custom bg-transparent outline-none focus:border-accent-custom focus:ring-1 focus:ring-accent-custom transition-all resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={contactStatus.type === "loading"}
              className="shine-btn w-full py-2.5 text-xs uppercase tracking-widest font-bold rounded bg-primary-custom text-primary-fg disabled:opacity-50 hover:bg-accent-custom hover:text-white transition-all cursor-pointer shadow-md hover:shadow-lg"
            >
              {contactStatus.type === "loading" ? "Submitting..." : "Submit Inquiry"}
            </button>

            {/* Status alerts */}
            {contactStatus.type !== "idle" && (
              <div className={`p-3 rounded text-xs font-semibold ${
                contactStatus.type === "success" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                contactStatus.type === "error" ? "bg-red-500/10 text-red-600 dark:text-red-400" : "text-primary-custom bg-muted-custom"
              }`}>
                {contactStatus.message}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-border-custom bg-muted-custom text-center text-2xs text-muted-fg space-y-2 relative z-10">
        <p>&copy; {new Date().getFullYear()} {CONFIG.name}. All Rights Reserved.</p>
        <p className="uppercase tracking-widest font-mono text-3xs">Engineered with Next.js SSR & Node.js/SQLite</p>
      </footer>
    </div>
  );
}
