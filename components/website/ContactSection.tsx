'use client';

import { useState } from 'react';
import { useSiteStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock, ArrowUpRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useReveal } from '@/hooks/use-reveal';

/* Strip all attributes from <iframe> except safe ones to prevent XSS */
const ALLOWED_ATTRS = new Set(['src', 'width', 'height', 'frameborder', 'style', 'loading', 'referrerpolicy', 'title', 'allowfullscreen']);
function sanitizeIframe(html: string): string {
  return html.replace(/<iframe([^>]*)>/gi, (_match, attrs: string) => {
    const clean = attrs
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')  // strip event handlers
      .split(/\s+/)
      .filter((attr) => {
        const name = attr.split('=')[0].toLowerCase();
        return ALLOWED_ATTRS.has(name) && !name.startsWith('on');
      })
      .join(' ');
    return `<iframe${clean}>`;
  });
}

export function ContactSection() {
  const { sections, settings } = useSiteStore();
  const contactSection = sections.find((s) => s.section === 'contact');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const ref = useReveal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        toast.success('Message sent successfully!');
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error('Failed to send message.');
      }
    } catch {
      toast.error('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="section-contact" className="py-24 md:py-32 bg-slate-50 dark:bg-medium-blue relative">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-5 reveal">
            <span className="section-line" />
            <span className="text-ice-blue/80 dark:text-ice-blue/70 text-[11px] font-semibold tracking-[0.2em] uppercase">
              {contactSection?.subtitle || 'Get in Touch'}
            </span>
          </div>
          <div className="grid md:grid-cols-12 gap-8">
            <h2 className="md:col-span-5 text-3xl md:text-4xl font-bold text-dark-blue dark:text-white leading-tight tracking-tight reveal reveal-delay-1">
              {contactSection?.title || 'Contact Us'}
            </h2>
            <p className="md:col-span-7 text-slate-500 dark:text-white/35 text-[15px] leading-relaxed pt-1 reveal reveal-delay-2">
              {contactSection?.content?.split('.').slice(0, 2).join('.').trim() || ''}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left — info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
              {[
                { icon: MapPin, label: 'Locations', value: 'Harare & Murewa, Zimbabwe' },
                { icon: Phone, label: 'Phone', value: settings.phone_number || 'Contact for number', action: settings.phone_number ? `tel:${settings.phone_number}` : null },
                { icon: Mail, label: 'Email', value: 'info@canbriice.co.zw', action: 'mailto:info@canbriice.co.zw' },
                { icon: Clock, label: 'Hours', value: 'Mon \u2013 Sat, 6AM \u2013 6PM' },
              ].map((item, i) => (
                <div key={item.label} className={`group reveal reveal-delay-${Math.min(i + 1, 4)}`}>
                  <p className="text-slate-400 dark:text-white/20 text-[10px] font-semibold tracking-[0.2em] uppercase mb-1.5">{item.label}</p>
                  {item.action ? (
                    <a href={item.action} className="text-slate-600 dark:text-white/70 hover:text-ice-blue text-sm font-medium transition-colors duration-300 inline-flex items-center gap-1.5 group-hover:gap-2.5">
                      {item.value}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </a>
                  ) : (
                    <p className="text-slate-600 dark:text-white/70 text-sm font-medium">{item.value}</p>
                  )}
                </div>
              ))}
            </div>

            {settings.delivery_areas && (
              <div className="border border-slate-200 dark:border-white/5 hover:border-ice-blue/10 dark:hover:border-ice-blue/10 rounded-md p-4 bg-white dark:bg-transparent transition-colors duration-300 reveal">
                <p className="text-slate-400 dark:text-white/25 text-xs font-medium tracking-wide">Delivery</p>
                <p className="text-slate-500 dark:text-white/50 text-sm mt-1">{settings.delivery_areas}</p>
              </div>
            )}
          </div>

          {/* Right — form */}
          <div className="lg:col-span-8">
            {sent ? (
              <div className="border border-slate-200 dark:border-white/5 rounded-md p-12 text-center bg-white dark:bg-transparent reveal">
                <CheckCircle className="h-10 w-10 text-ice-blue/60 mx-auto mb-4" />
                <p className="text-dark-blue dark:text-white text-lg font-semibold mb-1">Message Sent</p>
                <p className="text-slate-400 dark:text-white/30 text-sm mb-6">We\u2019ll get back to you shortly.</p>
                <Button
                  onClick={() => setSent(false)}
                  variant="outline"
                  className="border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/60 hover:text-ice-blue hover:border-ice-blue/30 rounded-md text-xs transition-colors duration-300"
                >
                  Send Another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 reveal reveal-delay-2">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="cname" className="text-slate-400 dark:text-white/30 text-[10px] font-semibold tracking-[0.15em] uppercase">
                      Name <span className="text-ice-blue">*</span>
                    </Label>
                    <Input
                      id="cname"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="border-slate-200 dark:border-white/5 bg-white dark:bg-surface text-dark-blue dark:text-white placeholder:text-slate-300 dark:placeholder:text-white/15 focus:border-ice-blue/30 hover:border-slate-300 dark:hover:border-white/10 h-11 rounded-md text-sm transition-colors duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cemail" className="text-slate-400 dark:text-white/30 text-[10px] font-semibold tracking-[0.15em] uppercase">
                      Email <span className="text-ice-blue">*</span>
                    </Label>
                    <Input
                      id="cemail"
                      type="email"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="border-slate-200 dark:border-white/5 bg-white dark:bg-surface text-dark-blue dark:text-white placeholder:text-slate-300 dark:placeholder:text-white/15 focus:border-ice-blue/30 hover:border-slate-300 dark:hover:border-white/10 h-11 rounded-md text-sm transition-colors duration-300"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cphone" className="text-slate-400 dark:text-white/30 text-[10px] font-semibold tracking-[0.15em] uppercase">Phone</Label>
                  <Input
                    id="cphone"
                    type="tel"
                    placeholder="+263 ..."
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="border-slate-200 dark:border-white/5 bg-white dark:bg-surface text-dark-blue dark:text-white placeholder:text-slate-300 dark:placeholder:text-white/15 focus:border-ice-blue/30 hover:border-slate-300 dark:hover:border-white/10 h-11 rounded-md text-sm transition-colors duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cmsg" className="text-slate-400 dark:text-white/30 text-[10px] font-semibold tracking-[0.15em] uppercase">
                    Message <span className="text-ice-blue">*</span>
                  </Label>
                  <Textarea
                    id="cmsg"
                    placeholder="Tell us what you need \u2014 product, quantity, delivery location..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="border-slate-200 dark:border-white/5 bg-white dark:bg-surface text-dark-blue dark:text-white placeholder:text-slate-300 dark:placeholder:text-white/15 focus:border-ice-blue/30 hover:border-slate-300 dark:hover:border-white/10 resize-none rounded-md text-sm transition-colors duration-300"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-dark-blue dark:bg-ice-blue text-white dark:text-dark-blue hover:bg-dark-blue/90 dark:hover:bg-light-ice font-semibold rounded-md h-11 px-8 text-sm transition-all duration-300 hover:shadow-lg dark:hover:shadow-[0_0_24px_rgba(126,200,227,0.15)]"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}

            {/* Maps placeholder */}
            <div className="mt-10 border border-dashed border-slate-200 dark:border-white/5 rounded-md h-56 flex items-center justify-center hover:border-slate-300 dark:hover:border-white/10 bg-white dark:bg-transparent transition-colors duration-300 reveal">
              {settings.google_maps_embed && /^<iframe/i.test(settings.google_maps_embed.trim()) ? (
                <div dangerouslySetInnerHTML={{ __html: sanitizeIframe(settings.google_maps_embed) }} className="w-full h-full" />
              ) : settings.google_maps_embed ? (
                <div className="text-center">
                  <MapPin className="h-5 w-5 mx-auto mb-2 text-slate-300 dark:text-white/10" />
                  <p className="text-slate-300 dark:text-white/15 text-xs">Invalid embed code - must start with an iframe tag</p>
                </div>
              ) : (
                <div className="text-center">
                  <MapPin className="h-5 w-5 mx-auto mb-2 text-slate-300 dark:text-white/10" />
                  <p className="text-slate-300 dark:text-white/15 text-xs">Google Maps \u2014 to be added</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
