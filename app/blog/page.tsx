import React from 'react';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/mdx';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GridLines } from '@/components/GridLines';
import { ArticleCard } from '@/components/ArticleCard';

export const metadata: Metadata = {
  title: 'Tất cả bài viết | Logos & Ethos',
  description: 'Khám phá toàn bộ bộ sưu tập bài viết về Toán học và Triết học của Logos & Ethos.',
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen flex flex-col relative font-serif">
      <GridLines />
      <Navbar />

      <main id="main-content" className="flex-grow">
        {/* Page header */}
        <header className="w-full py-20 md:py-28 px-6 md:px-12 border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex items-center gap-2 mb-6 text-[var(--accent-primary)] font-mono text-xs uppercase tracking-widest animate-fade-in">
              <span className="w-2 h-2 bg-current rounded-full" aria-hidden="true" />
              <span>Tuyển tập</span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl text-[var(--foreground)] font-medium leading-tight animate-fade-in-up">
              Tất cả <span className="italic font-light text-[var(--muted)]">bài viết</span>
            </h1>
            <p className="font-sans text-[var(--muted)] text-lg mt-6 max-w-xl leading-relaxed animate-fade-in-up">
              {posts.length} bài viết về Toán học, Triết học và những giao thoa của tư duy con người.
            </p>
          </div>
        </header>

        {/* Articles grid */}
        <section className="w-full py-16 px-6 md:px-12" aria-label="Danh sách bài viết">
          <div className="max-w-7xl mx-auto">
            {posts.length > 0 ? (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                role="list"
                aria-label="Danh sách bài viết"
              >
                {posts.map((post, index) => (
                  <div key={post.slug} role="listitem">
                    <ArticleCard post={post} index={index} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="font-serif text-3xl text-[var(--muted)] italic mb-4">
                  Chưa có bài viết nào.
                </p>
                <p className="font-sans text-[var(--muted)] text-sm">
                  Hãy quay lại sớm — chúng tôi đang viết!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
