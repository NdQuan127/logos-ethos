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

**Logos & Ethos** là sổ tay về toán học, học máy, triết học và chính trị: những nơi lý trí đi đến tận cùng và nhận ra mình có biên giới. Giao diện tối giản, một cột chữ, ưu tiên khả năng đọc.

### Đặc điểm

- **Tối giản** — thang màu trung tính, bốn màu lĩnh vực chỉ ở chấm nhỏ; token định nghĩa một lần trong `src/styles/global.css`.
- **Chữ** — Inter và Geist Mono, có tiếng Việt, tự host qua fontsource.
- **Nền sáng/tối** — theo máy cho tới khi người đọc tự chọn; phím `T`.
- **Tìm kiếm** — bảng lệnh `Ctrl K` (cmdk), chỉ tải khi mở.
- **Static generation** — Astro pre-render toàn bộ route tại build time.
- **MDX content collections** — frontmatter được validate bằng schema.
- **Hệ thống nội dung chuẩn hoá** — lĩnh vực, thẻ, bản nháp; component MDX cho định lý, chứng minh, định nghĩa.
- **SEO** — metadata, JSON-LD, sitemap.xml, robots.txt, RSS.
- **Accessible** — ARIA labels, skip-to-content, keyboard navigation.

## Tech Stack

| Layer     | Technology                                                        |
| --------- | ----------------------------------------------------------------- |
| Framework | [Astro 7](https://astro.build)                                    |
| Language  | [TypeScript 5.9](https://www.typescriptlang.org)                  |
| Styling   | [Tailwind CSS 4](https://tailwindcss.com) + CSS Custom Properties |
| Content   | [MDX](https://mdxjs.com) + Astro content collections              |
| Icons     | [Lucide Astro](https://lucide.dev)                                |
| Hosting   | [Netlify](https://www.netlify.com)                                |

## Cài đặt

### Yêu cầu

- Node.js >= 22.12 (khuyến nghị 24, xem `.node-version`)
- npm >= 10

### Chạy local

```bash
npm install
npm run dev
```

Mở `http://localhost:4321` để xem trang web.

### Kiểm tra và build

```bash
npm run ci        # chạy toàn bộ các bước dưới đây theo thứ tự
```

| Lệnh                    | Kiểm tra gì                                              |
| ----------------------- | -------------------------------------------------------- |
| `npm run format:check`  | Định dạng code (Prettier); `npm run format` để tự sửa    |
| `npm run lint`          | ESLint cho JS, TypeScript và Astro                       |
| `npm run check`         | Kiểu TypeScript và schema nội dung (`astro check`)       |
| `npm test`              | Unit test cho `src/lib` (Vitest)                         |
| `npm run check:content` | Quy ước bài viết: thư mục, frontmatter, link nội bộ, thẻ |
| `npm run build`         | Build site tĩnh vào `dist/`                              |
| `npm run verify`        | Mọi link, anchor và ảnh nội bộ trong `dist/` đều tồn tại |

`npm run preview` mở bản build để xem thử.

## Cấu trúc dự án

```text
src/
├── config/site.ts         # tên site, lời giới thiệu, menu, footer
├── content/
│   ├── blog/<slug>/       # mỗi bài một thư mục (index.mdx + ảnh)
│   └── taxonomy/          # lĩnh vực (YAML)
├── content.config.ts      # schema frontmatter
├── layouts/
│   ├── BaseLayout.astro   # <head>, SEO, font, theme
│   ├── SiteLayout.astro   # thanh đầu trang + <main> + chân trang
│   └── ArticleLayout.astro# trang bài viết
├── components/
│   ├── site/              # Header, Footer, Logo, ThemeButton
│   ├── ui/                # Button, Badge, Kbd, IconSwap
│   ├── post/              # danh sách bài, đầu trang danh sách, mục lục, tài liệu, thẻ, bài kế
│   ├── palette/           # bảng lệnh Ctrl K (React + cmdk, chỉ tải khi mở)
│   └── mdx/               # component dùng trong bài (đăng ký ở index.ts)
├── lib/
│   ├── content.ts         # API duy nhất để lấy bài, lĩnh vực, thẻ
│   ├── routes.ts          # mọi URL nội bộ
│   ├── rehype-blocks.ts   # bọc bảng và khối code lúc build
│   ├── og.ts              # ảnh chia sẻ (Satori)
│   └── format.ts, fold.ts, slug.ts
├── pages/                 # route; chỉ lấy dữ liệu và chọn layout
├── scripts/               # JS phía trình duyệt, mỗi file một hàm init*()
└── styles/
    ├── global.css         # token, style nền, component dùng chung
    └── prose.css          # kiểu chữ thân bài
```

Màu dùng qua token (`var(--muted)` hoặc utility `text-muted`, `bg-surface`, `border-border`…) định nghĩa một lần trong `global.css`; Tailwind chỉ sinh được màu từ các token này.

## Viết bài mới

```bash
npm run new -- "Tiêu đề bài viết" --category toan-hoc
```

Quy ước frontmatter, lĩnh vực, thẻ và các component MDX (`<Theorem>`, `<Proof>`, `<Sidenote>`…) nằm trong [docs/CONTENT.md](docs/CONTENT.md).

## License

[MIT](LICENSE)
