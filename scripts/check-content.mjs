// Content checks the collection schema cannot express. Run with `npm run check:content`.
// Errors fail the command; warnings are printed only.
import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIR = 'src/content/blog';
const STALE_DRAFT_DAYS = 90;

const errors = [];
const warnings = [];

const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const readIds = (file) =>
  [...fs.readFileSync(file, 'utf8').matchAll(/^- id: ([a-z0-9-]+)$/gm)].map((match) => match[1]);

const categoryIds = new Set(readIds('src/content/taxonomy/categories.yaml'));
const seriesIds = new Set(readIds('src/content/taxonomy/series.yaml'));

const posts = [];
for (const entry of fs.readdirSync(BLOG_DIR, { withFileTypes: true })) {
  if (entry.name.startsWith('_')) continue;
  const where = path.join(BLOG_DIR, entry.name);
  if (!entry.isDirectory()) {
    if (/\.mdx?$/.test(entry.name)) {
      errors.push(`${where}: mỗi bài phải nằm trong thư mục riêng (${entry.name.replace(/\.mdx?$/, '')}/index.mdx)`);
    }
    continue;
  }
  if (entry.name !== slugify(entry.name)) {
    errors.push(`${where}: tên thư mục là URL, chỉ dùng chữ thường không dấu và "-" (gợi ý: ${slugify(entry.name)})`);
  }
  const file = path.join(where, 'index.mdx');
  if (!fs.existsSync(file)) {
    errors.push(`${where}: thiếu index.mdx`);
    continue;
  }
  const source = fs.readFileSync(file, 'utf8');
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    errors.push(`${file}: thiếu frontmatter`);
    continue;
  }
  const frontmatter = match[1];
  const field = (name) =>
    frontmatter
      .match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]
      .trim()
      .replace(/^["']|["']$/g, '');
  const tags = (field('tags') ?? '[]')
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((tag) => tag.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean);

  posts.push({
    slug: entry.name,
    file,
    body: source.slice(match[0].length),
    description: field('description'),
    draft: field('draft') === 'true',
    date: field('date'),
    category: field('category')?.split(/\s+#/)[0],
    series: field('series'),
    tags,
  });
}

const slugs = new Set(posts.map((post) => post.slug));
const tagNames = new Map();

for (const post of posts) {
  const { file, body } = post;
  // Ignore fenced code so examples inside ``` blocks are not checked.
  const prose = body.replace(/```[\s\S]*?```/g, '');

  if (/^# /m.test(prose))
    errors.push(`${file}: không dùng tiêu đề cấp 1 (#) trong bài; tiêu đề bài đã là h1, hãy bắt đầu từ ##`);

  let previous = 1;
  for (const [, hashes, text] of prose.matchAll(/^(#{2,6})\s+(.+)$/gm)) {
    if (hashes.length > previous + 1) warnings.push(`${file}: "${text}" nhảy từ h${previous} xuống h${hashes.length}`);
    previous = hashes.length;
  }

  for (const [, href] of prose.matchAll(/\]\((\/blog\/[^)\s#]*)/g)) {
    const [, kind, id] = href.match(/^\/blog\/(?:(chu-de|tag|loat-bai)\/)?([^/]+)\/?$/) ?? [];
    const ok =
      kind === 'chu-de'
        ? categoryIds.has(id)
        : kind === 'loat-bai'
          ? seriesIds.has(id)
          : kind === 'tag'
            ? true
            : id
              ? slugs.has(id)
              : false;
    if (!ok) errors.push(`${file}: liên kết nội bộ không tồn tại: ${href}`);
    else if (!href.endsWith('/')) warnings.push(`${file}: liên kết nội bộ nên kết thúc bằng "/": ${href}`);
  }

  if (!post.draft && post.description?.startsWith('Một đến hai câu tóm tắt')) {
    errors.push(`${file}: vẫn còn mô tả mẫu từ template`);
  }

  if (post.category && !categoryIds.has(post.category))
    errors.push(`${file}: chủ đề "${post.category}" không có trong taxonomy/categories.yaml`);
  if (post.series && !seriesIds.has(post.series))
    errors.push(`${file}: loạt bài "${post.series}" không có trong taxonomy/series.yaml`);

  for (const tag of post.tags) {
    const key = slugify(tag);
    const seen = tagNames.get(key);
    if (seen && seen.name !== tag)
      warnings.push(`${file}: thẻ "${tag}" trùng với "${seen.name}" (${seen.file}); hãy thống nhất một cách viết`);
    else if (!seen) tagNames.set(key, { name: tag, file });
  }

  if (post.draft && post.date) {
    const age = (Date.now() - new Date(post.date).getTime()) / 86_400_000;
    if (age > STALE_DRAFT_DAYS) warnings.push(`${file}: bản nháp đã ${Math.floor(age)} ngày`);
  }
}

for (const warning of warnings) console.warn(`⚠ ${warning}`);
for (const error of errors) console.error(`✖ ${error}`);
console.log(`${posts.length} bài · ${errors.length} lỗi · ${warnings.length} cảnh báo`);
if (errors.length > 0) process.exit(1);
