import { create } from 'zustand';

export interface SiteSettings {
  company_name: string;
  slogan: string;
  whatsapp_number: string;
  phone_number: string;
  facebook_url: string;
  instagram_url: string;
  delivery_areas: string;
  google_maps_embed: string;
  [key: string]: string;
}

export interface PageSection {
  id: string;
  section: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  featured: boolean;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface SiteState {
  settings: SiteSettings;
  sections: PageSection[];
  products: Product[];
  gallery: GalleryImage[];
  loaded: boolean;
  activeSection: string;
  adminToken: string | null;
  adminName: string | null;
  showAdmin: boolean;
  setActiveSection: (s: string) => void;
  setLoaded: (v: boolean) => void;
  setAdminAuth: (token: string | null, name: string | null) => void;
  setShowAdmin: (v: boolean) => void;
  loadData: () => Promise<void>;
}

export const useSiteStore = create<SiteState>((set, get) => ({
  settings: {
    company_name: 'Canbri Ice',
    slogan: 'Cool & Cold',
    whatsapp_number: '',
    phone_number: '',
    facebook_url: '',
    instagram_url: '',
    delivery_areas: '',
    google_maps_embed: '',
  },
  sections: [],
  products: [],
  gallery: [],
  loaded: false,
  activeSection: 'home',
  adminToken: typeof window !== 'undefined' ? localStorage.getItem('canbri_admin_token') : null,
  adminName: typeof window !== 'undefined' ? localStorage.getItem('canbri_admin_name') : null,
  showAdmin: false,
  setActiveSection: (s) => set({ activeSection: s }),
  setLoaded: (v) => set({ loaded: v }),
  setAdminAuth: (token, name) => {
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('canbri_admin_token', token);
        localStorage.setItem('canbri_admin_name', name || '');
      } else {
        localStorage.removeItem('canbri_admin_token');
        localStorage.removeItem('canbri_admin_name');
      }
    }
    set({ adminToken: token, adminName: name });
  },
  setShowAdmin: (v) => set({ showAdmin: v }),
  loadData: async () => {
    try {
      const res = await fetch('/api/public/data');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      set({
        settings: { ...get().settings, ...data.settings },
        sections: data.sections,
        products: data.products,
        gallery: data.gallery,
        loaded: true,
      });
    } catch (e) {
      console.error('Failed to load site data:', e);
      // Still mark as loaded so content with fallbacks shows
      set({ loaded: true });
    }
  },
}));