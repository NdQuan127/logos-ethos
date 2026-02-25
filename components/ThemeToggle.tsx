'use client';

import React, { useSyncExternalStore, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';

// ─── Theme Store ───────────────────────────────────────────────────────────────
// We use useSyncExternalStore so React reads theme state without setState-in-effect.
// The "external system" is the <html> class list + localStorage.

function getThemeSnapshot(): boolean {
  // Returns true if dark mode is currently active
  return document.documentElement.classList.contains('dark');
}

function getThemeServerSnapshot(): boolean {
  return false; // default light on server
}

function applyTheme(dark: boolean): void {
  document.documentElement.classList.toggle('dark', dark);
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  } catch { /* private browsing */ }
}

/**
 * Initialize theme from localStorage / system preference.
 * Called once as a module side-effect on the client — runs before first paint.
 * A <script> in _document would be ideal, but this is the next-best approach
 * without a custom _document in App Router.
 */
let themeInitialized = false;
function initTheme(): void {
  if (typeof window === 'undefined' || themeInitialized) return;
  themeInitialized = true;

  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const dark = stored === 'dark' || (stored === null && prefersDark);
  applyTheme(dark);
}

// Initialise synchronously when module is loaded on client
if (typeof window !== 'undefined') initTheme();

// ─── useSyncExternalStore subscription ────────────────────────────────────────
let themeListeners: Array<() => void> = [];

function subscribeTheme(listener: () => void): () => void {
  themeListeners = [...themeListeners, listener];
  return () => { themeListeners = themeListeners.filter((l) => l !== listener); };
}

function emitThemeChange(): void {
  for (const l of themeListeners) l();
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);

  const toggleTheme = useCallback(() => {
    applyTheme(!isDark);
    emitThemeChange();
  }, [isDark]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-[var(--foreground)]/5 transition-colors text-[var(--foreground)]"
      aria-label={isDark ? 'Bật chế độ sáng' : 'Bật chế độ tối'}
    >
      {/* CSS rotation replaces motion.div — same visual effect, zero JS overhead */}
      <span
        className="block transition-transform duration-500 ease-in-out"
        style={{ transform: isDark ? 'rotate(180deg)' : 'rotate(0deg)' }}
        aria-hidden="true"
      >
        {isDark ? <Moon size={20} /> : <Sun size={20} />}
      </span>
    </button>
  );
}
