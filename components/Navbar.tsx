'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NavbarProps {
  backLink?: { href: string; label: string };
}

const NAV_LINKS = [
  { href: '/#tuyen-tap', label: 'Tuyển tập' },
  { href: '/blog', label: 'Bài viết' },
  { href: '/about', label: 'Về chúng tôi' },
];

export function Navbar({ backLink }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Close menu on Escape, return focus to trigger
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        closeMenu();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen, closeMenu]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Focus first nav link when menu opens
  useEffect(() => {
    if (menuOpen) {
      const firstLink = menuRef.current?.querySelector('a');
      setTimeout(() => (firstLink as HTMLElement | null)?.focus(), 50);
    }
  }, [menuOpen]);

  return (
    <>
      {/* Skip to content — visible only on focus */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--accent-primary)] focus:text-white focus:rounded-sm focus:font-mono focus:text-xs"
      >
        Chuyển đến nội dung chính
      </a>

      {/* z-50 keeps navbar above all content */}
      <nav
        className="w-full py-5 px-6 md:px-12 flex justify-between items-center z-50 border-b border-[var(--border-color)] bg-[var(--background)]/90 dark:bg-[var(--surface-raised)]/90 backdrop-blur-md sticky top-0 transition-colors duration-300"
        role="navigation"
        aria-label="Navigation chính"
      >
        {/* Left: Logo or Back button */}
        <div className="flex items-center gap-3">
          {backLink ? (
            <Link
              href={backLink.href}
              className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors group font-sans text-sm font-medium"
              aria-label={`Quay lại ${backLink.label}`}
            >
              <span aria-hidden="true" className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
              <span>{backLink.label}</span>
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-3" aria-label="Logos & Ethos — trang chủ">
              <div className="w-6 h-6 bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center font-mono text-xs font-bold rounded-sm" aria-hidden="true">
                L
              </div>
              <span className="font-sans font-bold tracking-tight text-[var(--foreground)] uppercase text-sm">Logos &amp; Ethos</span>
            </Link>
          )}
        </div>

        {/* Center: Desktop nav — hidden on mobile */}
        {!backLink && (
          <div className="hidden md:flex gap-8 font-sans text-sm font-medium text-[var(--muted)]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[var(--accent-primary)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-1 text-[var(--foreground)]">
          <ThemeToggle />

          {/* Mobile hamburger — only shown when no backLink */}
          {!backLink && (
            <button
              ref={triggerRef}
              className="md:hidden p-2 hover:bg-[var(--foreground)]/5 rounded-full transition-colors"
              aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {/* Animated hamburger/close icon */}
              <span className="relative block w-[18px] h-[18px]">
                <Menu
                  size={18}
                  aria-hidden="true"
                  className={`absolute inset-0 transition-all duration-300 ${menuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`}
                />
                <X
                  size={18}
                  aria-hidden="true"
                  className={`absolute inset-0 transition-all duration-300 ${menuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`}
                />
              </span>
            </button>
          )}

          {/* Logo badge for backLink pages */}
          {backLink && (
            <Link href="/" aria-label="Logos & Ethos — trang chủ">
              <div className="w-6 h-6 bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center font-mono text-xs font-bold rounded-sm" aria-hidden="true">
                L
              </div>
            </Link>
          )}
        </div>
      </nav>

      {/* ── Mobile drawer (Idea #8) — always in DOM, slide-in/out via CSS ── */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${menuOpen ? 'visible' : 'invisible pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
        aria-hidden={!menuOpen}
      >
        {/* Backdrop — fade in/out */}
        <div
          className={`absolute inset-0 bg-[var(--foreground)]/30 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeMenu}
          aria-hidden="true"
        />

        {/* Panel — slide in/out from right */}
        <div
          ref={menuRef}
          className={`absolute top-0 right-0 h-full w-72 bg-[var(--background)] border-l border-[var(--border-color)] p-8 flex flex-col gap-8 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex justify-between items-center">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">Menu</span>
            <button
              onClick={() => {
                closeMenu();
                triggerRef.current?.focus();
              }}
              className="p-2 hover:bg-[var(--foreground)]/5 rounded-full transition-colors"
              aria-label="Đóng menu"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <nav className="flex flex-col gap-6" aria-label="Menu điều hướng di động">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                style={{
                  transitionDelay: menuOpen ? `${i * 60 + 80}ms` : '0ms',
                }}
                className={`font-serif text-2xl text-[var(--foreground)] hover:text-[var(--accent-primary)] transition-all duration-300 focus:outline-none focus:text-[var(--accent-primary)] ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
