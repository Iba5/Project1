"use client";

import { useState } from "react";
import { ArrowRight, LogIn, RefreshCw, UserPlus } from "lucide-react";

type AdminAuthFormProps = {
  mode: "login" | "signup";
  onSuccess: () => void;
};

/**
 * Shared email/password form for both the one-time bootstrap signup and
 * ongoing login. Signup creates the account then immediately logs in with
 * the same credentials, since /auth/register doesn't itself return a token.
 */
// Marks a message that came straight from our own API as a curated,
// user-safe string — distinct from a raw network/parse failure, whose
// message must never reach the UI unfiltered.
class ServerMessageError extends Error {}

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
      throw new ServerMessageError(data.error ?? "Invalid credentials");
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
          throw new ServerMessageError(data.error ?? "Could not create the admin account");
        }
      }
      await login();
      onSuccess();
    } catch (err) {
      console.error("[admin-auth-form] submit failed:", err);
      setError(
        err instanceof ServerMessageError
          ? err.message
          : "Connection error — is the API running?",
      );
    } finally {
      setLoading(false);
    }
  };

  const Icon = mode === "signup" ? UserPlus : LogIn;

  return (
    <div className="w-full max-w-sm rounded-2xl bg-background shadow-2xl ring-1 ring-border overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-border bg-brand-navy-deep px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-md border-b-2 border-brand-cta bg-destructive text-sm font-bold text-white">
          C
        </span>
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-brand-cta">
            {mode === "signup" ? "One-Time Setup" : "Restricted Access"}
          </p>
          <h1 className="font-display text-base font-bold uppercase tracking-tight text-white">
            {mode === "signup" ? "Create Admin Account." : "Admin Login."}
          </h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </p>
        )}
        {mode === "signup" && (
          <div className="space-y-1.5">
            <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Name <span className="text-brand-cta">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-brand-heading placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Your name"
            />
          </div>
        )}
        <div className="space-y-1.5">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Email <span className="text-brand-cta">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-brand-heading placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="admin@example.com"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Password <span className="text-brand-cta">*</span>
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-brand-heading placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-cta py-2.5 text-sm font-semibold uppercase tracking-wide text-brand-cta-fg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
          {loading ? "Please Wait…" : mode === "signup" ? "Create Account" : "Sign In"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </button>
      </form>
    </div>
  );
}
