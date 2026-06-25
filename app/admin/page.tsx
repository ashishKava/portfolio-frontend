"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// --- SVG Icons ---
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "experiences" | "messages">("projects");

  // Data states
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // Form states
  const [projectForm, setProjectForm] = useState({
    id: "",
    title: "",
    description: "",
    tags: "",
    githubUrl: "",
    demoUrl: "",
    imageUrl: "",
    features: "",
    order: 0,
  });

  const [experienceForm, setExperienceForm] = useState({
    id: "",
    company: "",
    role: "",
    duration: "",
    description: "",
    skills: "",
    order: 0,
  });

  // Modal / Form toggle states
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isExperienceFormOpen, setIsExperienceFormOpen] = useState(false);
  
  // Feedback alerts
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Authenticate and mount
  useEffect(() => {
    const storedToken = localStorage.getItem("portfolio_admin_token");
    const storedUser = localStorage.getItem("portfolio_admin_username");

    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
      setUsername(storedUser || "Admin");
    }
  }, [router]);

  // Fetch collections when authenticated
  useEffect(() => {
    if (token) {
      fetchProjects();
      fetchExperiences();
      fetchMessages();
    }
  }, [token]);

  // Alert auto-dismissal
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // --- API Requests Helpers ---

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/projects`);
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setProjects(data.data);
      }
    } catch (err) {
      showError("Failed to fetch projects from backend.");
    }
  };

  const fetchExperiences = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/experiences`);
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setExperiences(data.data);
      }
    } catch (err) {
      showError("Failed to fetch experiences from backend.");
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setMessages(data.data);
      }
    } catch (err) {
      showError("Failed to fetch contact submissions from backend.");
    }
  };

  const showError = (msg: string) => {
    setAlert({ type: "error", message: msg });
  };

  const showSuccess = (msg: string) => {
    setAlert({ type: "success", message: msg });
  };

  const handleLogout = () => {
    localStorage.removeItem("portfolio_admin_token");
    localStorage.removeItem("portfolio_admin_username");
    localStorage.removeItem("portfolio_admin_userid");
    router.push("/");
  };

  // --- Project CRUD Operations ---

  const handleOpenProjectCreate = () => {
    setProjectForm({
      id: "",
      title: "",
      description: "",
      tags: "",
      githubUrl: "",
      demoUrl: "",
      imageUrl: "",
      features: "",
      order: projects.length + 1,
    });
    setIsProjectFormOpen(true);
  };

  const handleOpenProjectEdit = (project: any) => {
    setProjectForm({
      id: project.id,
      title: project.title,
      description: project.description,
      tags: project.tags,
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || "",
      imageUrl: project.imageUrl || "",
      features: project.features || "",
      order: project.order || 0,
    });
    setIsProjectFormOpen(true);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description || !projectForm.tags) {
      showError("Title, Description, and Tags are required fields.");
      return;
    }

    const isEdit = !!projectForm.id;
    const url = isEdit
      ? `${BACKEND_URL}/api/projects/${projectForm.id}`
      : `${BACKEND_URL}/api/projects`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...projectForm,
          order: Number(projectForm.order),
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        showSuccess(`Project ${isEdit ? "updated" : "created"} successfully!`);
        setIsProjectFormOpen(false);
        fetchProjects();
      } else {
        showError(data.message || `Failed to save project.`);
      }
    } catch (err) {
      showError("Server error while saving project.");
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        showSuccess("Project deleted successfully!");
        fetchProjects();
      } else {
        showError("Failed to delete project.");
      }
    } catch (err) {
      showError("Server error while deleting project.");
    }
  };

  // --- Experience CRUD Operations ---

  const handleOpenExperienceCreate = () => {
    setExperienceForm({
      id: "",
      company: "",
      role: "",
      duration: "",
      description: "",
      skills: "",
      order: experiences.length + 1,
    });
    setIsExperienceFormOpen(true);
  };

  const handleOpenExperienceEdit = (exp: any) => {
    setExperienceForm({
      id: exp.id,
      company: exp.company,
      role: exp.role,
      duration: exp.duration,
      description: exp.description,
      skills: exp.skills,
      order: exp.order || 0,
    });
    setIsExperienceFormOpen(true);
  };

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experienceForm.company || !experienceForm.role || !experienceForm.duration || !experienceForm.description || !experienceForm.skills) {
      showError("All fields are required to submit experience.");
      return;
    }

    const isEdit = !!experienceForm.id;
    const url = isEdit
      ? `${BACKEND_URL}/api/experiences/${experienceForm.id}`
      : `${BACKEND_URL}/api/experiences`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...experienceForm,
          order: Number(experienceForm.order),
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        showSuccess(`Experience ${isEdit ? "updated" : "created"} successfully!`);
        setIsExperienceFormOpen(false);
        fetchExperiences();
      } else {
        showError(data.message || `Failed to save experience.`);
      }
    } catch (err) {
      showError("Server error while saving experience.");
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this experience record?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/experiences/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        showSuccess("Experience deleted successfully!");
        fetchExperiences();
      } else {
        showError("Failed to delete experience.");
      }
    } catch (err) {
      showError("Server error while deleting experience.");
    }
  };

  // --- Message Actions ---

  const handleToggleMessageRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/contacts/${id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ read: !currentRead }),
      });

      if (res.ok) {
        showSuccess("Message status updated.");
        fetchMessages();
      } else {
        showError("Failed to update status.");
      }
    } catch (err) {
      showError("Server error updating read status.");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm("Delete this contact message permanently?")) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        showSuccess("Message deleted permanently.");
        fetchMessages();
      } else {
        showError("Failed to delete message.");
      }
    } catch (err) {
      showError("Server error while deleting message.");
    }
  };

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 font-mono text-sm text-slate-500">
        Verifying Session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent-purple to-accent-cyan flex items-center justify-center font-mono font-extrabold text-sm text-white">
              A
            </span>
            <span>Dashboard</span>
          </Link>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
            Welcome, {username}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 transition-colors"
          >
            Live Site
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-red-950/20 border border-red-900/30 text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto p-6 md:py-10 flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-48 flex md:flex-col gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === "projects"
                ? "bg-accent-purple/20 border border-accent-purple/50 text-white"
                : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("experiences")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === "experiences"
                ? "bg-accent-purple/20 border border-accent-purple/50 text-white"
                : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative ${
              activeTab === "messages"
                ? "bg-accent-purple/20 border border-accent-purple/50 text-white"
                : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
            }`}
          >
            <span>Messages</span>
            {messages.filter((m) => !m.read).length > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
        </aside>

        {/* Workspace Panels */}
        <main className="flex-1 space-y-6">
          {/* Action Alerts */}
          {alert && (
            <div
              className={`p-4 rounded-xl border text-sm font-semibold transition-all ${
                alert.type === "success"
                  ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-400"
                  : "bg-red-950/20 border-red-900/30 text-red-400"
              }`}
            >
              {alert.message}
            </div>
          )}

          {/* 1. Projects tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Manage Projects</h2>
                  <p className="text-xs text-slate-400">Add, edit, or delete items shown in your portfolio.</p>
                </div>
                <button
                  onClick={handleOpenProjectCreate}
                  className="px-3 py-2 bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 rounded-xl text-xs font-semibold flex items-center gap-1.5 border-glow text-white"
                >
                  <PlusIcon />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="grid grid-cols-1 gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="glass-panel rounded-2xl p-5 border border-white/10 flex justify-between items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">{project.title}</h3>
                        <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                          Order: {project.order}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 max-w-xl">{project.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenProjectEdit(project)}
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-slate-300 rounded-xl transition-all"
                        title="Edit Project"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 bg-red-950/20 hover:bg-red-900/30 border border-red-900/30 text-red-300 rounded-xl transition-all"
                        title="Delete Project"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}

                {projects.length === 0 && (
                  <div className="text-center py-12 text-sm text-slate-500 font-medium">
                    No projects found in database. Create one above!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Experiences Tab */}
          {activeTab === "experiences" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Manage Work Experience</h2>
                  <p className="text-xs text-slate-400">Add, edit, or delete corporate milestones.</p>
                </div>
                <button
                  onClick={handleOpenExperienceCreate}
                  className="px-3 py-2 bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 rounded-xl text-xs font-semibold flex items-center gap-1.5 border-glow text-white"
                >
                  <PlusIcon />
                  <span>Add Experience</span>
                </button>
              </div>

              {/* Experiences List */}
              <div className="grid grid-cols-1 gap-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="glass-panel rounded-2xl p-5 border border-white/10 flex justify-between items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">{exp.role}</h3>
                        <span className="text-xs font-bold text-accent-purple">{exp.company}</span>
                        <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                          Order: {exp.order}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 max-w-xl">{exp.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenExperienceEdit(exp)}
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-slate-300 rounded-xl transition-all"
                        title="Edit Experience"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="p-2 bg-red-950/20 hover:bg-red-900/30 border border-red-900/30 text-red-300 rounded-xl transition-all"
                        title="Delete Experience"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}

                {experiences.length === 0 && (
                  <div className="text-center py-12 text-sm text-slate-500 font-medium">
                    No work experiences seeded. Add one above!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Messages Tab */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-xl font-bold text-white">Contact Submissions</h2>
                <p className="text-xs text-slate-400">Read messages sent through the main site contact form.</p>
              </div>

              {/* Messages Listing */}
              <div className="grid grid-cols-1 gap-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`glass-panel rounded-2xl p-5 border flex flex-col gap-3 transition-colors ${
                      message.read ? "border-white/10 opacity-70" : "border-accent-purple/35 bg-accent-purple/5"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">{message.name}</span>
                          <span className="text-xs text-slate-400">({message.email})</span>
                          {!message.read && (
                            <span className="bg-red-500/20 border border-red-500/30 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-300">
                          Subject: {message.subject || "No Subject Specified"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleMessageRead(message.id, message.read)}
                          className={`p-2 border rounded-xl transition-all ${
                            message.read
                              ? "bg-white/5 border-white/5 hover:bg-white/10 text-slate-300"
                              : "bg-accent-purple/20 border-accent-purple/30 text-accent-purple hover:bg-accent-purple/30"
                          }`}
                          title={message.read ? "Mark as Unread" : "Mark as Read"}
                        >
                          <EyeIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(message.id)}
                          className="p-2 bg-red-950/20 hover:bg-red-900/30 border border-red-900/30 text-red-300 rounded-xl transition-all"
                          title="Delete Message"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-950/40 p-3 rounded-lg border border-white/5">
                      {message.message}
                    </p>

                    <div className="text-[10px] text-slate-500">
                      Received at: {new Date(message.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div className="text-center py-12 text-sm text-slate-500 font-medium">
                    No contact submissions recorded. Use the website form to send one!
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Project Form Modal Overlay */}
      {isProjectFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-xl font-bold text-white">
                {projectForm.id ? "Edit Showcase Project" : "Add Showcase Project"}
              </h3>
              <p className="text-xs text-slate-400">Fill in the fields to configure the project card and detail modal.</p>
            </div>

            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="p_title" className="text-xs font-semibold text-slate-400">Project Title *</label>
                  <input
                    id="p_title"
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="p_order" className="text-xs font-semibold text-slate-400">Order Position</label>
                  <input
                    id="p_order"
                    type="number"
                    value={projectForm.order}
                    onChange={(e) => setProjectForm({ ...projectForm, order: Number(e.target.value) })}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="p_desc" className="text-xs font-semibold text-slate-400">Summary Description *</label>
                <textarea
                  id="p_desc"
                  required
                  rows={2}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="p_tags" className="text-xs font-semibold text-slate-400">Tags * (comma-separated, e.g., React,Node,Express)</label>
                <input
                  id="p_tags"
                  type="text"
                  required
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                  placeholder="React,Next.js,TypeScript"
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="p_github" className="text-xs font-semibold text-slate-400">GitHub Repository URL</label>
                  <input
                    id="p_github"
                    type="url"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="p_demo" className="text-xs font-semibold text-slate-400">Live Demonstration URL</label>
                  <input
                    id="p_demo"
                    type="url"
                    value={projectForm.demoUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="p_image" className="text-xs font-semibold text-slate-400">Showcase Image URL</label>
                <input
                  id="p_image"
                  type="url"
                  value={projectForm.imageUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="p_feats" className="text-xs font-semibold text-slate-400">Key Features List (separated by newlines)</label>
                <textarea
                  id="p_feats"
                  rows={3}
                  value={projectForm.features}
                  onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })}
                  placeholder="Interactive drag and drop dashboard&#10;Robust JSON web tokens authentication&#10;Highly optimized SQL schema queries"
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsProjectFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-blue rounded-xl text-xs font-semibold text-white"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experience Form Modal Overlay */}
      {isExperienceFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-xl font-bold text-white">
                {experienceForm.id ? "Edit Work Experience" : "Add Work Experience"}
              </h3>
              <p className="text-xs text-slate-400">Configure employment milestones for the resume timeline.</p>
            </div>

            <form onSubmit={handleExperienceSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="e_company" className="text-xs font-semibold text-slate-400">Company Name *</label>
                  <input
                    id="e_company"
                    type="text"
                    required
                    value={experienceForm.company}
                    onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="e_role" className="text-xs font-semibold text-slate-400">Role / Position *</label>
                  <input
                    id="e_role"
                    type="text"
                    required
                    value={experienceForm.role}
                    onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="e_duration" className="text-xs font-semibold text-slate-400">Duration * (e.g. Jan 2024 - Present)</label>
                  <input
                    id="e_duration"
                    type="text"
                    required
                    value={experienceForm.duration}
                    onChange={(e) => setExperienceForm({ ...experienceForm, duration: e.target.value })}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="e_order" className="text-xs font-semibold text-slate-400">Order Position</label>
                  <input
                    id="e_order"
                    type="number"
                    value={experienceForm.order}
                    onChange={(e) => setExperienceForm({ ...experienceForm, order: Number(e.target.value) })}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="e_desc" className="text-xs font-semibold text-slate-400">Description of Achievements *</label>
                <textarea
                  id="e_desc"
                  required
                  rows={4}
                  value={experienceForm.description}
                  onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                  placeholder="Developed APIs, reduced build times, etc..."
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="e_skills" className="text-xs font-semibold text-slate-400">Skills list * (comma-separated, e.g. Node,Docker,Git)</label>
                <input
                  id="e_skills"
                  type="text"
                  required
                  value={experienceForm.skills}
                  onChange={(e) => setExperienceForm({ ...experienceForm, skills: e.target.value })}
                  placeholder="TypeScript,React,GraphQL,Docker"
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-accent-purple"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsExperienceFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-blue rounded-xl text-xs font-semibold text-white"
                >
                  Save Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
