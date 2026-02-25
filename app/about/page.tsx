import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GridLines } from '@/components/GridLines';
import { QuoteSection } from '@/components/QuoteSection';

export const metadata: Metadata = {
  title: 'Về chúng tôi | Logos & Ethos',
  description: 'Logos & Ethos — về những giới hạn của sự hiểu biết, nơi toán học và triết học cùng đặt câu hỏi cho lý trí.',
};

const PILLARS = [
  {
    symbol: 'Λ',
    latin: 'Logos',
    meaning: 'Lý trí & Logic',
    description:
      'Logos — tiếng Hy Lạp cho "từ ngữ, lý trí, nguyên lý" — là nền tảng của tư duy khoa học. Chúng tôi tin rằng toán học không chỉ là công cụ, mà là ngôn ngữ mà qua đó vũ trụ tự diễn đạt mình.',
  },
  {
    symbol: 'Η',
    latin: 'Ethos',
    meaning: 'Đạo đức & Nhân sinh',
    description:
      'Ethos — "tính cách, tinh thần" — nhắc nhở rằng lý trí không thể tách rời khỏi giá trị. Triết học là câu hỏi liên tục về ý nghĩa của sự sống, cái đẹp, và cái thiện.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col relative font-serif">
      <GridLines />
      <Navbar />

      <main id="main-content" className="flex-grow">
        {/* Hero */}
        <header className="w-full py-24 md:py-32 px-6 md:px-12 border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center gap-2 mb-6 text-[var(--accent-primary)] font-mono text-xs uppercase tracking-widest animate-fade-in">
              <span className="w-2 h-2 bg-current rounded-full" aria-hidden="true" />
              <span>Về chúng tôi</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-[var(--foreground)] font-medium leading-tight tracking-tight animate-fade-in-up max-w-4xl">
              <span className="italic font-light text-[var(--muted)] block">Về những giới hạn của</span>
              Sự hiểu biết
            </h1>
          </div>
        </header>

        {/* Mission */}
        <section className="w-full py-20 px-6 md:px-12 border-b border-[var(--border-color)]" aria-label="Sứ mệnh">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-xs text-[var(--accent-primary)] uppercase tracking-widest mb-6">Sứ mệnh</p>
            <p className="font-serif text-2xl md:text-3xl text-[var(--foreground)] leading-relaxed mb-6">
              Lý trí có những đường biên mà chính nó không thể nhìn thấy. Toán học và triết học là hai cách tiếp cận khác nhau để sờ vào những đường biên đó.
            </p>
            <p className="font-sans text-[var(--muted)] text-lg leading-loose">
              Logos & Ethos là nơi dành cho những ai thấy rằng một định lý toán học có thể gây rúng động ngang một câu hỏi triết học, và rằng câu hỏi quan trọng hơn câu trả lời.
            </p>
          </div>
        </section>

        {/* Two pillars */}
        <section className="w-full py-20 px-6 md:px-12 border-b border-[var(--border-color)]" aria-label="Hai trụ cột">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-[var(--border-color)]">
            {PILLARS.map((pillar) => (
              <div key={pillar.latin} className="p-8 md:p-12">
                <div className="font-serif text-7xl text-[var(--accent-primary)] opacity-20 mb-4 leading-none" aria-hidden="true">
                  {pillar.symbol}
                </div>
                <p className="font-mono text-sm uppercase tracking-widest text-[var(--accent-primary)] mb-2">
                  {pillar.latin}
                </p>
                <h2 className="font-serif text-3xl text-[var(--foreground)] mb-6 font-medium">
                  {pillar.meaning}
                </h2>
                <p className="font-sans text-[var(--muted)] text-base leading-loose">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="w-full py-20 px-6 md:px-12" aria-label="Liên hệ">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest mb-6">Liên hệ</p>
            <p className="font-serif text-2xl text-[var(--foreground)] mb-8 leading-relaxed">
              Có ý tưởng, câu hỏi, hay chỉ muốn nói về Gödel lúc nửa đêm?
            </p>
            <a
              href="mailto:contact@logos-ethos.web.app"
              className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-[var(--foreground)] border border-[var(--border-color)] px-6 py-3 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              Gửi thư cho chúng tôi
            </a>
          </div>
        </section>

        <QuoteSection
          quote="Triết học là sự luyện tập để học cách chết."
          author="Plato (Phaidon)"
        />
      </main>

      <Footer />
    </div>
  );
}
