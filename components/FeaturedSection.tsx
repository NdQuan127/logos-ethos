import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '@/lib/blog-data';

interface FeaturedSectionProps {
  post: BlogPost;
}

export function FeaturedSection({ post }: FeaturedSectionProps) {
  return (
    <section className="w-full border-b border-[var(--border-color)]" aria-label="Bài viết nổi bật">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
        <div className="p-6 md:p-12 lg:border-r border-[var(--border-color)] flex flex-col justify-center">
          <div className="mb-8">
            <span className="font-mono text-xs text-[var(--accent-primary)] uppercase tracking-widest bg-[var(--accent-primary)]/10 px-2 py-1 rounded-sm">
              Tiêu điểm
            </span>
          </div>

          {/* Category label */}
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)] mb-3">
            {post.category}
          </p>

          {/* Title from post data — no longer hardcoded */}
          <h2 className="font-serif text-4xl md:text-5xl text-[var(--foreground)] mb-6 leading-tight">
            {post.title}
          </h2>

          {/* Excerpt from post data */}
          <p className="font-sans text-[var(--muted)] text-lg leading-relaxed mb-8 line-clamp-4">
            {post.excerpt}
          </p>

          <Link
            href={`/blog/${post.slug}`}
            className="group flex items-center gap-3 text-[var(--foreground)] font-mono text-sm uppercase tracking-wider hover:text-[var(--accent-primary)] transition-colors w-fit"
            aria-label={`Đọc bài viết: ${post.title}`}
          >
            <span>Đọc bài viết</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>

        <div className="relative aspect-square lg:aspect-auto min-h-[400px] bg-[var(--muted)]/5 group overflow-hidden">
          <Image
            src={post.image}
            alt={`Ảnh minh họa cho bài: ${post.title}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover grayscale contrast-[1.1] group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
          />
          <div className="absolute inset-0 bg-[var(--accent-primary)]/10 mix-blend-multiply dark:mix-blend-overlay" aria-hidden="true" />

          {/* Technical overlay graphics */}
          <div className="absolute inset-0 p-6 border-[16px] border-[var(--background)]/20 pointer-events-none" aria-hidden="true">
            <div className="w-full h-full border border-[var(--background)]/40 relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[var(--background)]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[var(--background)]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[var(--background)]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[var(--background)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
