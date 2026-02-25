import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog-data';

interface ArticleCardProps {
  post: BlogPost;
  index: number;
}

export function ArticleCard({ post, index }: ArticleCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} aria-label={`Đọc bài: ${post.title}`}>
      <article className="group cursor-pointer flex flex-col h-full transition-transform duration-200 ease-out hover:-translate-y-1">
        <div className="relative aspect-[3/2] overflow-hidden bg-[var(--muted)]/10 mb-4 border border-[var(--border-color)]">
          <Image
            src={post.image}
            alt={`Ảnh minh họa cho bài: ${post.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
          />
          {/* Number badge */}
          <div className="absolute top-0 left-0 bg-[var(--background)] border-r border-b border-[var(--border-color)] px-3 py-1 font-mono text-xs font-bold text-[var(--foreground)]" aria-hidden="true">
            0{index + 2}
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-grow">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">{post.category}</span>
          </div>

          <h3 className="font-serif text-2xl text-[var(--foreground)] group-hover:text-[var(--accent-primary)] transition-colors duration-300 leading-snug">
            {post.title}
          </h3>

          <p className="font-sans text-[var(--muted)] text-sm leading-relaxed line-clamp-3 mb-4">
            {post.excerpt}
          </p>

          <div className="mt-auto pt-4 border-t border-[var(--border-color)] flex justify-between items-center text-[var(--muted)] text-xs font-mono">
            <div className="flex items-center gap-3">
              <time dateTime={post.isoDate ?? post.date}>{post.date}</time>
              {post.readingTime && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime} phút đọc</span>
                </>
              )}
            </div>
            <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
