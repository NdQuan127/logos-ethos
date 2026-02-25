import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './fonts.css';
import './globals.css';

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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        {/* theme-color: tints the mobile browser address bar to match the site palette */}
        <meta name="theme-color" content="#F9F7F1" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1C1B1A" media="(prefers-color-scheme: dark)" />

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
