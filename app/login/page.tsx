"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to admin dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("portfolio_admin_token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg("Username and password are required.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        // Save JWT and user details in localStorage
        localStorage.setItem("portfolio_admin_token", data.token);
        localStorage.setItem("portfolio_admin_username", data.user.username);
        localStorage.setItem("portfolio_admin_userid", data.user.id);
        
        // Redirect to admin dashboard
        router.push("/admin");
      } else {
        setErrorMsg(data.message || "Invalid username or password.");
      }
    } catch (err) {
      setErrorMsg("Could not connect to the auth server. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen font-sans antialiased text-slate-100 flex flex-col items-center justify-center px-4">
      {/* Background elements */}
      <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-accent-purple/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-accent-cyan/10 blur-[100px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md relative group">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-accent-purple to-accent-cyan opacity-20 blur-md group-hover:opacity-35 transition duration-500" />
        
        <div className="relative glass-panel rounded-3xl p-8 border border-white/10 space-y-6">
          <div className="space-y-2 text-center">
            <Link href="/" className="inline-block text-slate-500 hover:text-slate-300 text-xs font-semibold mb-2">
              &larr; Back to Portfolio
            </Link>
            <h1 className="text-3xl font-extrabold text-white">Admin Access</h1>
            <p className="text-sm text-slate-400">
              Sign in to manage projects, experiences, and submissions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple transition-all"
              />
            </div>

            {errorMsg && (
              <div className="text-red-400 text-xs font-semibold bg-red-950/20 border border-red-900/30 p-3 rounded-lg">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 border-glow"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="text-center text-[10px] text-slate-500">
            Secure admin login. Default password is seeded inside SQLite db.
          </div>
        </div>
      </div>
    </div>
  );
}
