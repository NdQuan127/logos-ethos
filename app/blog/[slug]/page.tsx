import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Metadata } from 'next';
import { getPostBySlug, getPostSlugs, getAllPostsMeta } from '@/lib/mdx';
import { BlogPost } from '@/lib/blog-data';
import { IMAGE_BLUR_PLACEHOLDER } from '@/lib/image-utils';
import { SITE_URL } from '@/lib/constants';
import { getCategoryColor } from '@/lib/category-utils';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GridLines } from '@/components/GridLines';
import { ShareButton } from '@/components/ShareButton';
import { BookmarkButton } from '@/components/BookmarkButton';
import { ReadingProgress } from '@/components/ReadingProgress';
import { TableOfContents } from '@/components/TableOfContents';
import { Callout } from '@/components/mdx/Callout';
import { PullQuote } from '@/components/mdx/PullQuote';
import { Sidenote } from '@/components/mdx/Sidenote';
import { CodeBlock } from '@/components/mdx/CodeBlock';

// ─── Static Generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ─── Per-page SEO Metadata ────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPostBySlug(slug);
    const url = `${SITE_URL}/blog/${slug}`;

    return {
      title: `${post.title} | Logos & Ethos`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        url,
        images: [
          {
            url: post.image,
            width: 800,
            height: 600,
            alt: post.title,
          },
        ],
        publishedTime: post.isoDate ?? post.date,
        tags: [post.category],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: [post.image],
      },
      alternates: { canonical: url },
    };
  } catch {
    return {
      title: 'Bài viết không tồn tại | Logos & Ethos',
    };
  }
}

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────

function ArticleJsonLd({ post, slug }: { post: BlogPost; slug: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.isoDate ?? post.date,
    image: post.image,
    url: `${SITE_URL}/blog/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Logos & Ethos',
      url: SITE_URL,
    },
    articleSection: post.category,
    timeRequired: `PT${post.readingTime}M`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─── Related Posts ────────────────────────────────────────────────────────────

function RelatedPosts({
  posts,
  currentSlug,
  currentCategory,
}: {
  posts: Array<Omit<BlogPost, 'content'> & { content: '' }>;
  currentSlug: string;
  currentCategory: string;
}) {
  // Score: same category = 3, otherwise show by recency
  const scored = posts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({ post: p, score: p.category === currentCategory ? 3 : 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.post);

  if (scored.length === 0) return null;

  return (
    <section className="mt-20 pt-12 border-t border-[var(--border-color)]" aria-label="Bài viết liên quan">
      <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-8">
        Có thể bạn cũng quan tâm
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {scored.map((post) => {
          const cc = getCategoryColor(post.category);
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-3 p-4 border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-colors rounded-sm"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: cc.hex }}>
                {post.category}
              </span>
              <h3 className="font-serif text-lg text-[var(--foreground)] group-hover:text-[var(--accent-primary)] transition-colors leading-snug">
                {post.title}
              </h3>
              <p className="font-sans text-xs text-[var(--muted)] leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-auto font-mono text-xs text-[var(--muted)] flex items-center justify-between">
                <time dateTime={post.isoDate ?? post.date}>{post.date}</time>
                <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ─── MDX Custom Components ────────────────────────────────────────────────────

/**
 * Generate a URL-friendly id from heading text.
 * Used to auto-assign id attributes so TableOfContents can link to them.
 */
function slugifyHeading(text: unknown): string {
  if (typeof text !== 'string') {
    // ReactNode children — flatten to string best-effort
    return String(text ?? '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')     // Remove diacritics for ASCII-safe IDs
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// Track used heading IDs per render to deduplicate (e.g. two "Phát biểu" headings → phat-bieu, phat-bieu-2)
const usedHeadingIds = new Map<string, number>();

function getUniqueHeadingId(text: unknown): string {
  const base = slugifyHeading(text);
  const count = usedHeadingIds.get(base) ?? 0;
  usedHeadingIds.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

const mdxComponents = {
  // ── Headings with auto-generated unique IDs for TOC ──
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = getUniqueHeadingId(props.children);
    return (
      <h2
        id={id}
        className="font-serif text-2xl md:text-3xl font-medium text-[var(--foreground)] mt-14 mb-5 scroll-mt-24"
        {...props}
      />
    );
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = getUniqueHeadingId(props.children);
    return (
      <h3
        id={id}
        className="font-serif text-xl md:text-2xl font-medium text-[var(--foreground)] mt-10 mb-4 scroll-mt-24"
        {...props}
      />
    );
  },

  // ── Body text: full opacity (Idea #4 — removed opacity-85) ──
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="font-sans text-[var(--foreground)] leading-loose mb-7"
      style={{ fontSize: 'var(--text-body)' }}
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc list-outside font-sans text-[var(--foreground)] leading-loose mb-6 pl-6 space-y-2"
      style={{ fontSize: 'var(--text-body)' }}
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal list-outside font-sans text-[var(--foreground)] leading-loose mb-6 pl-6 space-y-2"
      style={{ fontSize: 'var(--text-body)' }}
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="font-sans text-[var(--foreground)]" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-2 border-[var(--accent-primary)] pl-6 py-2 my-8 bg-[var(--accent-primary)]/5 font-serif italic text-[var(--foreground)]"
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-[var(--foreground)]" {...props} />
  ),
  em: (props: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-[var(--accent-primary)] no-underline hover:underline"
      {...props}
    />
  ),
  // Override <pre> with enhanced CodeBlock (Idea #17)
  pre: CodeBlock,
  // Custom components available in MDX files
  Callout,
  PullQuote,
  Sidenote,
};

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post: BlogPost;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  const allPosts = await getAllPostsMeta();
  const categoryColor = getCategoryColor(post.category);

  return (
    <div className="min-h-screen flex flex-col relative font-serif">
      {/* JSON-LD for SEO — includes timeRequired for reading time */}
      <ArticleJsonLd post={post} slug={slug} />

      {/* Idea #2: Reading progress bar (fixed at top, above navbar) */}
      <ReadingProgress />

      <GridLines />
      <Navbar backLink={{ href: '/', label: 'Quay lại' }} />

      <main id="main-content" className="flex-grow w-full relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">

          {/* Article header */}
          <header className="mb-12 text-center animate-fade-in-up max-w-3xl mx-auto">
            {/* Category badge — Idea #10: category-specific color */}
            <span
              className="font-mono text-[10px] uppercase tracking-widest block mb-4 font-semibold"
              style={{ color: categoryColor.hex }}
            >
              {post.category}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-[var(--foreground)] mb-6 leading-tight font-medium">
              {post.title}
            </h1>

            {/* Metadata row — Idea #3: reading time */}
            <div className="flex items-center justify-center gap-3 text-[var(--muted)] font-mono text-xs flex-wrap">
              <time dateTime={post.isoDate ?? post.date}>{post.date}</time>
              <span aria-hidden="true">·</span>
              <span aria-label={`Thời gian đọc ước tính: ${post.readingTime} phút`}>
                {post.readingTime} phút đọc
              </span>
            </div>
          </header>

          {/* Featured image */}
          <div
            className="relative w-full aspect-[16/9] mb-16 overflow-hidden border border-[var(--border-color)]"
          >
            <Image
              src={post.image}
              alt={`Ảnh minh họa: ${post.title}`}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_PLACEHOLDER}
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              priority
            />
          </div>

          {/* Article layout: content matches image width + TOC floating in right margin */}
          <div className="relative">

            {/* TOC: on desktop, positioned absolutely in right margin;
                on mobile, accordion stays in normal flow above article */}
            <TableOfContents />

            {/* Main article content — takes full max-w-3xl width */}
            <article>
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [rehypeKatex as never],
                  },
                }}
              />
            </article>

            <RelatedPosts posts={allPosts} currentSlug={slug} currentCategory={post.category} />

            {/* Footer actions */}
            <div className="mt-12 pt-8 border-t border-[var(--border-color)] flex justify-between items-center text-[var(--muted)] font-mono text-xs uppercase tracking-wider">
              <div className="flex gap-6">
                <ShareButton title={post.title} />
                <BookmarkButton slug={post.slug} />
              </div>
              <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors flex items-center gap-2 group">
                <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
                <span>Trang chủ</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
