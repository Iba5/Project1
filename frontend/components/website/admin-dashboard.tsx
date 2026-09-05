"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
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
  WifiOff,
  ShieldAlert,
  AlertTriangle,
  ServerCrash,
} from "lucide-react";
import { getEvents, clearEvents, type AnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/website/theme-toggle";

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

type Tab = "enquiries" | "analytics" | "settings" | "catalogue" | "gallery";

type AdminDashboardProps = {
  open: boolean;
};

type SiteSetting = {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
};

/** Settings are stored as raw JSON. Some rows (from an earlier seed
 * convention) wrap scalars as {"value": ...} instead of storing them
 * directly — unwrap that shape, then render arrays/numbers/strings as
 * editable text uniformly. */
function settingValueToText(raw: unknown): string {
  let value = raw;
  if (value && typeof value === "object" && !Array.isArray(value) && "value" in (value as Record<string, unknown>)) {
    value = (value as Record<string, unknown>).value;
  }
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

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
  { key: "site_address", label: "Business address", type: "textarea" },
  { key: "business_hours", label: "Business hours", type: "textarea" },
  { key: "delivery_areas", label: "Delivery areas", type: "textarea" },
  { key: "founding_year", label: "Founding year", type: "text" },
  { key: "social_facebook", label: "Facebook URL", type: "text" },
  { key: "social_instagram", label: "Instagram URL", type: "text" },
  { key: "db_storage_limit_mb", label: "Database storage limit (MB)", type: "text" },
  { key: "image_storage_limit_mb", label: "Image storage limit (MB)", type: "text" },
];

type StorageStats = {
  db_used_mb: number;
  db_limit_mb: number | null;
  image_used_mb: number | null;
  image_limit_mb: number | null;
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

/**
 * Thrown by adminFetch with a short, plain-language, status-aware message
 * already attached — callers just show err.message, no guessing needed.
 * This exists specifically to fix a real incident: a 422 from a bad
 * pagination limit got swallowed into a generic "please try again" message,
 * which made the bug impossible for the admin to describe when reporting it.
 */
class AdminApiError extends Error {
  status: number | null;
  constructor(message: string, status: number | null) {
    super(message);
    this.status = status;
  }
}

/** Turns a status code + backend detail string into a short, specific,
 * plain-language message — never a raw stack trace, never a vague
 * "something went wrong". */
function describeStatus(status: number, action: string, detail?: string): string {
  switch (status) {
    case 401:
      return "Your session expired — please log in again.";
    case 403:
      return `Couldn't ${action} — you don't have permission (403).`;
    case 404:
      return `Couldn't ${action} — not found (404).`;
    case 422:
      return `Couldn't ${action} — the data was rejected${detail ? `: ${detail}` : ""} (422).`;
    case 429:
      return `Couldn't ${action} — too many requests, wait a moment and try again (429).`;
    default:
      if (status >= 500) return `Couldn't ${action} — server error (${status}). Try again shortly.`;
      return `Couldn't ${action}${detail ? ` — ${detail}` : ""} (error ${status}).`;
  }
}

/** Fetch wrapper for every admin API call. Always resolves to the parsed
 * JSON body on success, or throws an AdminApiError carrying a message
 * that's already safe and specific to show the admin directly. */
async function adminFetch(url: string, init: RequestInit | undefined, action: string): Promise<any> {
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch {
    throw new AdminApiError(`Couldn't ${action} — no connection to the server. Check your internet.`, null);
  }
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // No JSON body (e.g. a 502 from an upstream proxy) — fall through with data = null.
  }
  if (res.ok && (data === null || data.ok !== false)) return data ?? {};
  const detail = typeof data?.error === "string" ? data.error : undefined;
  throw new AdminApiError(describeStatus(res.status, action, detail), res.status);
}

/** Reads an AdminApiError's message, or falls back to a short generic
 * message for anything unexpected (never swallowed silently, always logged). */
function errorMessage(err: unknown, action: string): string {
  if (err instanceof AdminApiError) return err.message;
  if (err instanceof Error) return `Couldn't ${action} — unexpected error: ${err.message}`;
  return `Couldn't ${action} — unknown error.`;
}

type ConfirmState = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
} | null;

/** Unmistakable destructive-action confirmation: red icon, short plain
 * language, big obvious buttons — replaces bare browser confirm() dialogs
 * which are easy to misread or dismiss by accident. */
function ConfirmDialog({ state, onClose }: { state: ConfirmState; onClose: () => void }) {
  return (
    <AnimatePresence>
      {state && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                <Trash2 className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <h3 className="font-display text-base font-bold text-brand-heading">{state.title}</h3>
            </div>
            <p className="mb-5 text-sm text-muted-foreground">{state.description}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 flex-1 items-center justify-center rounded-xl border border-border bg-background text-sm font-semibold text-brand-heading transition-colors hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  state.onConfirm();
                  onClose();
                }}
                className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-destructive text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Trash2 className="h-4 w-4" strokeWidth={2.25} />
                {state.confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Color-coded, icon-led error banner. Picks an icon/color by failure type
 * (network vs. auth vs. server vs. generic) so an admin can recognize what
 * kind of problem it is at a glance, even without reading closely — while
 * the text underneath stays short and specific about what actually broke. */
function ErrorBanner({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const isAuth = /session expired|permission/i.test(message);
  const isNetwork = /no connection/i.test(message);
  const isServer = /server error/i.test(message);
  const Icon = isAuth ? ShieldAlert : isNetwork ? WifiOff : isServer ? ServerCrash : AlertTriangle;
  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
        <Icon className="h-4 w-4" strokeWidth={2.25} />
      </span>
      <div className="min-w-0 flex-1 pt-1">
        <p className="text-sm font-medium text-destructive">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-destructive/30 bg-background px-2.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive hover:text-white"
        >
          <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.25} />
          Retry
        </button>
      )}
    </div>
  );
}

export function AdminDashboard({ open }: AdminDashboardProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("enquiries");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  // ── Settings tab state ───────────────────────────────────────
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsDrafts, setSettingsDrafts] = useState<Record<string, string>>({});
  const [settingsSavingKey, setSettingsSavingKey] = useState<string | null>(null);
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [storageStatsLoading, setStorageStatsLoading] = useState(false);
  const [storageStatsError, setStorageStatsError] = useState<string | null>(null);

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
    router.push("/");
  }, [router]);

  const handleLogout = () => {
    fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setEnquiries([]);
    setStats(null);
    router.push("/");
  };

  const [confirmState, setConfirmState] = useState<ConfirmState>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [enqData, statsData] = await Promise.all([
        adminFetch("/api/admin/enquiries?limit=100", undefined, "load enquiries"),
        adminFetch("/api/admin/stats", undefined, "load enquiry stats"),
      ]);
      setEnquiries(enqData.enquiries || []);
      setStats(statsData.stats || null);
    } catch (err) {
      console.error("[admin-dashboard] fetchData failed:", err);
      if (err instanceof AdminApiError && err.status === 401) handleSessionExpired();
      setError(errorMessage(err, "load dashboard data"));
    } finally {
      setLoading(false);
    }
  }, [handleSessionExpired]);

  const fetchLocalData = useCallback(() => {
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
      const data = await adminFetch("/api/admin/settings", undefined, "load settings");
      setSettings(data.settings || []);
    } catch (err) {
      console.error("[admin-dashboard] fetchSettings failed:", err);
      if (err instanceof AdminApiError && err.status === 401) handleSessionExpired();
      setSettingsError(errorMessage(err, "load settings"));
    } finally {
      setSettingsLoading(false);
    }
  }, [handleSessionExpired]);

  useEffect(() => {
    if (open && tab === "settings") fetchSettings();
  }, [open, tab, fetchSettings]);

  const fetchStorageStats = useCallback(async () => {
    setStorageStatsLoading(true);
    setStorageStatsError(null);
    try {
      const data = await adminFetch("/api/admin/storage-stats", undefined, "load storage usage");
      setStorageStats(data.stats || null);
    } catch (err) {
      console.error("[admin-dashboard] fetchStorageStats failed:", err);
      if (err instanceof AdminApiError && err.status === 401) handleSessionExpired();
      setStorageStatsError(errorMessage(err, "load storage usage"));
    } finally {
      setStorageStatsLoading(false);
    }
  }, [handleSessionExpired]);

  useEffect(() => {
    if (open && tab === "settings") fetchStorageStats();
  }, [open, tab, fetchStorageStats]);

  const saveSetting = async (key: string) => {
    const draft = settingsDrafts[key];
    if (draft === undefined) return;
    setSettingsSavingKey(key);
    try {
      const value: unknown =
        key === "delivery_areas"
          ? draft.split(",").map((s) => s.trim()).filter(Boolean)
          : draft;
      await adminFetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      }, `save ${key.replace(/_/g, " ")}`);
      await fetchSettings();
      setSettingsDrafts((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch (err) {
      console.error("[admin-dashboard] saveSetting failed:", err);
      if (err instanceof AdminApiError && err.status === 401) handleSessionExpired();
      setSettingsError(errorMessage(err, `save ${key.replace(/_/g, " ")}`));
    } finally {
      setSettingsSavingKey(null);
    }
  };

  // ── Catalogue tab data ────────────────────────────────────────
  const fetchCatalogue = useCallback(async () => {
    setCatalogueLoading(true);
    setCatalogueError(null);
    try {
      const [catData, itemData] = await Promise.all([
        adminFetch("/api/admin/catalogue/categories", undefined, "load categories"),
        adminFetch("/api/admin/catalogue/items", undefined, "load products"),
      ]);
      setCategories(catData.categories || []);
      setCatalogueItems(itemData.items || []);
    } catch (err) {
      console.error("[admin-dashboard] fetchCatalogue failed:", err);
      if (err instanceof AdminApiError && err.status === 401) handleSessionExpired();
      setCatalogueError(errorMessage(err, "load the catalogue"));
    } finally {
      setCatalogueLoading(false);
    }
  }, [handleSessionExpired]);

  useEffect(() => {
    if (open && tab === "catalogue") fetchCatalogue();
  }, [open, tab, fetchCatalogue]);

  const deleteCatalogueItem = (id: string, name: string) => {
    setConfirmState({
      title: "Delete this product?",
      description: `"${name}" will be removed from the catalogue. This cannot be undone.`,
      confirmLabel: "Delete product",
      onConfirm: async () => {
        setCatalogueItems((prev) => prev.filter((i) => i.id !== id));
        try {
          await adminFetch("/api/admin/catalogue/items", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }, "delete product");
        } catch (err) {
          console.error("[admin-dashboard] deleteCatalogueItem failed:", err);
          if (err instanceof AdminApiError && err.status === 401) handleSessionExpired();
          setCatalogueError(errorMessage(err, "delete product"));
        } finally {
          fetchCatalogue();
        }
      },
    });
  };

  // ── Gallery tab data ──────────────────────────────────────────
  const fetchGallery = useCallback(async () => {
    setGalleryLoading(true);
    setGalleryError(null);
    try {
      const [itemData, colData] = await Promise.all([
        adminFetch("/api/admin/gallery/items", undefined, "load media items"),
        adminFetch("/api/admin/gallery/collections", undefined, "load collections"),
      ]);
      setMediaItems(itemData.items || []);
      setCollections(colData.collections || []);
    } catch (err) {
      console.error("[admin-dashboard] fetchGallery failed:", err);
      if (err instanceof AdminApiError && err.status === 401) handleSessionExpired();
      setGalleryError(errorMessage(err, "load the gallery"));
    } finally {
      setGalleryLoading(false);
    }
  }, [handleSessionExpired]);

  useEffect(() => {
    if (open && tab === "gallery") fetchGallery();
  }, [open, tab, fetchGallery]);

  const deleteMediaItem = (id: string, title: string) => {
    setConfirmState({
      title: "Delete this photo?",
      description: `"${title}" will be permanently removed from the gallery.`,
      confirmLabel: "Delete photo",
      onConfirm: async () => {
        setMediaItems((prev) => prev.filter((i) => i.id !== id));
        try {
          await adminFetch("/api/admin/gallery/items", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }, "delete photo");
        } catch (err) {
          console.error("[admin-dashboard] deleteMediaItem failed:", err);
          if (err instanceof AdminApiError && err.status === 401) handleSessionExpired();
          setGalleryError(errorMessage(err, "delete photo"));
        } finally {
          fetchGallery();
        }
      },
    });
  };

  const deleteCollection = (id: string, name: string) => {
    setConfirmState({
      title: "Delete this collection?",
      description: `"${name}" will be deleted. Photos inside it are not deleted, only the grouping.`,
      confirmLabel: "Delete collection",
      onConfirm: async () => {
        setCollections((prev) => prev.filter((c) => c.id !== id));
        try {
          await adminFetch("/api/admin/gallery/collections", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }, "delete collection");
        } catch (err) {
          console.error("[admin-dashboard] deleteCollection failed:", err);
          if (err instanceof AdminApiError && err.status === 401) handleSessionExpired();
          setGalleryError(errorMessage(err, "delete collection"));
        } finally {
          fetchGallery();
        }
      },
    });
  };

  const createCollection = async () => {
    if (!newCollectionName.trim()) return;
    try {
      await adminFetch("/api/admin/gallery/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCollectionName.trim() }),
      }, "create collection");
      setNewCollectionName("");
      fetchGallery();
    } catch (err) {
      console.error("[admin-dashboard] createCollection failed:", err);
      if (err instanceof AdminApiError && err.status === 401) handleSessionExpired();
      setGalleryError(errorMessage(err, "create the collection"));
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const toUpload = await compressImageClientSide(file);
    const formData = new FormData();
    formData.append("file", toUpload);
    const data = await adminFetch("/api/admin/upload", { method: "POST", body: formData }, "upload the image");
    return data.url as string;
  };

  const updateStatus = async (id: string, status: string) => {
    // Optimistic update
    const previous = enquiries;
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e)),
    );
    try {
      await adminFetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      }, "update enquiry status");
      fetchData();
    } catch (err) {
      console.error("[admin-dashboard] updateStatus failed:", err);
      if (err instanceof AdminApiError && err.status === 401) handleSessionExpired();
      setEnquiries(previous);
      setError(errorMessage(err, "update enquiry status"));
    }
  };

  const deleteEnquiry = (id: string, name: string) => {
    setConfirmState({
      title: "Delete this enquiry?",
      description: `The enquiry from "${name}" will be permanently removed.`,
      confirmLabel: "Delete enquiry",
      onConfirm: async () => {
        const previous = enquiries;
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        try {
          await adminFetch("/api/admin/enquiries", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }, "delete enquiry");
          fetchData();
        } catch (err) {
          console.error("[admin-dashboard] deleteEnquiry failed:", err);
          if (err instanceof AdminApiError && err.status === 401) handleSessionExpired();
          setEnquiries(previous);
          setError(errorMessage(err, "delete enquiry"));
        }
      },
    });
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

  if (!open) return null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="sticky top-0 flex h-screen w-56 shrink-0 flex-col bg-brand-navy-deep text-white">
                {/* Logo block */}
                <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-b-2 border-brand-cta bg-destructive text-sm font-bold text-white">
                    C
                  </span>
                  <div className="min-w-0">
                    <p className="font-display text-sm font-bold leading-none tracking-tight text-white">
                      CANBRI
                    </p>
                    <p className="mt-1 truncate font-mono text-[9px] font-medium uppercase tracking-widest text-brand-cta">
                      Admin Panel
                    </p>
                  </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
                  <SidebarNavItem active={tab === "enquiries"} onClick={() => setTab("enquiries")} icon={Inbox} label={`Enquiries${stats ? ` (${stats.total})` : ""}`} />
                  <SidebarNavItem active={tab === "analytics"} onClick={() => setTab("analytics")} icon={BarChart3} label={`Analytics (${events.length})`} />
                  <SidebarNavItem active={tab === "settings"} onClick={() => setTab("settings")} icon={SettingsIcon} label="Settings" />
                  <SidebarNavItem active={tab === "catalogue"} onClick={() => { setTab("catalogue"); setCatalogueView("list"); }} icon={Package} label={`Catalogue${catalogueItems.length ? ` (${catalogueItems.length})` : ""}`} />
                  <SidebarNavItem active={tab === "gallery"} onClick={() => setTab("gallery")} icon={ImageIcon} label={`Gallery${mediaItems.length ? ` (${mediaItems.length})` : ""}`} />
                </nav>

                {/* Bottom utility block */}
                <div className="space-y-2 border-t border-white/10 p-2.5">
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                      type="button"
                      onClick={() => {
                        fetchData();
                        fetchLocalData();
                      }}
                      disabled={loading}
                      aria-label="Refresh data"
                      className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 font-mono text-[10px] font-semibold uppercase tracking-wider text-white/80 transition-colors hover:bg-white/10 disabled:opacity-50"
                    >
                      <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} strokeWidth={2.25} />
                      Refresh
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-brand-cta font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-cta-fg transition-opacity hover:opacity-90"
                  >
                    <LogOut className="h-3.5 w-3.5" strokeWidth={2.25} />
                    Log Out
                  </button>
                </div>
              </div>

              {/* Main content column */}
              <div className="flex min-w-0 flex-1 flex-col min-h-screen">
                {/* Stats row */}
                {stats && (
                  <div className="grid grid-cols-2 gap-3 border-b border-border bg-background px-5 py-4 sm:grid-cols-4 sm:px-6">
                    <StatCard label="Total Enquiries" value={stats.total} icon={Inbox} accent="navy" description="All time submissions" />
                    <StatCard label="New" value={stats.new} icon={CircleDot} accent="blue" description="Awaiting first contact" />
                    <StatCard label="This Week" value={stats.recent} icon={TrendingUp} accent="amber" description="Last 7 days" />
                    <StatCard label="Today" value={stats.today} icon={Clock} accent="emerald" description="Since midnight" />
                  </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-auto bg-secondary/20">
                  {error && (
                    <div className="m-4">
                      <ErrorBanner message={error} onRetry={fetchData} />
                    </div>
                  )}

                {/* Enquiries tab */}
                {tab === "enquiries" && (
                  <div className="p-4 sm:p-6">
                    <SectionHeading eyebrow="Customer Enquiries" heading="Manage Enquiries." />
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
                                  onClick={() => deleteEnquiry(enq.id, enq.name)}
                                  aria-label="Delete enquiry"
                                  className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive hover:text-white"
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

                {/* Analytics tab */}
                {tab === "analytics" && (
                  <div className="p-4 sm:p-6">
                    <SectionHeading eyebrow="Site Traffic" heading="Analytics Overview." />
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
                            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-destructive hover:text-white"
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
                    <SectionHeading eyebrow="Configuration" heading="Site Settings." />
                    {settingsError && <ErrorBanner message={settingsError} onRetry={fetchSettings} />}
                    <div className="mb-6 grid gap-3 sm:grid-cols-2">
                      {storageStatsError ? (
                        <div className="sm:col-span-2">
                          <ErrorBanner message={storageStatsError} onRetry={fetchStorageStats} />
                        </div>
                      ) : (
                        <>
                          <StorageGauge
                            label="Database"
                            usedMb={storageStats?.db_used_mb ?? null}
                            limitMb={storageStats?.db_limit_mb ?? null}
                            loading={storageStatsLoading && !storageStats}
                          />
                          <StorageGauge
                            label="Images"
                            usedMb={storageStats?.image_used_mb ?? null}
                            limitMb={storageStats?.image_limit_mb ?? null}
                            loading={storageStatsLoading && !storageStats}
                          />
                        </>
                      )}
                    </div>
                    {settingsLoading && settings.length === 0 ? (
                      <EmptyState icon={SettingsIcon} title="Loading settings…" description="Fetching site settings from the API." />
                    ) : (
                      <div className="space-y-3">
                        {SETTINGS_FIELDS.map((field) => {
                          const setting = settings.find((s) => s.key === field.key);
                          const rawValue = setting ? settingValueToText(setting.value) : "";
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
                                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-brand-cta px-3 text-xs font-semibold uppercase tracking-wide text-brand-cta-fg transition-opacity hover:opacity-90 disabled:opacity-40"
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
    <ConfirmDialog state={confirmState} onClose={() => setConfirmState(null)} />
    </div>
  );
}

function SectionHeading({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  return (
    <div className="mb-4">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-brand-cta">{eyebrow}</p>
      <h2 className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-brand-heading">
        {heading}
      </h2>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  description,
}: {
  label: string;
  value: number;
  icon: typeof Inbox;
  accent: "navy" | "blue" | "amber" | "emerald";
  description?: string;
}) {
  const accentClasses = {
    navy: "bg-brand-navy/10 text-brand-navy dark:text-brand-ice",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
  return (
    <div className="rounded-lg border border-border bg-card p-3.5">
      <div className="mb-2 flex items-center justify-between">
        <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-md", accentClasses[accent])}>
          <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
        </span>
      </div>
      <p className="font-display text-3xl font-bold leading-none text-brand-heading">
        {value}
      </p>
      <p className="mt-1.5 truncate font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {description && (
        <p className="mt-0.5 truncate text-[10px] text-muted-foreground/70">{description}</p>
      )}
    </div>
  );
}

function SidebarNavItem({
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
        "relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-colors",
        active
          ? "bg-white/10 text-brand-cta"
          : "text-white/60 hover:bg-white/5 hover:text-white/90",
      )}
    >
      {active && (
        <motion.span
          layoutId="admin-nav-indicator"
          className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-brand-cta"
          transition={{ duration: 0.2 }}
        />
      )}
      <Icon className="h-4 w-4 shrink-0" strokeWidth={2.25} />
      <span className="truncate">{label}</span>
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
  onDelete: (id: string, name: string) => void;
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
      <SectionHeading eyebrow="Product Catalogue" heading="Manage Products." />
      {error && <ErrorBanner message={error} onRetry={onRefresh} />}

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
        {/* Fixed, bounded set of statuses (draft/published/archived) — chips
            per the design system. Category filter above stays a dropdown
            since categories are user-created and can grow unbounded. */}
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by status">
          {(["", ...CATALOGUE_STATUSES] as const).map((s) => (
            <button
              key={s || "all"}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={cn(
                "rounded-full px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-colors",
                statusFilter === s
                  ? "bg-brand-navy text-white"
                  : "border border-border bg-background text-brand-heading hover:bg-secondary",
              )}
            >
              {s || "All"}
            </button>
          ))}
        </div>
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
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-brand-cta px-3 text-xs font-semibold uppercase tracking-wide text-brand-cta-fg transition-opacity hover:opacity-90"
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
                    <span className="rounded-full bg-destructive/15 px-2 py-0.5 font-semibold uppercase tracking-wider text-destructive">
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
                  onClick={() => onDelete(item.id, item.name)}
                  aria-label="Delete product"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive hover:text-white"
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
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const createCategory = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    setCategoryError(null);
    try {
      await adminFetch("/api/admin/catalogue/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      }, "create category");
      setNewName("");
      onRefresh();
    } catch (err) {
      console.error("[admin-dashboard] createCategory failed:", err);
      setCategoryError(errorMessage(err, "create the category"));
    } finally {
      setSaving(false);
    }
  };

  const renameCategory = async (id: string) => {
    if (!editingName.trim()) return;
    try {
      await adminFetch("/api/admin/catalogue/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editingName.trim() }),
      }, "rename category");
      onRefresh();
    } catch (err) {
      console.error("[admin-dashboard] renameCategory failed:", err);
      setCategoryError(errorMessage(err, "rename the category"));
    } finally {
      setEditingId(null);
    }
  };

  const moveCategory = async (id: string, direction: -1 | 1) => {
    const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((c) => c.id === id);
    const swapIdx = idx + direction;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;
    const a = sorted[idx];
    const b = sorted[swapIdx];
    try {
      await Promise.all([
        adminFetch("/api/admin/catalogue/categories", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: a.id, sort_order: b.sort_order }),
        }, "reorder categories"),
        adminFetch("/api/admin/catalogue/categories", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: b.id, sort_order: a.sort_order }),
        }, "reorder categories"),
      ]);
      onRefresh();
    } catch (err) {
      console.error("[admin-dashboard] moveCategory failed:", err);
      setCategoryError(errorMessage(err, "reorder categories"));
    }
  };

  const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="mb-4 rounded-xl border border-border bg-card p-4">
      {categoryError && <ErrorBanner message={categoryError} />}
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
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-cta px-2.5 text-xs font-semibold uppercase tracking-wide text-brand-cta-fg transition-opacity hover:opacity-90 disabled:opacity-40"
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
      console.error("[admin-dashboard] image upload failed:", err);
      setFormError(errorMessage(err, "upload the image"));
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
      console.error("[admin-dashboard] gallery image upload failed:", err);
      setFormError(errorMessage(err, "upload the image"));
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
      await adminFetch("/api/admin/catalogue/items", {
        method: item ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item ? { id: item.id, ...payload, version: item.version } : payload),
      }, item ? "save changes to this product" : "create this product");
      onSaved();
    } catch (err) {
      console.error("[admin-dashboard] save product failed:", err);
      setFormError(errorMessage(err, item ? "save changes" : "create this product"));
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

      {formError && <ErrorBanner message={formError} />}

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
            <button type="button" onClick={() => setFeatures((prev) => prev.filter((_, idx) => idx !== i))} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive hover:text-white">
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
            <button type="button" onClick={() => setSpecs((prev) => prev.filter((_, idx) => idx !== i))} className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive hover:text-white">
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
          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-cta px-4 py-2 text-sm font-semibold uppercase tracking-wide text-brand-cta-fg transition-opacity hover:opacity-90 disabled:opacity-50"
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
  onDeleteMediaItem: (id: string, title: string) => void;
  onDeleteCollection: (id: string, name: string) => void;
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
      await adminFetch("/api/admin/gallery/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: file.name, file_url: url, mime_type: file.type }),
      }, "save this photo to the gallery");
      onRefresh();
    } catch (err) {
      console.error("[admin-dashboard] gallery upload failed:", err);
      setUploadError(errorMessage(err, "upload this file"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <SectionHeading eyebrow="Media Library" heading="Manage Gallery." />
      {(error || uploadError) && <ErrorBanner message={(error || uploadError)!} onRetry={error ? onRefresh : undefined} />}

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
              className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-brand-cta px-2.5 text-xs font-semibold uppercase tracking-wide text-brand-cta-fg transition-opacity hover:opacity-90 disabled:opacity-40"
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
                  onClick={() => onDeleteCollection(c.id, c.name)}
                  aria-label="Delete collection"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive hover:text-white"
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
        <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-brand-cta px-3 text-xs font-semibold uppercase tracking-wide text-brand-cta-fg transition-opacity hover:opacity-90">
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
                onClick={() => onDeleteMediaItem(m.id, m.title)}
                aria-label="Delete media item"
                className="absolute right-1.5 top-1.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100 sm:opacity-100"
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

const CLIENT_MAX_DIMENSION = 1920;
const CLIENT_JPEG_QUALITY = 0.85;

/** Resize to a sane max dimension and re-encode before the file ever leaves
 * the browser. The server re-compresses too, but this keeps upload payloads
 * (and the user's data usage) small on the way in. GIFs are left untouched
 * to avoid dropping animation frames. */
async function compressImageClientSide(file: File): Promise<File> {
  if (file.type === "image/gif" || !file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, CLIENT_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const outputType = file.type === "image/png" || file.type === "image/webp" ? file.type : "image/jpeg";
  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, outputType, outputType === "image/jpeg" ? CLIENT_JPEG_QUALITY : undefined),
  );
  if (!blob) return file;

  return new File([blob], file.name, { type: outputType });
}

function StorageGauge({
  label,
  usedMb,
  limitMb,
  loading,
}: {
  label: string;
  usedMb: number | null;
  limitMb: number | null;
  loading: boolean;
}) {
  const pct = usedMb !== null && limitMb ? Math.min(100, (usedMb / limitMb) * 100) : null;
  const fmt = (mb: number) => (mb >= 1024 ? `${(mb / 1024).toFixed(2)} GB` : `${mb.toFixed(1)} MB`);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        {pct !== null && (
          <span className="font-mono text-[11px] text-muted-foreground">{pct.toFixed(0)}%</span>
        )}
      </div>
      {loading ? (
        <div className="h-2 w-full animate-pulse rounded-full bg-secondary" />
      ) : usedMb === null ? (
        <p className="text-sm text-muted-foreground">Unavailable</p>
      ) : (
        <>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-brand-accent transition-all"
              style={{ width: `${pct ?? 6}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-brand-heading">
            {limitMb ? (
              <>
                {fmt(usedMb)} <span className="text-muted-foreground">/ {fmt(limitMb)} used</span>
              </>
            ) : (
              <>
                {fmt(usedMb)} used
                <span className="ml-1 text-xs text-muted-foreground">
                  — set a storage limit in Settings to see remaining space
                </span>
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
}
