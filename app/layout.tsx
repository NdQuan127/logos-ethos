import type { Metadata } from 'next';
import { Crimson_Pro, Be_Vietnam_Pro, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const crimsonPro = Crimson_Pro({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-serif',
  weight: ['200', '300', '400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const ibmMono = IBM_Plex_Mono({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const BASE_URL = 'https://logos-ethos.web.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Logos & Ethos | Toán học & Triết học',
    template: '%s | Logos & Ethos',
  },
  description: 'Khám phá vẻ đẹp thuần khiết của Logic và chiều sâu của tư duy — nơi Toán học và Triết học gặp nhau.',
  keywords: ['toán học', 'triết học', 'logic', 'Plato', 'Gödel', 'Pascal', 'tư duy', 'khoa học'],
  authors: [{ name: 'Logos & Ethos', url: BASE_URL }],
  creator: 'Logos & Ethos',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: BASE_URL,
    siteName: 'Logos & Ethos',
    title: 'Logos & Ethos | Toán học & Triết học',
    description: 'Khám phá vẻ đẹp thuần khiết của Logic và chiều sâu của tư duy.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Logos & Ethos',
    description: 'Nơi Toán học và Triết học gặp nhau.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${crimsonPro.variable} ${beVietnamPro.variable} ${ibmMono.variable}`}>
      <head>
        {/* Preconnect to image CDN — reduces LCP latency for above-the-fold images */}
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
      </head>
      <body suppressHydrationWarning className="antialiased selection:bg-[var(--color-academic-yellow)]/30">
        {children}
      </body>
    </html>
  );
}
