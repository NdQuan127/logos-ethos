'use client';

import React, { useCallback } from 'react';
import { useSyncExternalStore } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

const STORAGE_KEY = 'logos-ethos-bookmarks';

// ─── External Store ────────────────────────────────────────────────────────────
// useSyncExternalStore requires `getSnapshot` to return the SAME reference
// if the data has not changed. JSON.parse always creates a new array, so we
// cache the last serialized value and only replace the reference on real changes.

let cachedJson = '[]';
let cachedBookmarks: string[] = [];

function readStorage(): string[] {
  const raw = localStorage.getItem(STORAGE_KEY) ?? '[]';
  if (raw !== cachedJson) {
    cachedJson = raw;
    try {
      cachedBookmarks = JSON.parse(raw);
    } catch {
      cachedBookmarks = [];
    }
  }
  return cachedBookmarks;
}

function getSnapshot(): string[] {
  return readStorage();
}

function getServerSnapshot(): string[] {
  return cachedBookmarks; // stable empty array on server
}

let listeners: Array<() => void> = [];

function subscribe(listener: () => void): () => void {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function emitChange(): void {
  for (const listener of listeners) listener();
}

function toggleBookmark(slug: string): void {
  const current = readStorage();
  const updated = current.includes(slug)
    ? current.filter((b) => b !== slug)
    : [...current, slug];

  const serialized = JSON.stringify(updated);
  try {
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // localStorage unavailable (private browsing, storage full, etc.)
    return;
  }
  // Update cache synchronously before notifying listeners so the next
  // getSnapshot call sees the new value with a stable reference.
  cachedJson = serialized;
  cachedBookmarks = updated;
  emitChange();
}

// ─── Component ─────────────────────────────────────────────────────────────────

interface BookmarkButtonProps {
  slug: string;
}

export function BookmarkButton({ slug }: BookmarkButtonProps) {
  const bookmarks = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const saved = bookmarks.includes(slug);

  const handleClick = useCallback(() => toggleBookmark(slug), [slug]);

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 hover:text-[var(--accent-primary)] transition-colors"
      aria-label={saved ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
      aria-pressed={saved}
    >
      {saved ? (
        <>
          <BookmarkCheck size={16} className="text-[var(--accent-primary)]" aria-hidden="true" />
          <span>Đã lưu</span>
        </>
      ) : (
        <>
          <Bookmark size={16} aria-hidden="true" />
          <span>Lưu</span>
        </>
      )}
    </button>
  );
}
