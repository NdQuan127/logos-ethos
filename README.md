<div align="center">
  <h1>𝕃ogos & Ethos</h1>
  <p><em>Vẻ đẹp thuần khiết của Logic & chiều sâu tư duy con người</em></p>
  <br />
  <p>
    <img src="https://img.shields.io/badge/Astro-7-FF5D01?logo=astro" alt="Astro" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/MDX-Content-FCB32C?logo=mdx" alt="MDX" />
  </p>
</div>

---

## Giới thiệu

**Logos & Ethos** là một blog học thuật về **Toán học** và **Triết học** — nơi giao thoa của lý trí và nhân sinh. Thiết kế lấy cảm hứng từ tạp chí in ấn cổ điển, ưu tiên khả năng đọc và sự tĩnh lặng trong trải nghiệm.

### Đặc điểm

- **Editorial design** — bảng màu Paper/Ink/Leather, typography kiểu tạp chí in.
- **Typography tối ưu cho tiếng Việt** — Crimson Pro + Be Vietnam Pro + IBM Plex Mono.
- **Dark mode** — chuyển đổi qua CSS custom properties và script nhỏ.
- **Static generation** — Astro pre-render toàn bộ route tại build time.
- **MDX content collections** — frontmatter được validate bằng schema.
- **Hệ thống nội dung chuẩn hoá** — chủ đề, thẻ, loạt bài, bản nháp; component MDX cho định lý, chứng minh, định nghĩa.
- **SEO** — metadata, JSON-LD, sitemap.xml, robots.txt, RSS.
- **Accessible** — ARIA labels, skip-to-content, keyboard navigation.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Astro 7](https://astro.build) |
| Language | [TypeScript 5.9](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) + CSS Custom Properties |
| Content | [MDX](https://mdxjs.com) + Astro content collections |
| Icons | [Lucide Astro](https://lucide.dev) |
| Hosting | [Netlify](https://www.netlify.com) |

## Cài đặt

### Yêu cầu

- Node.js >= 20
- npm >= 10

### Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:4321` để xem trang web.

### Build production

```bash
npm run check
npm run check:content
npm run lint
npm run build
npm run verify
npm run preview
```

## Cấu trúc dự án

```text
logos-and-ethos/
├── astro.config.mjs
├── src/
│   ├── pages/             # Public routes
│   ├── layouts/           # HTML shell and metadata
│   ├── components/        # Astro UI components
│   ├── content/blog/      # MDX blog posts
│   ├── lib/               # Blog helpers and constants
│   ├── scripts/           # Browser-only interactions
│   └── styles/            # Design tokens and fonts
├── scripts/
│   └── verify-static-output.mjs
└── public/                # Static assets
```

## Viết bài mới

```bash
npm run new -- "Tiêu đề bài viết" --category logic-hoc
```

Quy ước frontmatter, chủ đề, thẻ, loạt bài và các component MDX (`<Theorem>`, `<Proof>`, `<Sidenote>`…) nằm trong [docs/CONTENT.md](docs/CONTENT.md).

## License

[MIT](LICENSE)
