'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSiteStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  LogOut,
  Settings,
  Package,
  Image as ImageIcon,
  FileText,
  Mail,
  Snowflake,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Check,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import type { Product, GalleryImage, PageSection, ContactSubmission, SiteSettings } from '@/lib/store';

/* Helper: refresh public site data after admin changes */
function refreshSiteData() {
  const store = useSiteStore.getState();
  store.setLoaded(false);
  store.loadData();
}

function AdminLogin({ onLogin }: { onLogin: (token: string, name: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.token, data.admin.name);
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-blue flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200 dark:border-white/10 bg-white dark:bg-surface">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-2 w-12 h-12 rounded-xl bg-ice-blue/10 flex items-center justify-center">
            <Snowflake className="h-6 w-6 text-ice-blue" />
          </div>
          <CardTitle className="text-dark-blue dark:text-white">Canbri Ice CMS</CardTitle>
          <p className="text-sm text-muted-foreground">Sign in to manage your website</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aemail">Email</Label>
              <Input
                id="aemail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apass">Password</Label>
              <Input
                id="apass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-dark-blue hover:bg-medium-blue rounded-full font-semibold">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---- SETTINGS TAB ---- */
function SettingsTab() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = useSiteStore.getState().adminToken;
    try {
      const res = await fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setSettings(data.settings);
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!settings) return;
    const token = useSiteStore.getState().adminToken;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success('Settings saved');
        refreshSiteData();
      }
    } catch { toast.error('Failed to save'); }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (!settings) return <div className="p-8 text-center text-muted-foreground">Failed to load settings</div>;

  const fields = [
    { key: 'company_name', label: 'Company Name' },
    { key: 'slogan', label: 'Slogan' },
    { key: 'whatsapp_number', label: 'WhatsApp Number' },
    { key: 'phone_number', label: 'Phone Number' },
    { key: 'facebook_url', label: 'Facebook URL' },
    { key: 'instagram_url', label: 'Instagram URL' },
    { key: 'delivery_areas', label: 'Delivery Areas' },
    { key: 'google_maps_embed', label: 'Google Maps Embed Code' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-dark-blue dark:text-white">Site Settings</h2>
        <Button onClick={save} className="bg-dark-blue hover:bg-medium-blue rounded-full">
          Save Changes
        </Button>
      </div>
      <div className="grid gap-4">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label className="text-dark-blue dark:text-white font-medium text-sm">{f.label}</Label>
            {f.key === 'delivery_areas' || f.key === 'google_maps_embed' ? (
              <Textarea
                value={settings[f.key] || ''}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                rows={f.key === 'google_maps_embed' ? 4 : 2}
                className="border-slate-200 dark:border-white/10 bg-white dark:bg-surface text-foreground"
              />
            ) : (
              <Input
                value={settings[f.key] || ''}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                className="border-slate-200 dark:border-white/10 bg-white dark:bg-surface text-foreground"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- PAGES TAB ---- */
function PagesTab() {
  const [pages, setPages] = useState<PageSection[]>([]);
  const [editing, setEditing] = useState<PageSection | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = useSiteStore.getState().adminToken;
    try {
      const res = await fetch('/api/admin/pages', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setPages(data.pages);
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    const token = useSiteStore.getState().adminToken;
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(editing),
      });
      if (res.ok) {
        toast.success('Page saved');
        load();
        setEditing(null);
        refreshSiteData();
      }
    } catch { toast.error('Failed to save'); }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-dark-blue dark:text-white">Page Content</h2>
      <p className="text-sm text-muted-foreground">Edit the content displayed on each section of the website.</p>
      <div className="grid gap-3">
        {pages.map((page) => (
          <Card key={page.section} className="border-slate-200 dark:border-white/10 bg-white dark:bg-surface">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold text-dark-blue dark:text-white capitalize">{page.section}</p>
                <p className="text-sm text-muted-foreground">{page.title}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setEditing({ ...page })}
              >
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-surface border-slate-200 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="text-dark-blue dark:text-white capitalize">Edit {editing?.section} Section</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Subtitle</Label>
                <Input value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Content</Label>
                <Textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={8} />
              </div>
              <div className="space-y-1.5">
                <Label>Image URL</Label>
                <Input value={editing.imageUrl} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
              <Button onClick={save} className="w-full bg-dark-blue hover:bg-medium-blue rounded-full">
                Save Section
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---- PRODUCTS TAB ---- */
function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = useSiteStore.getState().adminToken;
    try {
      const res = await fetch('/api/admin/products', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setProducts(data.products);
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const getToken = () => useSiteStore.getState().adminToken || '';

  const handleSave = async () => {
    if (!editing?.name || !editing?.slug) {
      toast.error('Name and slug are required');
      return;
    }
    try {
      if (editing.id) {
        const res = await fetch(`/api/admin/products/${editing.id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(editing),
        });
        if (res.ok) toast.success('Product updated');
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(editing),
        });
        if (res.ok) toast.success('Product created');
      }
      load();
      setDialogOpen(false);
      setEditing(null);
      refreshSiteData();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        toast.success('Product deleted');
        load();
        refreshSiteData();
      }
    } catch { toast.error('Failed to delete'); }
  };

  const toggleActive = async (product: Product) => {
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !product.active }),
      });
      load();
    } catch { /* */ }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-dark-blue dark:text-white">Products</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-dark-blue hover:bg-medium-blue rounded-full"
              onClick={() => setEditing({ name: '', slug: '', description: '', imageUrl: '', featured: false, active: true, sortOrder: 0 })}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-surface border-slate-200 dark:border-white/10">
            <DialogHeader>
              <DialogTitle className="text-dark-blue dark:text-white">
                {editing?.id ? 'Edit Product' : 'New Product'}
              </DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Name</Label>
                    <Input value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Slug</Label>
                    <Input value={editing.slug || ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="ice-cubes" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={6} />
                </div>
                <div className="space-y-1.5">
                  <Label>Image URL</Label>
                  <Input value={editing.imageUrl || ''} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} placeholder="https://..." />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label>Sort Order</Label>
                    <Input type="number" value={editing.sortOrder || 0} onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch checked={editing.featured || false} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} />
                    <Label>Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch checked={editing.active ?? true} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
                    <Label>Active</Label>
                  </div>
                </div>
                <Button onClick={handleSave} className="w-full bg-dark-blue hover:bg-medium-blue rounded-full">
                  {editing.id ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3">
        {products.map((p) => (
          <Card key={p.id} className="border-slate-200 dark:border-white/10 bg-white dark:bg-surface">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-dark-blue dark:text-white truncate">{p.name}</p>
                  <Badge variant={p.active ? 'default' : 'secondary'} className={p.active ? 'bg-green-100 text-green-700' : ''}>
                    {p.active ? 'Active' : 'Inactive'}
                  </Badge>
                  {p.featured && <Badge className="bg-ice-blue/20 text-dark-blue">Featured</Badge>}
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{p.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={p.active} onCheckedChange={() => toggleActive(p)} />
                <Button variant="ghost" size="sm" onClick={() => { setEditing({ ...p }); setDialogOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(p.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---- GALLERY TAB ---- */
function GalleryTab() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<GalleryImage> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = useSiteStore.getState().adminToken;
    try {
      const res = await fetch('/api/admin/gallery', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setImages(data.images);
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const tk = () => useSiteStore.getState().adminToken || '';

  const handleSave = async () => {
    if (!editing?.imageUrl) {
      toast.error('Image URL is required');
      return;
    }
    try {
      if (editing.id) {
        await fetch(`/api/admin/gallery/${editing.id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${tk()}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(editing),
        });
        toast.success('Image updated');
      } else {
        await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { Authorization: `Bearer ${tk()}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(editing),
        });
        toast.success('Image added');
      }
      load();
      setDialogOpen(false);
      setEditing(null);
      refreshSiteData();
    } catch { toast.error('Failed to save'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${tk()}` },
      });
      toast.success('Image deleted');
      load();
      refreshSiteData();
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-dark-blue dark:text-white">Gallery</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-dark-blue hover:bg-medium-blue rounded-full"
              onClick={() => setEditing({ title: '', description: '', imageUrl: '', sortOrder: 0 })}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-surface border-slate-200 dark:border-white/10">
            <DialogHeader>
              <DialogTitle className="text-dark-blue dark:text-white">{editing?.id ? 'Edit Image' : 'Add Image'}</DialogTitle>
            </DialogHeader>
            {editing && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Image URL</Label>
                  <Input value={editing.imageUrl || ''} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} placeholder="https://..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} />
                </div>
                <div className="space-y-1.5">
                  <Label>Sort Order</Label>
                  <Input type="number" value={editing.sortOrder || 0} onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })} />
                </div>
                <Button onClick={handleSave} className="w-full bg-dark-blue hover:bg-medium-blue rounded-full">
                  {editing.id ? 'Update' : 'Add Image'}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-3 text-ice-blue/30" />
          <p>No gallery images yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden aspect-square bg-slate-100 dark:bg-white/5">
              {img.imageUrl ? (
                <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-ice-blue/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-dark-blue/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="secondary" size="sm" className="rounded-full" onClick={() => { setEditing({ ...img }); setDialogOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="secondary" size="sm" className="rounded-full text-red-500" onClick={() => handleDelete(img.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- CONTACT SUBMISSIONS TAB ---- */
function ContactTab() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = useSiteStore.getState().adminToken;
    try {
      const res = await fetch('/api/admin/contact', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setSubmissions(data.submissions);
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const tk = () => useSiteStore.getState().adminToken || '';

  const markRead = async (id: string) => {
    await fetch('/api/admin/contact', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tk()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read: true }),
    });
    load();
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/admin/contact?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tk()}` },
    });
    toast.success('Message deleted');
    load();
  };

  const unread = submissions.filter((s) => !s.read).length;

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-dark-blue dark:text-white">Messages</h2>
          {unread > 0 && <Badge className="bg-ice-blue text-dark-blue">{unread} new</Badge>}
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Mail className="h-12 w-12 mx-auto mb-3 text-ice-blue/30" />
          <p>No messages yet</p>
        </div>
      ) : (
        <div className="grid gap-3 max-h-96 overflow-y-auto custom-scrollbar">
          {submissions.map((s) => (
            <Card key={s.id} className={`border-slate-200 dark:border-white/10 bg-white dark:bg-surface ${!s.read ? 'bg-ice-blue/5 dark:bg-ice-blue/5' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-dark-blue dark:text-white text-sm">{s.name}</p>
                      {!s.read && <span className="w-2 h-2 rounded-full bg-ice-blue flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{s.email} {s.phone && `· ${s.phone}`}</p>
                    <p className="text-sm text-foreground/80 mt-2">{s.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(s.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    {!s.read && (
                      <Button variant="ghost" size="sm" onClick={() => markRead(s.id)} title="Mark as read">
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => deleteSubmission(s.id)} title="Delete">
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- MAIN ADMIN PANEL ---- */
export function AdminPanel() {
  const { adminToken, adminName, setAdminAuth, setShowAdmin } = useSiteStore();

  if (!adminToken) {
    return (
      <div className="fixed inset-0 z-[100] bg-background">
        <AdminLogin onLogin={(token, name) => setAdminAuth(token, name)} />
      </div>
    );
  }

  const handleLogout = () => {
    setAdminAuth(null, null);
    setShowAdmin(false);
    toast.success('Logged out');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-dark-blue flex flex-col">
      {/* Admin header */}
      <header className="bg-dark-blue text-white px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Snowflake className="h-6 w-6 text-ice-blue" />
          <span className="font-bold">Canbri Ice CMS</span>
          <Badge variant="outline" className="border-white/20 text-white/60 text-xs">{adminName}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setShowAdmin(false)}
          >
            <Eye className="h-4 w-4 mr-1" /> View Site
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="pages" className="h-full flex flex-col">
          <div className="border-b border-slate-200 dark:border-white/10 px-6 flex-shrink-0 bg-white dark:bg-surface">
            <TabsList className="bg-transparent h-auto p-0 gap-0">
              {[
                { value: 'pages', icon: FileText, label: 'Page Content' },
                { value: 'products', icon: Package, label: 'Products' },
                { value: 'gallery', icon: ImageIcon, label: 'Gallery' },
                { value: 'settings', icon: Settings, label: 'Settings' },
                { value: 'contact', icon: Mail, label: 'Messages' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-ice-blue data-[state=active]:text-dark-blue data-[state=active]:shadow-none px-4 py-3 text-muted-foreground"
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-6 max-w-4xl mx-auto w-full">
              <TabsContent value="pages"><PagesTab /></TabsContent>
              <TabsContent value="products"><ProductsTab /></TabsContent>
              <TabsContent value="gallery"><GalleryTab /></TabsContent>
              <TabsContent value="settings"><SettingsTab /></TabsContent>
              <TabsContent value="contact"><ContactTab /></TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}
