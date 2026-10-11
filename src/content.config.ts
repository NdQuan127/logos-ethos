import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TONES } from './lib/cover-art';

/** ASCII kebab-case, used for every id that ends up in a URL. */
const slugId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Chỉ dùng chữ thường không dấu, số và dấu gạch ngang');

const categories = defineCollection({
  loader: file('src/content/taxonomy/categories.yaml'),
  schema: z.object({
    id: slugId,
    name: z.string(),
    description: z.string(),
    /** Picks `--cat-<tone>` (text) and `--tab-<tone>` (chip and cover paper) in global.css, and the cover motif. */
    tone: z.enum(TONES),
    /** Glyph shown on generated covers. */
    symbol: z.string().max(2),
  }),
});

const series = defineCollection({
  loader: file('src/content/taxonomy/series.yaml'),
  schema: z.object({
    id: slugId,
    title: z.string(),
    description: z.string(),
    /** Glyph on the series cover; falls back to the first post's category symbol. */
    symbol: z.string().max(2).optional(),
  }),
});

const blog = defineCollection({
  // One folder per post: src/content/blog/<slug>/index.mdx. The folder name is
  // the URL slug. Files and folders starting with "_" are ignored (templates).
  loader: glob({ pattern: ['**/*.mdx', '!**/_*', '!**/_*/**'], base: './src/content/blog' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string().min(1),
        /** One or two sentences. Used on cards, in search results and as the meta description. */
        description: z.string().min(40).max(220),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        category: reference('categories'),
        tags: z.array(z.string().min(1)).default([]),
        series: reference('series').optional(),
        /** Position inside the series, starting at 1. Required when `series` is set. */
        seriesOrder: z.number().int().positive().optional(),
        /** Drafts render in `astro dev` but are left out of production builds. */
        draft: z.boolean().default(false),
        /** Pin the post to the homepage feature slot. The newest featured post wins. */
        featured: z.boolean().default(false),
        /** Cover image, e.g. `./cover.jpg`, shown in duotone on the article and in cover slots. */
        cover: image().optional(),
        coverAlt: z.string().optional(),
        /** Show a generated cover on the article and in cover slots when there is no `cover` image. */
        artCover: z.boolean().default(false),
        /** Show the table of contents. */
        toc: z.boolean().default(true),
        sources: z
          .array(
            z.object({
              title: z.string(),
              author: z.string().optional(),
              url: z.url().optional(),
            }),
          )
          .default([]),
      })
      .refine((post) => !post.series || post.seriesOrder !== undefined, {
        message: 'Bài thuộc series cần có `seriesOrder`',
        path: ['seriesOrder'],
      })
      .refine((post) => !post.cover || !!post.coverAlt, {
        message: 'Ảnh bìa cần có `coverAlt` mô tả nội dung ảnh',
        path: ['coverAlt'],
      })
      .refine((post) => !post.updated || post.updated >= post.date, {
        message: '`updated` không được sớm hơn `date`',
        path: ['updated'],
      }),
});

export const collections = { blog, categories, series };
