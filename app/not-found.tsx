import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang không tồn tại | Logos & Ethos',
  description: 'Rất tiếc, trang bạn đang tìm kiếm không tồn tại.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 font-serif text-center">
      <p className="font-mono text-xs text-[var(--accent-primary)] uppercase tracking-widest mb-4">404</p>
      <h1 className="font-serif text-4xl md:text-6xl text-[var(--foreground)] mb-6 leading-tight font-medium">
        Trang không tồn tại
      </h1>
      <p className="font-sans text-[var(--muted)] text-lg mb-12 max-w-md leading-relaxed">
        Phải chăng trang bạn tìm kiếm đang tồn tại trong một không gian khác của vũ trụ?
      </p>
      <Link
        href="/"
        className="font-mono text-sm uppercase tracking-wider text-[var(--foreground)] hover:text-[var(--accent-primary)] transition-colors flex items-center gap-2"
      >
        ← Quay về trang chủ
      </Link>
    </div>
  );
}
