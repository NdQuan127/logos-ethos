import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SITE_URL } from '@/lib/constants';
import './fonts.css';
import './globals.css';

const BASE_URL = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Logos & Ethos',
    template: '%s | Logos & Ethos',
  },
  description: 'Về những giới hạn của sự hiểu biết — nơi toán học và triết học cùng đặt câu hỏi cho lý trí.',
  keywords: ['toán học', 'triết học', 'logic', 'Plato', 'Gödel', 'Pascal', 'tư duy', 'khoa học'],
  authors: [{ name: 'Logos & Ethos', url: BASE_URL }],
  creator: 'Logos & Ethos',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: BASE_URL,
    siteName: 'Logos & Ethos',
    title: 'Logos & Ethos',
    description: 'Về những giới hạn của sự hiểu biết — nơi toán học và triết học cùng đặt câu hỏi cho lý trí.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Logos & Ethos',
    description: 'Về những giới hạn của sự hiểu biết.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* theme-color: tints the mobile browser address bar to match the site palette */}
        <meta name="theme-color" content="#F9F7F1" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1C1B1A" media="(prefers-color-scheme: dark)" />

        {/* Preconnect to image CDN — reduces LCP latency for above-the-fold images */}
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://picsum.photos" />

        {/* KaTeX — math formula rendering for MDX blog posts.
            Note: integrity hash omitted — the hash from the KaTeX docs does not
            match the actual file served by jsDelivr for this version, causing the
            browser to block the stylesheet (SRI failure). Removed to unblock
            math rendering. Re-add after verifying the correct hash with:
            `curl -s <url> | openssl dgst -sha384 -binary | base64` */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning className="antialiased selection:bg-[var(--color-academic-yellow)]/30">
        {children}
      </body>
    </html>
  );
}
