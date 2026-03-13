import React from 'react';
import Link from 'next/link';
import { Grid, Circle, Triangle } from 'lucide-react';

export function HeroSection() {
  return (
    <header className="relative w-full py-24 md:py-32 px-6 md:px-12 border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 animate-fade-in-up">

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] text-[var(--foreground)] mb-8 font-medium tracking-tight">
              <span className="italic block text-[var(--muted)] font-light">Về những giới hạn của</span>
              Sự hiểu biết
            </h1>
            <blockquote className="border-l-2 border-[var(--accent-primary)] pl-6 py-1 max-w-2xl">
              <p className="font-sans text-[var(--foreground)] text-lg md:text-xl leading-relaxed italic">
                &quot;Hành động cuối cùng của lý trí là thừa nhận rằng có một lượng vô hạn những thứ vượt tầm của nó.&quot;
              </p>
              <footer className="mt-4 font-mono text-sm tracking-widest text-[var(--muted)] uppercase not-italic">
                &mdash; Blaise Pascal
              </footer>
            </blockquote>
          </div>

          {/* Category navigation — links to /blog filtered by category.
              Previously these were static decorative labels with no affordance.
              Now they are navigable links so users understand them as clickable. */}
          <nav
            className="lg:col-span-4 flex flex-col justify-end animate-fade-in"
            style={{ animationDelay: '400ms' }}
            aria-label="Khám phá theo chủ đề"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-4 opacity-60">
              Chủ đề
            </p>
            <div className="font-mono text-xs text-[var(--muted)] space-y-0">
              {[
                { Icon: Grid,     label: 'Lập luận & Phân tích', category: 'Phương pháp luận' },
                { Icon: Circle,   label: 'Nghịch lý & Bất toàn', category: 'Logic học' },
                { Icon: Triangle, label: 'Logic & Đạo đức luận', category: 'Nhận thức luận' },
              ].map(({ Icon, label, category }) => (
                <Link
                  key={label}
                  href={`/blog?category=${encodeURIComponent(category)}`}
                  className="group flex items-center gap-4 py-4 border-b border-[var(--border-color)] hover:text-[var(--foreground)] hover:border-[var(--foreground)]/30 transition-all duration-200"
                >
                  <Icon
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 group-hover:text-[var(--accent-primary)] transition-colors"
                  />
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
