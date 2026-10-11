import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const required = [
  'index.html',
  'about/index.html',
  'blog/index.html',
  'blog/cogito-ergo-sum/index.html',
  'blog/dinh-ly-godel/index.html',
  'robots.txt',
  'rss.xml',
];

const missing = required.filter((file) => !fs.existsSync(path.join(dist, file)));
const sitemapExists =
  fs.existsSync(path.join(dist, 'sitemap-index.xml')) || fs.existsSync(path.join(dist, 'sitemap.xml'));

if (missing.length > 0 || !sitemapExists) {
  console.error('Missing static output:');
  for (const file of missing) console.error(`- ${file}`);
  if (!sitemapExists) console.error('- sitemap-index.xml or sitemap.xml');
  process.exit(1);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const stale = walk(dist).filter((file) => {
  if (!/\.(html|js|css|xml|txt)$/.test(file)) return false;
  const text = fs.readFileSync(file, 'utf8');
  return /_next|__NEXT_DATA__|next-mdx-remote/.test(text);
});

if (stale.length > 0) {
  console.error('Legacy Next markers found:');
  for (const file of stale) console.error(`- ${path.relative(dist, file)}`);
  process.exit(1);
}

console.log('Static output verified.');
