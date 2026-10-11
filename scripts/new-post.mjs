// Usage: npm run new -- "Tiêu đề bài viết" [--category logic-hoc]
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { slugify } from '../src/lib/slug.ts';

const args = process.argv.slice(2);
const categoryFlag = args.indexOf('--category');
const category = categoryFlag >= 0 ? args.splice(categoryFlag, 2)[1] : undefined;
const title = args.join(' ').trim();

const categoryIds = parse(fs.readFileSync('src/content/taxonomy/categories.yaml', 'utf8')).map((item) => item.id);

if (!title) {
  console.error('Thiếu tiêu đề. Ví dụ: npm run new -- "Nghịch lý Russell" --category nghich-ly');
  process.exit(1);
}
if (category && !categoryIds.includes(category)) {
  console.error(`Chủ đề "${category}" không tồn tại. Chọn một trong: ${categoryIds.join(', ')}`);
  process.exit(1);
}

const slug = slugify(title);
const dir = path.join('src/content/blog', slug);

if (fs.existsSync(dir)) {
  console.error(`Đã có bài với slug "${slug}" (${dir}).`);
  process.exit(1);
}

const today = new Date();
const date = [today.getFullYear(), today.getMonth() + 1, today.getDate()]
  .map((part) => String(part).padStart(2, '0'))
  .join('-');
const template = fs.readFileSync('src/content/blog/_template/index.mdx', 'utf8');
const content = template
  .replace('{{title}}', title.replace(/"/g, '\\"'))
  .replace('{{date}}', date)
  .replace('{{category}}', category ?? `${categoryIds[0]}  # ${categoryIds.join(' | ')}`);

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'index.mdx'), content);
console.log(`Đã tạo ${path.join(dir, 'index.mdx')}`);
console.log(`URL khi chạy dev: http://localhost:4321/blog/${slug}/ (bài đang là nháp: draft: true)`);
