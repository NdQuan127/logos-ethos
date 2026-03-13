import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nghịch lý 404 | Logos & Ethos',
  description: 'Sự hiện diện của thứ gì đó không tồn tại.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 font-serif text-center relative overflow-hidden bg-[var(--background)]">
      {/* Decorative mathematical symbols drifting in background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] select-none pointer-events-none" aria-hidden="true">
        <span className="absolute top-[20%] left-[10%] text-9xl">∄</span>
        <span className="absolute bottom-[20%] right-[10%] text-9xl">∅</span>
        <span className="absolute top-[40%] right-[15%] text-7xl">∞</span>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Large stylized 404 that looks like a geometric construction */}
        <div className="relative mb-12">
          <span className="font-serif text-[12rem] md:text-[18rem] leading-none text-[var(--foreground)] opacity-[0.04] font-bold select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-px h-64 bg-gradient-to-b from-transparent via-[var(--accent-primary)]/40 to-transparent rotate-45" />
             <div className="w-px h-64 bg-gradient-to-b from-transparent via-[var(--accent-primary)]/40 to-transparent -rotate-45" />
          </div>
        </div>

        <p className="font-mono text-[11px] text-[var(--accent-primary)] uppercase tracking-[0.3em] mb-4 font-semibold">
          Nghịch lý sự vắng mặt
        </p>
        
        <h1 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-6 leading-tight font-medium max-w-lg">
          Trang bạn tìm kiếm không có trong không gian này
        </h1>
        
        <p className="font-sans text-[var(--muted)] text-lg mb-12 max-w-md leading-relaxed">
          Có lẽ nó đã bị triệt tiêu bởi một mệnh đề Logic sai lầm, hoặc đơn giản là chưa bao giờ tồn tại.
        </p>
        
        <Link
          href="/"
          className="group px-8 py-3 bg-[var(--foreground)] text-[var(--background)] font-mono text-xs uppercase tracking-[0.2em] rounded-sm hover:scale-105 transition-all duration-300 shadow-xl flex items-center gap-3"
        >
          <span>Về miền thực tại</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
