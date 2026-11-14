import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TONES } from './lib/tones';

/** ASCII kebab-case, used for every id that ends up in a URL. */
const slugId = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Chỉ dùng chữ thường không dấu, số và dấu gạch ngang');

const categories = defineCollection({
  loader: file('src/content/taxonomy/categories.yaml'),
  schema: z.object({
    id: slugId,
    name: z.string(),
    description: z.string(),
    /** The colour token of the category dot: `--blue`, `--green`, `--violet` or `--red` in global.css. */
    tone: z.enum(TONES),
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
        /** Drafts render in `astro dev` but are left out of production builds. */
        draft: z.boolean().default(false),
        /** Cover image, e.g. `./cover.jpg`, shown at the top of the article. */
        cover: image().optional(),
        coverAlt: z.string().optional(),
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
      .refine((post) => !post.cover || !!post.coverAlt, {
        message: 'Ảnh bìa cần có `coverAlt` mô tả nội dung ảnh',
        path: ['coverAlt'],
      })
      .refine((post) => !post.updated || post.updated >= post.date, {
        message: '`updated` không được sớm hơn `date`',
        path: ['updated'],
      }),
});

export const collections = { blog, categories };
