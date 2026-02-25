import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import { getPostBySlug, getPostSlugs, getAllPosts } from '@/lib/mdx';
import { BlogPost } from '@/lib/blog-data';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GridLines } from '@/components/GridLines';
import { ShareButton } from '@/components/ShareButton';
import { BookmarkButton } from '@/components/BookmarkButton';

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
    const url = `https://logos-ethos.web.app/blog/${slug}`;

    return {
      title: `${post.title} | Logos & Ethos`,
      description: post.excerpt,
      authors: [{ name: post.author }],
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
        authors: [post.author],
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
    author: { '@type': 'Person', name: post.author },
    datePublished: post.isoDate ?? post.date,
    image: post.image,
    url: `https://logos-ethos.web.app/blog/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Logos & Ethos',
      url: 'https://logos-ethos.web.app',
    },
    articleSection: post.category,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// ─── Related Posts ────────────────────────────────────────────────────────────

function RelatedPosts({ posts, currentSlug }: { posts: BlogPost[]; currentSlug: string }) {
  const related = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section className="mt-20 pt-12 border-t border-[var(--border-color)]" aria-label="Bài viết liên quan">
      <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-8">
        Có thể bạn cũng quan tâm
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col gap-3 p-4 border border-[var(--border-color)] hover:border-[var(--accent-primary)] transition-colors rounded-sm"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-primary)]">
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
        ))}
      </div>
    </section>
  );
}

// ─── MDX Custom Components ────────────────────────────────────────────────────

const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="font-serif text-2xl md:text-3xl font-medium text-[var(--foreground)] mt-12 mb-4"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="font-serif text-xl md:text-2xl font-medium text-[var(--foreground)] mt-8 mb-3"
      {...props}
    />
  ),
  // Body text: use foreground color (not muted) for long-form reading — WCAG AAA contrast
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className="font-sans text-[var(--foreground)] leading-loose mb-6 opacity-85"
      {...props}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc list-outside font-sans text-[var(--foreground)] leading-loose mb-6 pl-6 space-y-2 opacity-85"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal list-outside font-sans text-[var(--foreground)] leading-loose mb-6 pl-6 space-y-2 opacity-85"
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="font-sans text-[var(--foreground)] opacity-85" {...props} />
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
};

// ─── Page Component ───────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  // Fetch all posts for related articles section
  const allPosts = await getAllPosts();

  return (
    <div className="min-h-screen flex flex-col relative font-serif">
      {/* JSON-LD for SEO */}
      <ArticleJsonLd post={post} slug={slug} />

      {/* Decorative grid lines */}
      <GridLines />

      <Navbar backLink={{ href: '/', label: 'Quay lại' }} />

      <main id="main-content" className="flex-grow w-full max-w-4xl mx-auto px-6 py-12 md:py-20 relative z-10">
        {/* Article header */}
        <header className="mb-12 text-center animate-fade-in-up">
          <span className="font-mono text-xs text-[var(--accent-primary)] uppercase tracking-widest block mb-4">
            {post.category}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-[var(--foreground)] mb-6 leading-tight font-medium">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-[var(--muted)] text-sm font-sans flex-wrap">
            <span className="font-bold text-[var(--foreground)]">{post.author}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--accent-primary)]" aria-hidden="true" />
            {/* dateTime now uses ISO format for semantic correctness */}
            <time className="font-mono text-xs" dateTime={post.isoDate ?? post.date}>
              {post.date}
            </time>
            {post.readingTime && (
              <>
                <span className="w-1 h-1 rounded-full bg-[var(--accent-primary)]" aria-hidden="true" />
                <span className="font-mono text-xs">{post.readingTime} phút đọc</span>
              </>
            )}
          </div>
        </header>

        {/* Featured image */}
        <div className="relative w-full aspect-[16/9] mb-16 rounded-sm overflow-hidden border border-[var(--border-color)]">
          <Image
            src={post.image}
            alt={`Ảnh minh họa: ${post.title}`}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            priority
          />
        </div>

        {/* MDX content — body text now uses foreground color for reading comfort */}
        <article className="max-w-none">
          <MDXRemote source={post.content} components={mdxComponents} />
        </article>

        {/* Related Posts */}
        <RelatedPosts posts={allPosts} currentSlug={slug} />

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
      </main>

      <Footer />
    </div>
  );
}
