import React from 'react';
import { Grid, Circle, Triangle } from 'lucide-react';

export function HeroSection() {
  return (
    <header className="relative w-full py-24 md:py-32 px-6 md:px-12 border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-6 text-[var(--accent-primary)] font-mono text-xs uppercase tracking-widest">
              <span className="w-2 h-2 bg-current rounded-full" aria-hidden="true" />
              <span>Ấn phẩm số 01</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] text-[var(--foreground)] mb-8 font-medium tracking-tight">
              <span className="italic block text-[var(--muted)] font-light">Vẻ đẹp thuần khiết của</span>
              Logic &amp; Nhân sinh
            </h1>
            <p className="font-sans text-[var(--foreground)] text-lg md:text-xl max-w-2xl leading-relaxed border-l-2 border-[var(--accent-primary)] pl-6 py-1">
              Toán học và Triết học không phải là những con số hay giáo lý nằm trên giấy,
              mà là ngôn ngữ tĩnh lặng để giải mã vũ trụ.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="font-mono text-xs text-[var(--muted)] space-y-4">
              {[
                { Icon: Grid, label: 'Cấu trúc & Trật tự' },
                { Icon: Circle, label: 'Sự hoàn hảo & Vô tận' },
                { Icon: Triangle, label: 'Logic & Tam đoạn luận' },
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
