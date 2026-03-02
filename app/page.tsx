import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllPosts } from '@/lib/mdx';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedSection } from '@/components/FeaturedSection';
import { QuoteSection } from '@/components/QuoteSection';
import { ArticleCard } from '@/components/ArticleCard';
import { GridLines } from '@/components/GridLines';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';

export default async function Page() {
  const allPosts = await getAllPosts();
  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500 font-serif">
      <GridLines />
      <Navbar />

      <main id="main-content" className="flex-grow">
        <HeroSection />

        <AnimateOnScroll animation="fade-up" threshold={0.05}>
          <FeaturedSection post={featuredPost} />
        </AnimateOnScroll>

        {/* Recent Articles Grid */}
        <section
          id="tuyen-tap"
          className="w-full py-24 px-6 md:px-12"
          aria-label="Bài viết mới"
        >
          <div className="max-w-7xl mx-auto">
            <AnimateOnScroll animation="fade-up">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 pb-6 border-b border-[var(--border-color)]">
                <div>
                  <span className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest block mb-2">
                    Mới cập nhật
                  </span>
                  <h2 className="font-serif text-3xl md:text-4xl text-[var(--foreground)]">
                    Suy ngẫm &amp; Lý luận
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="font-mono text-xs uppercase tracking-wider text-[var(--foreground)] hover:text-[var(--accent-primary)] mt-4 md:mt-0 transition-colors flex items-center gap-2"
                >
                  Xem tất cả <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </AnimateOnScroll>

            {recentPosts.length > 0 ? (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                role="list"
                aria-label="Danh sách bài viết"
              >
                {recentPosts.map((post, index) => (
                  <div key={post.slug} role="listitem">
                    {/* Idea #6: Staggered fade-up on article cards */}
                    <AnimateOnScroll animation="fade-up" delay={index * 100}>
                      <ArticleCard post={post} index={index} />
                    </AnimateOnScroll>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-sans text-[var(--muted)] text-center py-12">
                Chưa có bài viết nào. Hãy quay lại sớm!
              </p>
            )}
          </div>
        </section>

        <AnimateOnScroll animation="scale-up" threshold={0.2}>
          <QuoteSection
            quote="Toán học là âm nhạc của lý trí."
            author="James Joseph Sylvester"
          />
        </AnimateOnScroll>
      </main>

      <Footer />
    </div>
  );
}
