import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IMAGE_BLUR_PLACEHOLDER } from '@/lib/image-utils';
import { getCategoryColor } from '@/lib/category-utils';
import type { BlogPost } from '@/lib/blog-data';

interface ArticleCardProps {
  post: Pick<BlogPost, 'slug' | 'title' | 'category' | 'excerpt' | 'image' | 'date' | 'readingTime'>;
  index: number;
}

/**
 * ArticleCard — card component for the blog index and homepage grid.
 * Idea #10: category accent color on the image top border + category dot.
 * Idea #3: readingTime displayed in the card footer.
 */
export function ArticleCard({ post, index }: ArticleCardProps) {
  const categoryColor = getCategoryColor(post.category);
  const displayIndex = String(index + 1).padStart(2, '0');

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border border-[var(--border-color)] hover:border-[var(--foreground)]/20 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      aria-label={`Đọc bài: ${post.title}`}
    >
      {/* Image container — category-colored 3px top accent border */}
      <div
        className="relative w-full aspect-[16/9] overflow-hidden"
        style={{ borderTop: `3px solid ${categoryColor.hex}` }}
      >
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_PLACEHOLDER}
        />
        {/* Index number badge */}
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 font-mono text-xs text-white/70 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded-sm"
        >
          {displayIndex}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category badge — category-specific color */}
        <div className="flex items-center gap-1.5 mb-3">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            aria-hidden="true"
            style={{ background: categoryColor.hex }}
          />
          <span
            className="font-mono text-[10px] uppercase tracking-widest font-semibold"
            style={{ color: categoryColor.hex }}
          >
            {post.category}
          </span>
        </div>

        <h3 className="font-serif text-lg leading-snug text-[var(--foreground)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="font-sans text-sm text-[var(--muted)] leading-relaxed line-clamp-3 mb-4">
          {post.excerpt}
        </p>

        {/* Footer: date + reading time */}
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[var(--muted)]">
          <time dateTime={post.date}>{post.date}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime} phút đọc</span>
        </div>
      </div>
    </Link>
  );
}
