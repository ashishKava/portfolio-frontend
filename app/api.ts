import { CONFIG } from "./config";

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string;
  githubUrl?: string | null;
  demoUrl?: string | null;
  imageUrl?: string | null;
  features?: string | null;
  order: number;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  skills: string;
  order: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

const getHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Public fetches
  getProjects: async (): Promise<Project[]> => {
    try {
      const res = await fetch(`${CONFIG.apiUrl}/projects`);
      if (!res.ok) throw new Error("Failed to fetch projects");
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getExperiences: async (): Promise<Experience[]> => {
    try {
      const res = await fetch(`${CONFIG.apiUrl}/experiences`);
      if (!res.ok) throw new Error("Failed to fetch experiences");
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  submitContact: async (data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }): Promise<{ status: string; message?: string }> => {
    const res = await fetch(`${CONFIG.apiUrl}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Auth
  login: async (username: string, password: string): Promise<{ status: string; token?: string; message?: string }> => {
    const res = await fetch(`${CONFIG.apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  verifyToken: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${CONFIG.apiUrl}/auth/me`, {
        headers: getHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Admin Projects Management
  createProject: async (projectData: Omit<Project, "id">): Promise<Project> => {
    const res = await fetch(`${CONFIG.apiUrl}/projects`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(projectData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to create project");
    }
    const json = await res.json();
    return json.data;
  },

  updateProject: async (id: string, projectData: Omit<Project, "id">): Promise<Project> => {
    const res = await fetch(`${CONFIG.apiUrl}/projects/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(projectData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to update project");
    }
    const json = await res.json();
    return json.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    const res = await fetch(`${CONFIG.apiUrl}/projects/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete project");
  },

  // Admin Experience Management
  createExperience: async (expData: Omit<Experience, "id">): Promise<Experience> => {
    const res = await fetch(`${CONFIG.apiUrl}/experiences`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(expData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to create experience");
    }
    const json = await res.json();
    return json.data;
  },

  updateExperience: async (id: string, expData: Omit<Experience, "id">): Promise<Experience> => {
    const res = await fetch(`${CONFIG.apiUrl}/experiences/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(expData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to update experience");
    }
    const json = await res.json();
    return json.data;
  },

  deleteExperience: async (id: string): Promise<void> => {
    const res = await fetch(`${CONFIG.apiUrl}/experiences/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete experience");
  },

  // Admin Contact Log Management
  getContactSubmissions: async (): Promise<ContactSubmission[]> => {
    const res = await fetch(`${CONFIG.apiUrl}/contacts`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch contact submissions");
    const json = await res.json();
    return json.data;
  },

  toggleContactRead: async (id: string, read: boolean): Promise<ContactSubmission> => {
    const res = await fetch(`${CONFIG.apiUrl}/contacts/${id}/read`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ read }),
    });
    if (!res.ok) throw new Error("Failed to update read status");
    const json = await res.json();
    return json.data;
  },

  deleteContactSubmission: async (id: string): Promise<void> => {
    const res = await fetch(`${CONFIG.apiUrl}/contacts/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete contact submission");
  }
};
