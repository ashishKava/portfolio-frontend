"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, Project, Experience, ContactSubmission } from "../../api";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"projects" | "experience" | "messages">("projects");
  const [loading, setLoading] = useState(true);

  // Database list states
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);

  // Editing/Creating Project Form State
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    tags: "",
    githubUrl: "",
    demoUrl: "",
    imageUrl: "",
    features: "",
    order: 0,
  });

  // Editing/Creating Experience Form State
  const [isExpFormOpen, setIsExpFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [expForm, setExpForm] = useState({
    company: "",
    role: "",
    duration: "",
    description: "",
    skills: "",
    order: 0,
  });

  // Global UI notifications
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // 1. Authenticate & Fetch data on load
  useEffect(() => {
    const initDashboard = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin");
        return;
      }

      const isValid = await api.verifyToken();
      if (!isValid) {
        localStorage.removeItem("token");
        router.push("/admin");
        return;
      }

      try {
        const [projData, expData, msgData] = await Promise.all([
          api.getProjects(),
          api.getExperiences(),
          api.getContactSubmissions(),
        ]);
        setProjects(projData);
        setExperiences(expData);
        setSubmissions(msgData);
      } catch (err) {
        showGlobalAlert("error", "Error loading database collections. Is Express server online?");
      } finally {
        setLoading(false);
      }
    };
    initDashboard();
  }, [router]);

  const showGlobalAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin");
  };

  // --- PROJECT ACTIONS ---
  const handleOpenProjectCreate = () => {
    setEditingProject(null);
    setProjectForm({
      title: "",
      description: "",
      tags: "",
      githubUrl: "",
      demoUrl: "",
      imageUrl: "",
      features: "",
      order: 0,
    });
    setIsProjectFormOpen(true);
  };

  const handleOpenProjectEdit = (proj: Project) => {
    setEditingProject(proj);
    setProjectForm({
      title: proj.title,
      description: proj.description,
      tags: proj.tags,
      githubUrl: proj.githubUrl || "",
      demoUrl: proj.demoUrl || "",
      imageUrl: proj.imageUrl || "",
      features: proj.features || "",
      order: proj.order,
    });
    setIsProjectFormOpen(true);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        const updated = await api.updateProject(editingProject.id, projectForm);
        setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? updated : p)));
        showGlobalAlert("success", "Project updated successfully!");
      } else {
        const created = await api.createProject(projectForm);
        setProjects((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        showGlobalAlert("success", "Project created successfully!");
      }
      setIsProjectFormOpen(false);
    } catch (err: any) {
      showGlobalAlert("error", err.message || "Failed to save project.");
    }
  };

  const handleProjectDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await api.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showGlobalAlert("success", "Project deleted successfully.");
    } catch (err: any) {
      showGlobalAlert("error", "Failed to delete project.");
    }
  };

  // --- EXPERIENCE ACTIONS ---
  const handleOpenExpCreate = () => {
    setEditingExperience(null);
    setExpForm({
      company: "",
      role: "",
      duration: "",
      description: "",
      skills: "",
      order: 0,
    });
    setIsExpFormOpen(true);
  };

  const handleOpenExpEdit = (exp: Experience) => {
    setEditingExperience(exp);
    setExpForm({
      company: exp.company,
      role: exp.role,
      duration: exp.duration,
      description: exp.description,
      skills: exp.skills,
      order: exp.order,
    });
    setIsExpFormOpen(true);
  };

  const handleExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExperience) {
        const updated = await api.updateExperience(editingExperience.id, expForm);
        setExperiences((prev) => prev.map((x) => (x.id === editingExperience.id ? updated : x)));
        showGlobalAlert("success", "Experience item updated successfully!");
      } else {
        const created = await api.createExperience(expForm);
        setExperiences((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        showGlobalAlert("success", "Experience item created successfully!");
      }
      setIsExpFormOpen(false);
    } catch (err: any) {
      showGlobalAlert("error", err.message || "Failed to save experience.");
    }
  };

  const handleExpDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience record?")) return;
    try {
      await api.deleteExperience(id);
      setExperiences((prev) => prev.filter((x) => x.id !== id));
      showGlobalAlert("success", "Experience record deleted.");
    } catch (err) {
      showGlobalAlert("error", "Failed to delete experience.");
    }
  };

  // --- INBOX MESSAGE ACTIONS ---
  const handleToggleMessageRead = async (id: string, currentRead: boolean) => {
    try {
      const updated = await api.toggleContactRead(id, !currentRead);
      setSubmissions((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err) {
      showGlobalAlert("error", "Failed to update read status.");
    }
  };

  const handleMessageDelete = async (id: string) => {
    if (!confirm("Delete this contact message permanently?")) return;
    try {
      await api.deleteContactSubmission(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      showGlobalAlert("success", "Message deleted successfully.");
    } catch (err) {
      showGlobalAlert("error", "Failed to delete message.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 mb-4"></div>
        <p className="text-sm text-slate-400 font-medium">Verifying Credentials & Initializing Studio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold text-xs">
              AK
            </div>
            <div className="leading-none">
              <h2 className="text-sm font-extrabold text-white">Dashboard</h2>
              <span className="text-3xs text-slate-400 uppercase font-mono">Ashish Kava</span>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { id: "projects", label: "Manage Projects", icon: "🚀" },
              { id: "experience", label: "Manage Experience", icon: "💼" },
              { id: "messages", label: "Inbox Messages", badge: submissions.filter((s) => !s.read).length, icon: "✉️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span>{tab.icon}</span>
                  {tab.label}
                </span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="px-2 py-0.5 text-2xs font-extrabold rounded-full bg-red-500 text-white animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <a
            href="/"
            className="w-full text-center py-2.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 text-xs font-bold block transition-colors"
          >
            Visit Portfolio
          </a>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-red-600/10 hover:bg-red-600 border border-red-500/20 text-red-400 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            Logout Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 p-8 md:p-10 relative overflow-y-auto max-h-screen">
        {/* Floating alerts */}
        {alert && (
          <div className={`fixed top-6 right-6 p-4 rounded-xl shadow-lg z-50 text-xs font-semibold border ${
            alert.type === "success" ? "bg-emerald-950 border-emerald-500/30 text-emerald-400" : "bg-red-950 border-red-500/30 text-red-400"
          }`}>
            {alert.message}
          </div>
        )}

        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-900">
          <div>
            <h1 className="text-2xl font-extrabold text-white capitalize tracking-tight">{activeTab} Manager</h1>
            <p className="text-xs text-slate-400">View and dynamically edit Ashish Kava's database records</p>
          </div>

          {activeTab === "projects" && (
            <button
              onClick={handleOpenProjectCreate}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              + Create New Project
            </button>
          )}

          {activeTab === "experience" && (
            <button
              onClick={handleOpenExpCreate}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              + Add Experience Record
            </button>
          )}
        </div>

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div key={proj.id} className="p-5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-3xs font-mono px-2 py-0.5 rounded bg-slate-950 text-indigo-400 border border-slate-800">
                      Order: {proj.order}
                    </span>
                    <span className="text-3xs text-slate-500">{proj.tags.split(",").length} Tags</span>
                  </div>
                  <h3 className="font-extrabold text-white text-md">{proj.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{proj.description}</p>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-800/60">
                  <button
                    onClick={() => handleOpenProjectEdit(proj)}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-2xs font-bold rounded-lg transition-colors"
                  >
                    Edit Form
                  </button>
                  <button
                    onClick={() => handleProjectDelete(proj.id)}
                    className="px-3 py-1.5 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 hover:border-transparent text-2xs font-bold rounded-lg transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === "experience" && (
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-extrabold text-white text-md">{exp.role}</h3>
                    <span className="text-xs text-indigo-400 font-semibold">{exp.company}</span>
                    <span className="text-3xs font-mono px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded">
                      Order: {exp.order}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">{exp.duration}</p>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{exp.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {exp.skills.split(",").map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-500 rounded text-3xs">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleOpenExpEdit(exp)}
                    className="flex-1 sm:w-28 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-2xs font-bold rounded-lg transition-colors"
                  >
                    Edit Form
                  </button>
                  <button
                    onClick={() => handleExpDelete(exp.id)}
                    className="px-3 py-1.5 bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 hover:border-transparent text-2xs font-bold rounded-lg transition-all"
                  >
                    Delete Record
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INBOX MESSAGES TAB */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            {submissions.length > 0 ? (
              submissions.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-6 border rounded-xl relative overflow-hidden transition-all ${
                    msg.read ? "bg-slate-900/40 border-slate-800/80" : "bg-slate-900 border-indigo-500/30 shadow-md shadow-indigo-500/2"
                  }`}
                >
                  {!msg.read && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                  )}

                  <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h4 className="font-extrabold text-white text-md">{msg.name}</h4>
                        <span className="text-3xs text-slate-500 font-mono">
                          {new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-400 font-semibold">{msg.email}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleMessageRead(msg.id, msg.read)}
                        className={`px-3.5 py-1.5 rounded-lg text-2xs font-bold transition-all border ${
                          msg.read
                            ? "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                            : "bg-indigo-600/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white"
                        }`}
                      >
                        {msg.read ? "Mark as Unread" : "Mark as Read"}
                      </button>
                      <button
                        onClick={() => handleMessageDelete(msg.id)}
                        className="px-3.5 py-1.5 bg-red-950/40 hover:bg-red-600 border border-red-500/20 hover:border-transparent text-red-400 hover:text-white rounded-lg text-2xs font-bold transition-all"
                      >
                        Delete Log
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Subject: {msg.subject || "No Subject provided"}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl">
                <span className="text-4xl">📭</span>
                <h3 className="font-bold text-white text-md mt-4">Inbox is clean</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-2">
                  There are no contact inquiries yet. Submit a test message from your landing page!
                </p>
              </div>
            )}
          </div>
        )}

        {/* --- MODAL DIALOGS --- */}

        {/* PROJECT FORM MODAL */}
        {isProjectFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  {editingProject ? "Update Project Record" : "Add Project to Showcases"}
                </h3>
                <p className="text-2xs text-slate-400">Fill in project details and technology tags</p>
              </div>

              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">Project Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ride Rove"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">Display Order *</label>
                    <input
                      type="number"
                      required
                      value={projectForm.order}
                      onChange={(e) => setProjectForm({ ...projectForm, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">Short Description *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Provide a general overview of the project..."
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-indigo-500 resize-none"
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">Technology Tags (Comma-separated) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. React,TypeScript,NodeJS,MongoDB"
                    value={projectForm.tags}
                    onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                    className="w-full px-3 py-2 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">Key Features (One feature per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Real-time WebSocket notifications&#10;Stripe payment gateway integration&#10;Google OAuth authentication"
                    value={projectForm.features}
                    onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })}
                    className="w-full px-3 py-2 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-indigo-500 resize-y font-mono text-2xs"
                  ></textarea>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">GitHub Repository URL</label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={projectForm.githubUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">Live Demo URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={projectForm.demoUrl}
                      onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">Cover Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={projectForm.imageUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => setIsProjectFormOpen(false)}
                    className="flex-1 py-2 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800 text-xs font-bold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    {editingProject ? "Apply Changes" : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* EXPERIENCE FORM MODAL */}
        {isExpFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  {editingExperience ? "Update Experience Entry" : "Add Experience Entry"}
                </h3>
                <p className="text-2xs text-slate-400">Define work role details and tech stack used</p>
              </div>

              <form onSubmit={handleExpSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Excellent Web World"
                      value={expForm.company}
                      onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                      className="w-full px-3 py-2 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">Job Role *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Software Engineer"
                      value={expForm.role}
                      onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                      className="w-full px-3 py-2 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">Duration *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apr 2025 - Present"
                      value={expForm.duration}
                      onChange={(e) => setExpForm({ ...expForm, duration: e.target.value })}
                      className="w-full px-3 py-2 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">Display Order *</label>
                    <input
                      type="number"
                      required
                      value={expForm.order}
                      onChange={(e) => setExpForm({ ...expForm, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">Key Contributions & Highlights *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Engineered Seen Jeem real-time gaming platform using MERN Stack, optimized Node.js API endpoints for low-latency queries..."
                    value={expForm.description}
                    onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-indigo-500 resize-none font-sans"
                  ></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-2xs font-bold uppercase tracking-wider text-slate-400">Core Technologies (Comma-separated) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ReactJS,Node.js,Express,MongoDB,WebSockets,AWS"
                    value={expForm.skills}
                    onChange={(e) => setExpForm({ ...expForm, skills: e.target.value })}
                    className="w-full px-3 py-2 text-xs text-slate-200 bg-slate-950 border border-slate-800 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => setIsExpFormOpen(false)}
                    className="flex-1 py-2 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800 text-xs font-bold rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    {editingExperience ? "Apply Changes" : "Add Experience"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
