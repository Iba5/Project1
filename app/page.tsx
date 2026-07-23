'use client';

import { useEffect } from 'react';
import { useSiteStore } from '@/lib/store';
import { Navbar } from '@/components/website/Navbar';
import { HeroSection } from '@/components/website/HeroSection';
import { AboutSection } from '@/components/website/AboutSection';
import { ProductsSection } from '@/components/website/ProductsSection';
import { GallerySection } from '@/components/website/GallerySection';
import { ContactSection } from '@/components/website/ContactSection';
import { Footer } from '@/components/website/Footer';
import { FloatingButtons } from '@/components/website/FloatingButtons';
import { AdminPanel } from '@/components/admin/AdminPanel';

export default function Home() {
  const { loadData, showAdmin, loaded } = useSiteStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (showAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <GallerySection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
}