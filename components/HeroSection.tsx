import React from 'react';
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

          <div className="lg:col-span-4 flex flex-col justify-end animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="font-mono text-xs text-[var(--muted)] space-y-4">
              {[
                { Icon: Grid, label: 'Lập luận & Phân tích' },
                { Icon: Circle, label: 'Nghịch lý & Bất toàn' },
                { Icon: Triangle, label: 'Logic & Đạo đức luận' },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-4 pb-4 border-b border-[var(--border-color)]">
                  <Icon size={16} aria-hidden="true" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
