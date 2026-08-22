"use client";

import { useState } from "react";
import { LogIn, RefreshCw, UserPlus } from "lucide-react";

type AdminAuthFormProps = {
  mode: "login" | "signup";
  onSuccess: () => void;
};

/**
 * Shared email/password form for both the one-time bootstrap signup and
 * ongoing login. Signup creates the account then immediately logs in with
 * the same credentials, since /auth/register doesn't itself return a token.
 */
export function AdminAuthForm({ mode, onSuccess }: AdminAuthFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    // The login route sets an httpOnly session cookie on success — no token
    // ever reaches this code, so there's nothing to store client-side.
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      throw new Error(data.error ?? "Invalid credentials");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (mode === "signup") {
        const res = await fetch("/api/admin/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error ?? "Could not create the admin account");
        }
      }
      await login();
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection error — is the API running?");
    } finally {
      setLoading(false);
    }
  };

  const Icon = mode === "signup" ? UserPlus : LogIn;

  return (
    <div className="w-full max-w-sm rounded-2xl bg-background shadow-2xl ring-1 ring-border overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-border bg-secondary/40 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-navy text-white">
          <Icon className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <div>
          <h1 className="font-display text-base font-semibold text-brand-heading">
            {mode === "signup" ? "Create the admin account" : "Admin Login"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {mode === "signup"
              ? "One-time setup — this becomes the site's sole administrator."
              : "Sign in to access the dashboard"}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {mode === "signup" && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-brand-heading placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Your name"
            />
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-brand-heading placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="admin@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-brand-heading placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-navy py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
          {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
