'use client';

import React from 'react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 font-serif text-center">
      <p className="font-mono text-xs text-[var(--color-academic-red)] uppercase tracking-widest mb-4">
        Lỗi hệ thống
      </p>
      <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-6 leading-tight font-medium">
        Đã xảy ra lỗi
      </h1>
      <p className="font-sans text-[var(--muted)] text-base mb-4 max-w-md leading-relaxed">
        {error.message || 'Một lỗi không mong đợi đã xảy ra.'}
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-[var(--muted)] mb-8">Mã lỗi: {error.digest}</p>
      )}
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="font-mono text-sm uppercase tracking-wider text-white bg-[var(--accent-primary)] px-4 py-2 hover:opacity-80 transition-opacity"
        >
          Thử lại
        </button>
        <Link
          href="/"
          className="font-mono text-sm uppercase tracking-wider text-[var(--foreground)] border border-[var(--border-color)] px-4 py-2 hover:text-[var(--accent-primary)] transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
