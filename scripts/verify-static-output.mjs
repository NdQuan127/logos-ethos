// Checks the built site in dist/: entry points exist, and every internal link,
// anchor and asset reference resolves. Run after `npm run build`.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const required = ['index.html', '404.html', 'robots.txt', 'rss.xml', 'sitemap-index.xml'];

const errors = required.filter((file) => !fs.existsSync(path.join(dist, file))).map((file) => `missing ${file}`);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

/** The file a root-relative URL path is served from, or undefined. */
function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const candidates = decoded.endsWith('/') ? [`${decoded}index.html`] : [decoded, `${decoded}.html`];
  return candidates.map((candidate) => path.join(dist, candidate)).find((file) => fs.existsSync(file));
}

const idCache = new Map();
function idsOf(file) {
  if (!idCache.has(file)) {
    const html = fs.readFileSync(file, 'utf8');
    idCache.set(file, new Set([...html.matchAll(/\s(?:id|name)="([^"]+)"/g)].map((match) => match[1])));
  }
  return idCache.get(file);
}

const pages = walk(dist).filter((file) => file.endsWith('.html'));
let checked = 0;

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  const where = path.relative(dist, page);
  const references = [
    ...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((match) => match[1]),
    ...[...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((match) =>
      match[1].split(',').map((candidate) => candidate.trim().split(/\s+/)[0]),
    ),
  ];

  for (const reference of references) {
    const url = reference.replaceAll('&amp;', '&');
    if (!url.startsWith('/') && !url.startsWith('#')) continue;
    if (url.startsWith('//')) continue;
    checked += 1;

    const [pathAndQuery, hash] = url.split('#');
    const urlPath = pathAndQuery.split('?')[0];
    const target = urlPath === '' ? page : resolveFile(urlPath);
    if (!target) {
      errors.push(`${where}: broken link ${url}`);
      continue;
    }
    if (hash && target.endsWith('.html') && !idsOf(target).has(decodeURIComponent(hash))) {
      errors.push(`${where}: missing anchor ${url}`);
    }
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`✖ ${error}`);
  process.exit(1);
}

console.log(`Static output verified: ${pages.length} pages, ${checked} internal references.`);
