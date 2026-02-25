import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const EXPLORE_LINKS = [
  { href: '/#tuyen-tap', label: 'Tuyển tập' },
  { href: '/blog', label: 'Tất cả bài viết' },
  { href: '/about', label: 'Về chúng tôi' },
];

const LEGAL_LINKS = [
  { href: '/about#contact', label: 'Liên hệ' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-16 px-6 md:px-12 border-t border-[var(--border-color)] bg-[var(--background)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-4" aria-label="Logos & Ethos — trang chủ">
            <div className="w-6 h-6 bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center font-mono text-xs font-bold rounded-sm" aria-hidden="true">
              L
            </div>
            <span className="font-sans font-bold tracking-tight text-[var(--foreground)] uppercase text-sm">Logos &amp; Ethos</span>
          </Link>
          <p className="font-sans text-xs text-[var(--muted)] leading-relaxed max-w-xs">
            Nơi giao thoa của Toán học &amp; Triết học — vẻ đẹp thuần khiết của logic và chiều sâu tư duy.
          </p>
        </div>

        {/* Explore */}
        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Khám phá</h3>
          {EXPLORE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-sm text-[var(--foreground)] hover:text-[var(--accent-primary)] transition-colors flex items-center gap-1 group w-fit"
            >
              {link.label}
              <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" aria-hidden="true" />
            </Link>
          ))}
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-1">Liên hệ</h3>
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-sm text-[var(--foreground)] hover:text-[var(--accent-primary)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="mailto:contact@logos-ethos.web.app"
            className="font-sans text-sm text-[var(--foreground)] hover:text-[var(--accent-primary)] transition-colors"
          >
            Email
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-[var(--border-color)] flex justify-between items-center">
        <p className="text-[var(--muted)] text-xs font-mono">
          © {currentYear} Logos &amp; Ethos. Mọi quyền được bảo lưu.
        </p>
        <div className="flex gap-2" aria-hidden="true">
          <div className="w-2 h-2 rounded-full bg-[var(--color-academic-red)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-academic-blue)]" />
          <div className="w-2 h-2 rounded-full bg-[var(--color-academic-yellow)]" />
        </div>
      </div>
    </footer>
  );
}
