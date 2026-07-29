"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Inbox,
  Mail,
  BarChart3,
  RefreshCw,
  Trash2,
  Phone,
  Building2,
  Package,
  Clock,
  CircleDot,
  CircleCheck,
  Download,
  TrendingUp,
  LogIn,
  LogOut,
  Radio,
} from "lucide-react";
import { getEvents, clearEvents, type AnalyticsEvent } from "@/lib/analytics";
import { getAdminToken, setAdminToken, clearAdminToken, getAuthHeaders } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";

type Enquiry = {
  id: string;
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  product: string | null;
  message: string;
  status: string;
  createdAt: string;
};

type Stats = {
  total: number;
  new: number;
  contacted: number;
  resolved: number;
  recent: number;
  today: number;
};

type Tab = "enquiries" | "newsletter" | "analytics" | "live";

type AdminDashboardProps = {
  open: boolean;
  onClose: () => void;
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: typeof CircleDot }
> = {
  new: {
    label: "New",
    color: "bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-blue-500/30",
    icon: CircleDot,
  },
  contacted: {
    label: "Contacted",
    color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/30",
    icon: Phone,
  },
  resolved: {
    label: "Resolved",
    color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30",
    icon: CircleCheck,
  },
};

export function AdminDashboard({ open, onClose }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>("enquiries");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newsletter, setNewsletter] = useState<Array<{ email: string; ts: string }>>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [liveEvents, setLiveEvents] = useState<AnalyticsEvent[]>([]);
  const [liveConnected, setLiveConnected] = useState(false);

  // ── Auth state ────────────────────────────────────────────────
  const [isAuthed, setIsAuthed] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Hydrate auth state from sessionStorage
  useEffect(() => {
    setIsAuthed(!!getAdminToken());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setLoginError(data.error ?? "Invalid credentials");
        return;
      }
      setAdminToken(data.access_token);
      setIsAuthed(true);
    } catch {
      setLoginError("Connection error — is the API running?");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setIsAuthed(false);
    setEnquiries([]);
    setStats(null);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const authHeaders = getAuthHeaders();
      const [enqRes, statsRes] = await Promise.all([
        fetch("/api/admin/enquiries?limit=100", { headers: authHeaders }),
        fetch("/api/admin/stats", { headers: authHeaders }),
      ]);
      if (enqRes.status === 401 || enqRes.status === 403) {
        clearAdminToken();
        setIsAuthed(false);
        setError("Session expired — please log in again.");
        return;
      }
      if (!enqRes.ok || !statsRes.ok) throw new Error("Failed to fetch");
      const enqData = await enqRes.json();
      const statsData = await statsRes.json();
      setEnquiries(enqData.enquiries || []);
      setStats(statsData.stats || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLocalData = useCallback(() => {
    try {
      const raw = localStorage.getItem("canbri-newsletter");
      setNewsletter(raw ? JSON.parse(raw) : []);
    } catch {
      setNewsletter([]);
    }
    setEvents(getEvents());
  }, []);

  useEffect(() => {
    if (open) {
      fetchData();
      fetchLocalData();
    }
  }, [open, fetchData, fetchLocalData]);

  // Live event feed — subscribe to real-time analytics events
  useEffect(() => {
    if (!open || tab !== "live") return;
    setLiveConnected(true);
    // Seed with the most recent events
    setLiveEvents(getEvents().slice(-20).reverse());
    const handler = (e: Event) => {
      const ev = (e as CustomEvent<AnalyticsEvent>).detail;
      if (!ev) return;
      setLiveEvents((prev) => [ev, ...prev].slice(0, 50));
    };
    const clearedHandler = () => setLiveEvents([]);
    window.addEventListener("canbri:analytics", handler as EventListener);
    window.addEventListener("canbri:analytics-cleared", clearedHandler as EventListener);
    return () => {
      setLiveConnected(false);
      window.removeEventListener("canbri:analytics", handler as EventListener);
      window.removeEventListener("canbri:analytics-cleared", clearedHandler as EventListener);
    };
  }, [open, tab]);

  // Lock body scroll + Escape to close
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const updateStatus = async (id: string, status: string) => {
    // Optimistic update
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e)),
    );
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      fetchData();
    } catch {
      fetchData();
    }
  };

  const deleteEnquiry = async (id: string) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
    try {
      await fetch("/api/admin/enquiries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ id }),
      });
      fetchData();
    } catch {
      fetchData();
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Company", "Phone", "Email", "Product", "Status", "Created", "Message"];
    const rows = enquiries.map((e) => [
      e.name,
      e.company || "",
      e.phone,
      e.email || "",
      e.product || "",
      e.status,
      new Date(e.createdAt).toISOString(),
      e.message.replace(/"/g, '""'),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `canbri-enquiries-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Aggregate event counts by type
  const eventCounts = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});

  // ── Login gate ────────────────────────────────────────────────
  if (open && !isAuthed) {
    return (
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 z-[110] bg-brand-navy/70 backdrop-blur-sm"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[120] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-sm rounded-2xl bg-background shadow-2xl ring-1 ring-border overflow-hidden">
                <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-navy text-white">
                      <LogIn className="h-5 w-5" strokeWidth={2.25} />
                    </span>
                    <div>
                      <h2 className="font-display text-base font-semibold text-brand-heading">Admin Login</h2>
                      <p className="text-xs text-muted-foreground">Sign in to access the dashboard</p>
                    </div>
                  </div>
                  <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-brand-heading transition-colors hover:bg-secondary">
                    <X className="h-5 w-5" strokeWidth={2.25} />
                  </button>
                </div>
                <form onSubmit={handleLogin} className="space-y-4 p-5">
                  {loginError && (
                    <p className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-400">{loginError}</p>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-brand-heading placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent"
                      placeholder="admin@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-brand-heading placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-accent"
                      placeholder="••••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-navy py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {loginLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                    {loginLoading ? "Signing in…" : "Sign in"}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-brand-navy/70 backdrop-blur-sm"
            aria-hidden
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Admin dashboard"
          >
            <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl ring-1 ring-border">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-navy text-white">
                    <BarChart3 className="h-5 w-5" strokeWidth={2.25} />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-brand-heading">
                      Admin Dashboard
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Manage enquiries, newsletter & analytics
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      fetchData();
                      fetchLocalData();
                    }}
                    disabled={loading}
                    aria-label="Refresh data"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-brand-heading transition-colors hover:bg-secondary disabled:opacity-50"
                  >
                    <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} strokeWidth={2.25} />
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Log out"
                    title="Log out"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-red-500 hover:text-white"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dashboard"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-brand-heading transition-colors hover:bg-secondary"
                  >
                    <X className="h-5 w-5" strokeWidth={2.25} />
                  </button>
                </div>
              </div>

              {/* Stats row */}
              {stats && (
                <div className="grid grid-cols-2 gap-3 border-b border-border bg-background px-5 py-4 sm:grid-cols-4 sm:px-6">
                  <StatCard label="Total Enquiries" value={stats.total} icon={Inbox} accent="navy" />
                  <StatCard label="New" value={stats.new} icon={CircleDot} accent="blue" />
                  <StatCard label="This Week" value={stats.recent} icon={TrendingUp} accent="amber" />
                  <StatCard label="Today" value={stats.today} icon={Clock} accent="emerald" />
                </div>
              )}

              {/* Tabs */}
              <div className="flex items-center gap-1 border-b border-border bg-background px-5 sm:px-6">
                <TabButton active={tab === "enquiries"} onClick={() => setTab("enquiries")} icon={Inbox} label={`Enquiries${stats ? ` (${stats.total})` : ""}`} />
                <TabButton active={tab === "newsletter"} onClick={() => setTab("newsletter")} icon={Mail} label={`Newsletter (${newsletter.length})`} />
                <TabButton active={tab === "analytics"} onClick={() => setTab("analytics")} icon={BarChart3} label={`Analytics (${events.length})`} />
                <TabButton active={tab === "live"} onClick={() => setTab("live")} icon={Radio} label="Live" />
              </div>

              {/* Body */}
              <div className="flex-1 overflow-auto bg-secondary/20">
                {error && (
                  <div className="m-4 rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                {/* Enquiries tab */}
                {tab === "enquiries" && (
                  <div className="p-4 sm:p-6">
                    {enquiries.length > 0 && (
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Showing {enquiries.length} enquiry{enquiries.length === 1 ? "" : "ies"}
                        </p>
                        <button
                          type="button"
                          onClick={exportCSV}
                          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium text-brand-heading transition-colors hover:bg-brand-accent hover:text-brand-accent-fg hover:border-brand-accent"
                        >
                          <Download className="h-3.5 w-3.5" strokeWidth={2.25} />
                          Export CSV
                        </button>
                      </div>
                    )}
                    {enquiries.length === 0 && !loading ? (
                      <EmptyState icon={Inbox} title="No enquiries yet" description="Contact form submissions will appear here." />
                    ) : (
                      <div className="space-y-3">
                        {enquiries.map((enq) => {
                          const statusCfg = STATUS_CONFIG[enq.status] || STATUS_CONFIG.new;
                          const StatusIcon = statusCfg.icon;
                          return (
                            <div
                              key={enq.id}
                              className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                            >
                              <div className="flex items-start justify-between gap-3 p-4">
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-display text-sm font-semibold text-brand-heading">
                                      {enq.name}
                                    </h3>
                                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1", statusCfg.color)}>
                                      <StatusIcon className="h-3 w-3" strokeWidth={2.5} />
                                      {statusCfg.label}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                      {new Date(enq.createdAt).toLocaleString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                    <span className="inline-flex items-center gap-1">
                                      <Phone className="h-3 w-3" strokeWidth={2.25} />
                                      <a href={`tel:${enq.phone}`} className="hover:text-brand-heading hover:underline">
                                        {enq.phone}
                                      </a>
                                    </span>
                                    {enq.email && (
                                      <span className="inline-flex items-center gap-1">
                                        <Mail className="h-3 w-3" strokeWidth={2.25} />
                                        <a href={`mailto:${enq.email}`} className="hover:text-brand-heading hover:underline">
                                          {enq.email}
                                        </a>
                                      </span>
                                    )}
                                    {enq.company && (
                                      <span className="inline-flex items-center gap-1">
                                        <Building2 className="h-3 w-3" strokeWidth={2.25} />
                                        {enq.company}
                                      </span>
                                    )}
                                    {enq.product && (
                                      <span className="inline-flex items-center gap-1">
                                        <Package className="h-3 w-3" strokeWidth={2.25} />
                                        {enq.product}
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-2 rounded-md bg-secondary/50 p-2.5 text-xs leading-relaxed text-muted-foreground">
                                    {enq.message}
                                  </p>
                                </div>
                              </div>
                              {/* Status actions */}
                              <div className="flex items-center gap-1 border-t border-border bg-secondary/30 px-4 py-2">
                                <span className="mr-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                  Set status:
                                </span>
                                {(["new", "contacted", "resolved"] as const).map((s) => {
                                  const cfg = STATUS_CONFIG[s];
                                  const Icon = cfg.icon;
                                  return (
                                    <button
                                      key={s}
                                      type="button"
                                      onClick={() => updateStatus(enq.id, s)}
                                      className={cn(
                                        "inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-[11px] font-medium transition-colors",
                                        enq.status === s
                                          ? "bg-brand-accent text-brand-accent-fg"
                                          : "text-muted-foreground hover:bg-secondary hover:text-brand-heading",
                                      )}
                                    >
                                      <Icon className="h-3 w-3" strokeWidth={2.25} />
                                      {cfg.label}
                                    </button>
                                  );
                                })}
                                <button
                                  type="button"
                                  onClick={() => deleteEnquiry(enq.id)}
                                  aria-label="Delete enquiry"
                                  className="ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-500 hover:text-white"
                                >
                                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Newsletter tab */}
                {tab === "newsletter" && (
                  <div className="p-4 sm:p-6">
                    {newsletter.length === 0 ? (
                      <EmptyState icon={Mail} title="No newsletter subscribers yet" description="Email signups from the footer form will appear here." />
                    ) : (
                      <div className="overflow-hidden rounded-xl border border-border bg-card">
                        <table className="w-full text-sm">
                          <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
                            <tr>
                              <th className="px-4 py-2.5 text-left font-semibold">#</th>
                              <th className="px-4 py-2.5 text-left font-semibold">Email</th>
                              <th className="px-4 py-2.5 text-left font-semibold">Subscribed</th>
                              <th className="px-4 py-2.5 text-right font-semibold">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {newsletter.map((sub, i) => (
                              <tr key={sub.email + i} className="hover:bg-secondary/30">
                                <td className="px-4 py-2.5 text-xs text-muted-foreground">{i + 1}</td>
                                <td className="px-4 py-2.5">
                                  <a href={`mailto:${sub.email}`} className="font-medium text-brand-heading hover:underline">
                                    {sub.email}
                                  </a>
                                </td>
                                <td className="px-4 py-2.5 text-xs text-muted-foreground">
                                  {new Date(sub.ts).toLocaleString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = newsletter.filter((_, idx) => idx !== i);
                                      setNewsletter(updated);
                                      localStorage.setItem("canbri-newsletter", JSON.stringify(updated));
                                    }}
                                    aria-label="Remove subscriber"
                                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-500 hover:text-white"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Live event feed tab */}
                {tab === "live" && (
                  <div className="p-4 sm:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          <Radio className="h-4 w-4" strokeWidth={2.25} />
                          {liveConnected && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                            </span>
                          )}
                        </span>
                        <div>
                          <h3 className="font-display text-sm font-semibold text-brand-heading">
                            Live event feed
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Real-time stream of user interactions on the site
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                        {liveConnected ? "Listening" : "Paused"}
                      </span>
                    </div>

                    {/* Helpful tip */}
                    <div className="mb-4 rounded-lg border border-dashed border-border bg-secondary/30 p-3 text-xs text-muted-foreground">
                      <span className="font-medium text-brand-heading">Tip:</span> Open the site in another tab and interact with products, search, or the contact form — events will stream here in real-time.
                    </div>

                    {liveEvents.length === 0 ? (
                      <EmptyState icon={Radio} title="Waiting for events…" description="Interact with the site to see live events appear here." />
                    ) : (
                      <div className="space-y-1.5">
                        <AnimatePresence initial={false}>
                          {liveEvents.map((ev, i) => (
                            <motion.div
                              key={`${ev.ts}-${i}`}
                              layout
                              initial={{ opacity: 0, x: -20, backgroundColor: "rgba(16, 185, 129, 0.12)" }}
                              animate={{ opacity: 1, x: 0, backgroundColor: "rgba(0, 0, 0, 0)" }}
                              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                              className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2 text-xs"
                            >
                              <span className={cn(
                                "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                                ev.type.startsWith("whatsapp") || ev.type.startsWith("call")
                                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                  : ev.type.startsWith("product")
                                  ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                                  : ev.type.startsWith("newsletter") || ev.type.startsWith("contact")
                                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                                  : "bg-brand-accent/20 text-brand-accent-fg",
                              )}>
                                {ev.type.replace(/_/g, " ")}
                              </span>
                              {ev.label && (
                                <span className="min-w-0 flex-1 truncate font-medium text-brand-heading">
                                  {ev.label}
                                </span>
                              )}
                              <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground">
                                {new Date(ev.ts).toLocaleTimeString(undefined, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })}
                              </span>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                )}

                {/* Analytics tab */}
                {tab === "analytics" && (
                  <div className="p-4 sm:p-6">
                    {events.length === 0 ? (
                      <EmptyState icon={BarChart3} title="No analytics events yet" description="User interactions (clicks, views, submissions) will appear here." />
                    ) : (
                      <>
                        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {Object.entries(eventCounts).map(([type, count]) => (
                            <div
                              key={type}
                              className="rounded-xl border border-border bg-card p-3"
                            >
                              <p className="font-display text-2xl font-bold text-brand-heading">
                                {count}
                              </p>
                              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {type.replace(/_/g, " ")}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-heading">
                            Recent Events
                          </h3>
                          <button
                            type="button"
                            onClick={() => {
                              clearEvents();
                              setEvents([]);
                            }}
                            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" strokeWidth={2.25} />
                            Clear all
                          </button>
                        </div>
                        <div className="max-h-96 space-y-1 overflow-y-auto rounded-xl border border-border bg-card p-2">
                          {[...events].reverse().slice(0, 100).map((ev, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-secondary/50"
                            >
                              <span className="shrink-0 rounded-full bg-brand-accent/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-brand-accent-fg">
                                {ev.type.replace(/_/g, " ")}
                              </span>
                              {ev.label && (
                                <span className="min-w-0 flex-1 truncate font-medium text-brand-heading">
                                  {ev.label}
                                </span>
                              )}
                              <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                                {new Date(ev.ts).toLocaleTimeString(undefined, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border bg-secondary/30 px-5 py-3 sm:px-6">
                <p className="text-[10px] text-muted-foreground">
                  Admin access via <kbd className="rounded border border-border bg-background px-1 py-0.5 text-[9px] font-semibold">Ctrl+Shift+A</kbd> or the footer link.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof Inbox;
  accent: "navy" | "blue" | "amber" | "emerald";
}) {
  const accentClasses = {
    navy: "bg-brand-navy/10 text-brand-navy dark:text-brand-ice",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card p-3">
      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-md", accentClasses[accent])}>
        <Icon className="h-4 w-4" strokeWidth={2.25} />
      </span>
      <div className="min-w-0">
        <p className="font-display text-xl font-bold leading-none text-brand-heading">
          {value}
        </p>
        <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Inbox;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors",
        active
          ? "text-brand-heading"
          : "text-muted-foreground hover:text-brand-heading",
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={2.25} />
      {label}
      {active && (
        <motion.span
          layoutId="admin-tab-indicator"
          className="absolute inset-x-0 bottom-0 h-0.5 bg-brand-accent"
          transition={{ duration: 0.2 }}
        />
      )}
    </button>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Inbox;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </span>
      <h3 className="font-display text-base font-semibold text-brand-heading">
        {title}
      </h3>
      <p className="max-w-xs text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
