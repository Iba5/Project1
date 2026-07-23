import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ThemeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Canbri Ice \u2014 Cool & Cold | Premium Ice Products in Zimbabwe',
  description: 'Canbri Ice is a leading supplier of premium ice cubes and ice blocks in Harare and Murewa, Zimbabwe. Quality ice products with reliable delivery.',
  keywords: ['ice cubes', 'ice blocks', 'ice supplier', 'Harare', 'Murewa', 'Zimbabwe', 'Canbri Ice'],
  authors: [{ name: 'Canbri Ice' }],
  openGraph: {
    title: 'Canbri Ice \u2014 Cool & Cold',
    description: 'Premium ice cubes and ice blocks delivered throughout Harare and Murewa.',
    type: 'website',
    images: ['/logo.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased bg-background text-foreground`}>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
