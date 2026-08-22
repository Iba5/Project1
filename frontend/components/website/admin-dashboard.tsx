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
  LogOut,
  Radio,
  Settings as SettingsIcon,
  ImageIcon,
  Plus,
  Pencil,
  Save,
  FolderPlus,
  Star,
  Upload as UploadIcon,
  Search,
  Layers,
} from "lucide-react";
import { getEvents, clearEvents, type AnalyticsEvent } from "@/lib/analytics";
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

type Tab = "enquiries" | "newsletter" | "analytics" | "live" | "settings" | "catalogue" | "gallery";

type AdminDashboardProps = {
  open: boolean;
  onClose: () => void;
};

type SiteSetting = {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
};

type CatalogueItem = {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  category: Category | null;
  short_description: string | null;
  long_description: string | null;
  image_url: string | null;
  gallery_image_urls: string[] | null;
  is_featured: boolean;
  is_out_of_stock: boolean;
  features: string[] | null;
  specs: Array<{ key: string; value: string }> | null;
  min_order: string | null;
  lead_time: string | null;
  status: string;
  version: number;
};

type MediaItem = {
  id: string;
  title: string;
  alt_text: string | null;
  file_url: string;
  file_type: string | null;
  category: string | null;
};

type MediaCollection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  items: Array<{ media_id: string; sort_order: number; media_item?: MediaItem }>;
};

const SETTINGS_FIELDS: Array<{ key: string; label: string; type: "text" | "textarea" }> = [
  { key: "site_name", label: "Site name", type: "text" },
  { key: "site_description", label: "Site description", type: "textarea" },
  { key: "site_email", label: "Contact email", type: "text" },
  { key: "site_phone", label: "Phone number", type: "text" },
  { key: "site_whatsapp", label: "WhatsApp number", type: "text" },
  { key: "site_url", label: "Site URL", type: "text" },
  { key: "business_hours", label: "Business hours", type: "textarea" },
  { key: "delivery_areas", label: "Delivery areas", type: "textarea" },
  { key: "founding_year", label: "Founding year", type: "text" },
  { key: "social_facebook", label: "Facebook URL", type: "text" },
  { key: "social_instagram", label: "Instagram URL", type: "text" },
];

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

  // ── Settings tab state ───────────────────────────────────────
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsDrafts, setSettingsDrafts] = useState<Record<string, string>>({});
  const [settingsSavingKey, setSettingsSavingKey] = useState<string | null>(null);

  // ── Catalogue tab state ──────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([]);
  const [catalogueItems, setCatalogueItems] = useState<CatalogueItem[]>([]);
  const [catalogueLoading, setCatalogueLoading] = useState(false);
  const [catalogueError, setCatalogueError] = useState<string | null>(null);
  const [catalogueView, setCatalogueView] = useState<"list" | "form">("list");
  const [editingItem, setEditingItem] = useState<CatalogueItem | null>(null);
  const [catalogueSearch, setCatalogueSearch] = useState("");
  const [catalogueCategoryFilter, setCatalogueCategoryFilter] = useState("");
  const [catalogueStatusFilter, setCatalogueStatusFilter] = useState("");

  // ── Gallery tab state ─────────────────────────────────────────
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [collections, setCollections] = useState<MediaCollection[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState("");

  // ── Auth ──────────────────────────────────────────────────────
  // The dashboard only ever mounts once the caller (the /admin page) has
  // confirmed a valid session, so there's no login gate here. The session
  // lives in an httpOnly cookie, so ending it means asking the server to
  // clear it — client JS can't touch it directly. If a token expires
  // mid-session, clear it and hand control back to the caller, which will
  // show the login form again.
  const handleSessionExpired = useCallback(() => {
    fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    onClose();
  }, [onClose]);

  const handleLogout = () => {
    fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setEnquiries([]);
    setStats(null);
    onClose();
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [enqRes, statsRes] = await Promise.all([
        fetch("/api/admin/enquiries?limit=100"),
        fetch("/api/admin/stats"),
      ]);
      if (enqRes.status === 401 || enqRes.status === 403) {
        handleSessionExpired();
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

  // ── Settings tab data ─────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    setSettingsLoading(true);
    setSettingsError(null);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.status === 401 || res.status === 403) {
        handleSessionExpired();
        setSettingsError("Session expired — please log in again.");
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to fetch settings");
      setSettings(data.settings || []);
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSettingsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && tab === "settings") fetchSettings();
  }, [open, tab, fetchSettings]);

  const saveSetting = async (key: string) => {
    const draft = settingsDrafts[key];
    if (draft === undefined) return;
    setSettingsSavingKey(key);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: draft }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to save");
      await fetchSettings();
      setSettingsDrafts((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch (err) {
      setSettingsError(err instanceof Error ? err.message : "Failed to save setting");
    } finally {
      setSettingsSavingKey(null);
    }
  };

  // ── Catalogue tab data ────────────────────────────────────────
  const fetchCatalogue = useCallback(async () => {
    setCatalogueLoading(true);
    setCatalogueError(null);
    try {
      const [catRes, itemRes] = await Promise.all([
        fetch("/api/admin/catalogue/categories"),
        fetch("/api/admin/catalogue/items"),
      ]);
      if (catRes.status === 401 || catRes.status === 403) {
        handleSessionExpired();
        setCatalogueError("Session expired — please log in again.");
        return;
      }
      const catData = await catRes.json();
      const itemData = await itemRes.json();
      if (!catRes.ok || !catData.ok) throw new Error(catData.error ?? "Failed to fetch categories");
      if (!itemRes.ok || !itemData.ok) throw new Error(itemData.error ?? "Failed to fetch items");
      setCategories(catData.categories || []);
      setCatalogueItems(itemData.items || []);
    } catch (err) {
      setCatalogueError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setCatalogueLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && tab === "catalogue") fetchCatalogue();
  }, [open, tab, fetchCatalogue]);

  const deleteCatalogueItem = async (id: string) => {
    if (!confirm("Delete this catalogue item? This cannot be undone.")) return;
    setCatalogueItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await fetch("/api/admin/catalogue/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } finally {
      fetchCatalogue();
    }
  };

  // ── Gallery tab data ──────────────────────────────────────────
  const fetchGallery = useCallback(async () => {
    setGalleryLoading(true);
    setGalleryError(null);
    try {
      const [itemRes, colRes] = await Promise.all([
        fetch("/api/admin/gallery/items"),
        fetch("/api/admin/gallery/collections"),
      ]);
      if (itemRes.status === 401 || itemRes.status === 403) {
        handleSessionExpired();
        setGalleryError("Session expired — please log in again.");
        return;
      }
      const itemData = await itemRes.json();
      const colData = await colRes.json();
      if (!itemRes.ok || !itemData.ok) throw new Error(itemData.error ?? "Failed to fetch media items");
      if (!colRes.ok || !colData.ok) throw new Error(colData.error ?? "Failed to fetch collections");
      setMediaItems(itemData.items || []);
      setCollections(colData.collections || []);
    } catch (err) {
      setGalleryError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && tab === "gallery") fetchGallery();
  }, [open, tab, fetchGallery]);

  const deleteMediaItem = async (id: string) => {
    if (!confirm("Delete this media item?")) return;
    setMediaItems((prev) => prev.filter((i) => i.id !== id));
    try {
      await fetch("/api/admin/gallery/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } finally {
      fetchGallery();
    }
  };

  const deleteCollection = async (id: string) => {
    if (!confirm("Delete this collection?")) return;
    setCollections((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch("/api/admin/gallery/collections", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } finally {
      fetchGallery();
    }
  };

  const createCollection = async () => {
    if (!newCollectionName.trim()) return;
    try {
      const res = await fetch("/api/admin/gallery/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCollectionName.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to create collection");
      setNewCollectionName("");
      fetchGallery();
    } catch (err) {
      setGalleryError(err instanceof Error ? err.message : "Failed to create collection");
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error ?? "Upload failed");
    return data.url as string;
  };

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
        headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
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
                <TabButton active={tab === "settings"} onClick={() => setTab("settings")} icon={SettingsIcon} label="Settings" />
                <TabButton active={tab === "catalogue"} onClick={() => { setTab("catalogue"); setCatalogueView("list"); }} icon={Package} label={`Catalogue${catalogueItems.length ? ` (${catalogueItems.length})` : ""}`} />
                <TabButton active={tab === "gallery"} onClick={() => setTab("gallery")} icon={ImageIcon} label={`Gallery${mediaItems.length ? ` (${mediaItems.length})` : ""}`} />
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

                {/* Settings tab */}
                {tab === "settings" && (
                  <div className="p-4 sm:p-6">
                    {settingsError && (
                      <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-400">
                        {settingsError}
                      </div>
                    )}
                    {settingsLoading && settings.length === 0 ? (
                      <EmptyState icon={SettingsIcon} title="Loading settings…" description="Fetching site settings from the API." />
                    ) : (
                      <div className="space-y-3">
                        {SETTINGS_FIELDS.map((field) => {
                          const setting = settings.find((s) => s.key === field.key);
                          const rawValue = setting ? String(setting.value ?? "") : "";
                          const draft = settingsDrafts[field.key] ?? rawValue;
                          const dirty = settingsDrafts[field.key] !== undefined && settingsDrafts[field.key] !== rawValue;
                          return (
                            <div key={field.key} className="rounded-xl border border-border bg-card p-4">
                              <div className="mb-1.5 flex items-center justify-between">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  {field.label}
                                </label>
                                <span className="font-mono text-[10px] text-muted-foreground">{field.key}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                {field.type === "textarea" ? (
                                  <textarea
                                    value={draft}
                                    onChange={(e) => setSettingsDrafts((prev) => ({ ...prev, [field.key]: e.target.value }))}
                                    rows={2}
                                    className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={draft}
                                    onChange={(e) => setSettingsDrafts((prev) => ({ ...prev, [field.key]: e.target.value }))}
                                    className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                  />
                                )}
                                <button
                                  type="button"
                                  onClick={() => saveSetting(field.key)}
                                  disabled={!dirty || settingsSavingKey === field.key}
                                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-brand-navy px-3 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                                >
                                  {settingsSavingKey === field.key ? (
                                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Save className="h-3.5 w-3.5" />
                                  )}
                                  Save
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Catalogue tab */}
                {tab === "catalogue" && (
                  <CatalogueTab
                    loading={catalogueLoading}
                    error={catalogueError}
                    items={catalogueItems}
                    categories={categories}
                    view={catalogueView}
                    setView={setCatalogueView}
                    editingItem={editingItem}
                    setEditingItem={setEditingItem}
                    search={catalogueSearch}
                    setSearch={setCatalogueSearch}
                    categoryFilter={catalogueCategoryFilter}
                    setCategoryFilter={setCatalogueCategoryFilter}
                    statusFilter={catalogueStatusFilter}
                    setStatusFilter={setCatalogueStatusFilter}
                    onDelete={deleteCatalogueItem}
                    onUploadFile={uploadFile}
                    onRefresh={fetchCatalogue}
                  />
                )}

                {/* Gallery tab */}
                {tab === "gallery" && (
                  <GalleryTab
                    loading={galleryLoading}
                    error={galleryError}
                    mediaItems={mediaItems}
                    collections={collections}
                    newCollectionName={newCollectionName}
                    setNewCollectionName={setNewCollectionName}
                    onCreateCollection={createCollection}
                    onDeleteMediaItem={deleteMediaItem}
                    onDeleteCollection={deleteCollection}
                    onUploadFile={uploadFile}
                    onRefresh={fetchGallery}
                  />
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

const CATALOGUE_STATUSES = ["draft", "published", "archived"] as const;
const MAX_GALLERY_IMAGES = 5;

function CatalogueTab({
  loading,
  error,
  items,
  categories,
  view,
  setView,
  editingItem,
  setEditingItem,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  onDelete,
  onUploadFile,
  onRefresh,
}: {
  loading: boolean;
  error: string | null;
  items: CatalogueItem[];
  categories: Category[];
  view: "list" | "form";
  setView: (v: "list" | "form") => void;
  editingItem: CatalogueItem | null;
  setEditingItem: (i: CatalogueItem | null) => void;
  search: string;
  setSearch: (v: string) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  onDelete: (id: string) => void;
  onUploadFile: (file: File) => Promise<string | null>;
  onRefresh: () => void;
}) {
  const [showCategories, setShowCategories] = useState(false);

  if (view === "form") {
    return (
      <div className="p-4 sm:p-6">
        <CatalogueItemForm
          item={editingItem}
          categories={categories}
          onUploadFile={onUploadFile}
          onCancel={() => setView("list")}
          onSaved={() => {
            setView("list");
            onRefresh();
          }}
        />
      </div>
    );
  }

  const filtered = items.filter((item) => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter && item.category_id !== categoryFilter) return false;
    if (statusFilter && item.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6">
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full rounded-lg border border-border bg-secondary/40 py-2 pl-8 pr-3 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-border bg-secondary/40 px-2.5 py-2 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-secondary/40 px-2.5 py-2 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent"
        >
          <option value="">All statuses</option>
          {CATALOGUE_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowCategories((v) => !v)}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-brand-heading transition-colors hover:bg-secondary"
        >
          <Layers className="h-3.5 w-3.5" strokeWidth={2.25} />
          Categories
        </button>
        <button
          type="button"
          onClick={() => { setEditingItem(null); setView("form"); }}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-navy px-3 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
          New Product
        </button>
      </div>

      {showCategories && (
        <CategoryManager categories={categories} onRefresh={onRefresh} />
      )}

      {filtered.length === 0 && !loading ? (
        <EmptyState icon={Package} title="No products found" description="Add a product to showcase it on the public catalogue." />
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-secondary">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <Package className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h3 className="truncate font-display text-sm font-semibold text-brand-heading">{item.name}</h3>
                  {item.is_featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-muted-foreground">
                    {item.category?.name ?? "Uncategorized"}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-semibold uppercase tracking-wider",
                      item.status === "published"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        : item.status === "draft"
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {item.status}
                  </span>
                  {item.is_out_of_stock && (
                    <span className="rounded-full bg-red-500/15 px-2 py-0.5 font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
                      Out of stock
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => { setEditingItem(item); setView("form"); }}
                  aria-label="Edit product"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-brand-heading"
                >
                  <Pencil className="h-3.5 w-3.5" strokeWidth={2.25} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  aria-label="Delete product"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={2.25} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryManager({ categories, onRefresh }: { categories: Category[]; onRefresh: () => void }) {
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const createCategory = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/catalogue/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to create category");
      setNewName("");
      onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const renameCategory = async (id: string) => {
    if (!editingName.trim()) return;
    await fetch("/api/admin/catalogue/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: editingName.trim() }),
    });
    setEditingId(null);
    onRefresh();
  };

  const moveCategory = async (id: string, direction: -1 | 1) => {
    const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((c) => c.id === id);
    const swapIdx = idx + direction;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    await Promise.all([
      fetch("/api/admin/catalogue/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, sort_order: b.sort_order }),
      }),
      fetch("/api/admin/catalogue/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b.id, sort_order: a.sort_order }),
      }),
    ]);
    onRefresh();
  };

  const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="mb-4 rounded-xl border border-border bg-card p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-heading">Categories</h3>
      <div className="space-y-1.5">
        {sorted.map((cat, i) => (
          <div key={cat.id} className="flex items-center gap-2 rounded-lg bg-secondary/30 px-2.5 py-1.5">
            <div className="flex shrink-0 flex-col">
              <button type="button" disabled={i === 0} onClick={() => moveCategory(cat.id, -1)} className="text-muted-foreground disabled:opacity-30 hover:text-brand-heading">▲</button>
              <button type="button" disabled={i === sorted.length - 1} onClick={() => moveCategory(cat.id, 1)} className="text-muted-foreground disabled:opacity-30 hover:text-brand-heading">▼</button>
            </div>
            {editingId === cat.id ? (
              <input
                autoFocus
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => renameCategory(cat.id)}
                onKeyDown={(e) => e.key === "Enter" && renameCategory(cat.id)}
                className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm"
              />
            ) : (
              <span className="flex-1 text-sm text-brand-heading">{cat.name}</span>
            )}
            <button
              type="button"
              onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }}
              className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-secondary hover:text-brand-heading"
            >
              <Pencil className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name"
          className="flex-1 rounded-lg border border-border bg-secondary/40 px-2.5 py-1.5 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent"
        />
        <button
          type="button"
          onClick={createCategory}
          disabled={saving || !newName.trim()}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-navy px-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <FolderPlus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>
    </div>
  );
}

function CatalogueItemForm({
  item,
  categories,
  onUploadFile,
  onCancel,
  onSaved,
}: {
  item: CatalogueItem | null;
  categories: Category[];
  onUploadFile: (file: File) => Promise<string | null>;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [categoryId, setCategoryId] = useState(item?.category_id ?? "");
  const [shortDescription, setShortDescription] = useState(item?.short_description ?? "");
  const [longDescription, setLongDescription] = useState(item?.long_description ?? "");
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? "");
  const [galleryImages, setGalleryImages] = useState<string[]>(item?.gallery_image_urls ?? []);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [isFeatured, setIsFeatured] = useState(item?.is_featured ?? false);
  const [isOutOfStock, setIsOutOfStock] = useState(item?.is_out_of_stock ?? false);
  const [minOrder, setMinOrder] = useState(item?.min_order ?? "");
  const [leadTime, setLeadTime] = useState(item?.lead_time ?? "");
  const [status, setStatus] = useState(item?.status ?? "draft");
  const [features, setFeatures] = useState<string[]>(item?.features ?? []);
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(item?.specs ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFormError(null);
    try {
      const url = await onUploadFile(file);
      if (url) setImageUrl(url);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (galleryImages.length >= MAX_GALLERY_IMAGES) {
      setFormError(`You can only add up to ${MAX_GALLERY_IMAGES} additional photos.`);
      return;
    }
    setGalleryUploading(true);
    setFormError(null);
    try {
      const url = await onUploadFile(file);
      if (url) setGalleryImages((prev) => [...prev, url]);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setGalleryUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setFormError("Name is required");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        name: name.trim(),
        category_id: categoryId || null,
        short_description: shortDescription || null,
        long_description: longDescription || null,
        image_url: imageUrl || null,
        gallery_image_urls: galleryImages,
        is_featured: isFeatured,
        is_out_of_stock: isOutOfStock,
        min_order: minOrder || null,
        lead_time: leadTime || null,
        status,
        features: features.filter((f) => f.trim()),
        specs: specs.filter((s) => s.key.trim()),
      };
      const res = await fetch("/api/admin/catalogue/items", {
        method: item ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item ? { id: item.id, ...payload, version: item.version } : payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to save product");
      onSaved();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-semibold text-brand-heading">
          {item ? "Edit product" : "New product"}
        </h3>
        <button type="button" onClick={onCancel} className="text-xs font-medium text-muted-foreground hover:text-brand-heading">
          ← Back to list
        </button>
      </div>

      {formError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-400">
          {formError}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent">
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Short description</label>
        <input value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent" />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Long description</label>
        <textarea value={longDescription} onChange={(e) => setLongDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent" />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Display image</label>
        <p className="text-[11px] text-muted-foreground">The main photo shown on the product card and as the cover in quick view.</p>
        <div className="flex items-center gap-3">
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
          )}
          <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-medium text-brand-heading transition-colors hover:bg-secondary">
            {uploading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <UploadIcon className="h-3.5 w-3.5" />}
            {uploading ? "Uploading…" : "Upload image"}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Additional photos ({galleryImages.length}/{MAX_GALLERY_IMAGES})
        </label>
        <p className="text-[11px] text-muted-foreground">Shown alongside the display image in quick view — up to {MAX_GALLERY_IMAGES}.</p>
        <div className="flex flex-wrap items-center gap-2">
          {galleryImages.map((url, i) => (
            <div key={url + i} className="group relative h-16 w-16 overflow-hidden rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setGalleryImages((prev) => prev.filter((_, idx) => idx !== i))}
                aria-label="Remove photo"
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {galleryImages.length < MAX_GALLERY_IMAGES && (
            <label className="inline-flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-brand-accent hover:text-brand-heading">
              {galleryUploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span className="text-[9px] font-medium">Add</span>
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleGalleryFileChange} />
            </label>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Features</label>
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={f}
              onChange={(e) => setFeatures((prev) => prev.map((x, idx) => (idx === i ? e.target.value : x)))}
              className="flex-1 rounded-lg border border-border bg-secondary/40 px-3 py-1.5 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
            <button type="button" onClick={() => setFeatures((prev) => prev.filter((_, idx) => idx !== i))} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-red-500 hover:text-white">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setFeatures((prev) => [...prev, ""])} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-dashed border-border px-2.5 text-xs font-medium text-muted-foreground hover:text-brand-heading">
          <Plus className="h-3.5 w-3.5" /> Add feature
        </button>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Specs</label>
        {specs.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={s.key}
              placeholder="Spec name"
              onChange={(e) => setSpecs((prev) => prev.map((x, idx) => (idx === i ? { ...x, key: e.target.value } : x)))}
              className="w-1/3 rounded-lg border border-border bg-secondary/40 px-3 py-1.5 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
            <input
              value={s.value}
              placeholder="Value"
              onChange={(e) => setSpecs((prev) => prev.map((x, idx) => (idx === i ? { ...x, value: e.target.value } : x)))}
              className="flex-1 rounded-lg border border-border bg-secondary/40 px-3 py-1.5 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
            <button type="button" onClick={() => setSpecs((prev) => prev.filter((_, idx) => idx !== i))} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-red-500 hover:text-white">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setSpecs((prev) => [...prev, { key: "", value: "" }])} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-dashed border-border px-2.5 text-xs font-medium text-muted-foreground hover:text-brand-heading">
          <Plus className="h-3.5 w-3.5" /> Add spec
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Min order</label>
          <input value={minOrder} onChange={(e) => setMinOrder(e.target.value)} className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lead time</label>
          <input value={leadTime} onChange={(e) => setLeadTime(e.target.value)} className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="inline-flex items-center gap-2 text-sm text-brand-heading">
          <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 rounded border-border accent-brand-accent" />
          Featured
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-brand-heading">
          <input type="checkbox" checked={isOutOfStock} onChange={(e) => setIsOutOfStock(e.target.checked)} className="h-4 w-4 rounded border-border accent-brand-accent" />
          Out of stock
        </label>
        <div className="ml-auto flex items-center gap-1 rounded-lg border border-border p-1">
          {CATALOGUE_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                status === s ? "bg-brand-accent text-brand-accent-fg" : "text-muted-foreground hover:text-brand-heading",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <button type="button" onClick={onCancel} className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-brand-heading hover:bg-secondary">
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : "Save product"}
        </button>
      </div>
    </div>
  );
}

function GalleryTab({
  loading,
  error,
  mediaItems,
  collections,
  newCollectionName,
  setNewCollectionName,
  onCreateCollection,
  onDeleteMediaItem,
  onDeleteCollection,
  onUploadFile,
  onRefresh,
}: {
  loading: boolean;
  error: string | null;
  mediaItems: MediaItem[];
  collections: MediaCollection[];
  newCollectionName: string;
  setNewCollectionName: (v: string) => void;
  onCreateCollection: () => void;
  onDeleteMediaItem: (id: string) => void;
  onDeleteCollection: (id: string) => void;
  onUploadFile: (file: File) => Promise<string | null>;
  onRefresh: () => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const url = await onUploadFile(file);
      if (!url) return;
      const res = await fetch("/api/admin/gallery/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: file.name, file_url: url, mime_type: file.type }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to save media item");
      onRefresh();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {(error || uploadError) && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600 dark:text-red-400">
          {error || uploadError}
        </div>
      )}

      <div className="mb-6 rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-heading">Collections</h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="New collection name"
              className="rounded-lg border border-border bg-secondary/40 px-2.5 py-1.5 text-sm text-brand-heading focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
            <button
              type="button"
              onClick={onCreateCollection}
              disabled={!newCollectionName.trim()}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-navy px-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <FolderPlus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
        </div>
        {collections.length === 0 ? (
          <p className="text-xs text-muted-foreground">No collections yet.</p>
        ) : (
          <div className="space-y-1.5">
            {collections.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg bg-secondary/30 px-2.5 py-1.5">
                <span className="text-sm text-brand-heading">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.items?.length ?? 0} items</span>
                <button
                  type="button"
                  onClick={() => onDeleteCollection(c.id)}
                  aria-label="Delete collection"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-heading">Media items</h3>
        <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-brand-navy px-3 text-xs font-semibold text-white transition-opacity hover:opacity-90">
          {uploading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <UploadIcon className="h-3.5 w-3.5" />}
          {uploading ? "Uploading…" : "Upload image"}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      {mediaItems.length === 0 && !loading ? (
        <EmptyState icon={ImageIcon} title="No media yet" description="Upload photos to build out the gallery." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {mediaItems.map((m) => (
            <div key={m.id} className="group relative overflow-hidden rounded-xl border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.file_url} alt={m.alt_text ?? m.title} className="h-32 w-full object-cover" />
              <div className="p-2">
                <p className="truncate text-xs font-medium text-brand-heading">{m.title}</p>
              </div>
              <button
                type="button"
                onClick={() => onDeleteMediaItem(m.id)}
                aria-label="Delete media item"
                className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
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
