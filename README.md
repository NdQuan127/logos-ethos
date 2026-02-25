<div align="center">
  <h1>𝕃ogos & Ethos</h1>
  <p><em>Vẻ đẹp thuần khiết của Logic & chiều sâu tư duy con người</em></p>
  <br />
  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/MDX-Content-FCB32C?logo=mdx" alt="MDX" />
  </p>
</div>

---

## Giới thiệu

**Logos & Ethos** là một blog học thuật về **Toán học** và **Triết học** — nơi giao thoa của lý trí và nhân sinh. Thiết kế lấy cảm hứng từ tạp chí in ấn cổ điển, ưu tiên khả năng đọc và sự tĩnh lặng trong trải nghiệm.

### ✨ Đặc điểm

- 🎨 **Editorial design** — Bảng màu Paper/Ink/Leather, grain texture, grid lines
- 📖 **Typography tối ưu cho tiếng Việt** — Crimson Pro + Be Vietnam Pro + IBM Plex Mono
- 🌗 **Dark mode** — chuyển đổi mượt mà qua CSS custom properties
- ⚡ **Static Generation** — tất cả trang được pre-render tại build time
- 📝 **MDX Content** — viết bài bằng Markdown với khả năng nhúng React component
- 🔍 **SEO tối ưu** — Full metadata, JSON-LD, sitemap.xml, robots.txt
- ♿ **Accessible** — ARIA labels, skip-to-content, keyboard navigation, WCAG AA+

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router, RSC) |
| Language | [TypeScript 5.9](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) + CSS Custom Properties |
| Content | [MDX](https://mdxjs.com) via `next-mdx-remote` |
| Icons | [Lucide React](https://lucide.dev) |
| Hosting | [Firebase Hosting](https://firebase.google.com/docs/hosting) |

## Cài đặt

### Yêu cầu

- Node.js ≥ 20
- npm ≥ 10

### Chạy local

```bash
# Clone repo
git clone https://github.com/<your-username>/logos-and-ethos.git
cd logos-and-ethos

# Cài dependencies
npm install

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem trang web.

### Build production

```bash
npm run build
npm start
```

## Cấu trúc dự án

```
logos-and-ethos/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── globals.css         # Design tokens & base styles
│   ├── about/              # /about page
│   ├── blog/
│   │   ├── page.tsx        # /blog listing page
│   │   └── [slug]/         # /blog/:slug detail page
│   ├── sitemap.ts          # Dynamic sitemap.xml
│   └── robots.ts           # robots.txt
├── components/             # Reusable React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── FeaturedSection.tsx
│   ├── ArticleCard.tsx
│   ├── QuoteSection.tsx
│   ├── GridLines.tsx
│   ├── ThemeToggle.tsx
│   ├── BookmarkButton.tsx
│   └── ShareButton.tsx
├── content/blog/           # MDX blog posts
│   ├── cogito-ergo-sum.mdx
│   ├── dinh-ly-godel.mdx
│   ├── khoi-da-dien-plato.mdx
│   └── vo-cuc-pascal.mdx
├── lib/
│   ├── blog-data.ts        # BlogPost type definition
│   └── mdx.ts              # MDX parsing & post utilities
└── public/                 # Static assets
```

## Viết bài mới

Tạo file `.mdx` mới trong `content/blog/`:

```mdx
---
title: "Tiêu đề bài viết"
category: "Nhận thức luận"
excerpt: "Tóm tắt ngắn gọn cho bài viết..."
date: "2026-03-01"
image: "https://picsum.photos/seed/example/800/600"
---

Nội dung bài viết viết bằng Markdown...

## Heading 2

Đoạn văn bình thường với **bold** và *italic*.

> Blockquote — trích dẫn
```

Bài viết sẽ tự động xuất hiện trên trang chủ và `/blog`.

## License

[MIT](LICENSE)

---

<div align="center">
  <sub>Made with ☕ and philosophical contemplation</sub>
</div>
