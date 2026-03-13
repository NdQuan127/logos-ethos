# 🔍 Báo cáo Đánh giá UI/UX — Logos & Ethos

> Ngày đánh giá: 13 Tháng 3, 2026  
> Methodology: frontend-design skill (Anti-Patterns + Design Principles) + critique skill (10 Design Dimensions) + audit skill (5 Quality Areas)  
> Trang web: [logos-ethos.netlify.app](https://logos-ethos.netlify.app)

---

## Tổng quan Visual — Screenshots

````carousel
![Trang chủ — Light mode: Hero Section với typography Crimson Pro lớn, trích dẫn Pascal, và grid lines trang trí](/home/machiavelli127/.gemini/antigravity/brain/387a9dfe-5072-418e-9450-a1f48aa38dec/.system_generated/click_feedback/click_feedback_1773362360988.png)
<!-- slide -->
![Trang chủ — Dark mode: Hero + Featured Section với warm golden glow và hình ảnh grayscale](/home/machiavelli127/.gemini/antigravity/brain/387a9dfe-5072-418e-9450-a1f48aa38dec/mobile_homepage_1773362584014.png)
<!-- slide -->
![Articles Grid + Quote Section + Footer trong dark mode](/home/machiavelli127/.gemini/antigravity/brain/387a9dfe-5072-418e-9450-a1f48aa38dec/homepage_articles_1773362508880.png)
<!-- slide -->
![Blog Index — Tất cả bài viết trong dark mode, grid cards 3 cột](/home/machiavelli127/.gemini/antigravity/brain/387a9dfe-5072-418e-9450-a1f48aa38dec/blog_index_1773362535710.png)
<!-- slide -->
![About Page — Hero + Mission statement trong dark mode](/home/machiavelli127/.gemini/antigravity/brain/387a9dfe-5072-418e-9450-a1f48aa38dec/about_page_1773362551214.png)
<!-- slide -->
![Blog Post — Article page với ảnh grayscale và nội dung bài viết](/home/machiavelli127/.gemini/antigravity/brain/387a9dfe-5072-418e-9450-a1f48aa38dec/blog_post_content_1773362555700.png)
````

---

## I. Anti-Patterns Verdict (AI Slop Test)

**Kết quả: PASS — nhưng có dấu hiệu cảnh báo**

Trang web **KHÔNG** trông như sản phẩm AI-slop điển hình 2024-2025. Thiết kế có cá tính riêng biệt — phong cách editorial/journal rất rõ. Tuy nhiên, có một số điểm cần lưu ý:

| Tiêu chí Anti-Pattern | Trạng thái | Ghi chú |
|---|---|---|
| Cyan-on-dark / Neon accents | ✅ Pass | Dùng warm gold (#D9A441) thay vì neon |
| Gradient text | ✅ Pass | Không sử dụng |
| Glassmorphism | ✅ Pass | `backdrop-blur-md` chỉ dùng đúng chỗ (navbar sticky) |
| Hero metric layout | ✅ Pass | Không có big-number pattern |
| Identical card grids | ⚠️ Flag | 3 article cards đồng dạng: ảnh + category + title + excerpt + meta |
| Dark mode + glowing accents | ⚠️ Flag | `radial-gradient` glow ở hero dark mode cận kề anti-pattern này |
| Bounce/elastic easing | ✅ Pass | Dùng `cubic-bezier(0.4,0,0.2,1)` — smooth deceleration |
| Rounded rectangles + drop shadow | ✅ Pass | Cards dùng sharp borders, không rounded corners |
| Generic fonts | ✅ Pass | Crimson Pro + Be Vietnam Pro — lựa chọn có ý đồ |
| Monospace = "technical" vibes | ⚠️ Flag | Quá lạm dụng font mono cho labels — trở thành pattern lặp |

> [!IMPORTANT]
> **Điều tốt nhất**: Thiết kế có personality rõ — editorial/journal với grain texture, grid lines, grayscale photos. Nếu ai hỏi "AI làm cái này?", câu trả lời sẽ là "có thể, nhưng có gu".

---

## II. Design Critique — 10 Dimensions

### 1. Visual Hierarchy ★★★★☆

**Ưu điểm**: Hero title rất dominant — text 5xl-8xl Crimson Pro italic ngay lập tức thu hút mắt. Phân cấp rõ: hero → featured → articles → quote → footer.

**Vấn đề**: 
- Sidebar phải của Hero (3 items: "Lập luận & Phân tích", "Nghịch lý & Bất toàn", "Logic & Đạo đức luận") **không rõ mục đích**. Đây là labels tĩnh, không link, không call-to-action. Người dùng mới sẽ không biết nó là gì.
- "Tiêu điểm" badge và "Phương pháp luận" category label cạnh tranh nhau — 2 nhãn nhỏ liên tiếp trên Featured Section.

### 2. Information Architecture ★★★★☆

**Ưu điểm**: Cấu trúc rõ ràng — Homepage → Blog Index → Blog Post + About. Navigation đơn giản 3 links.

**Vấn đề**:
- **Thiếu breadcrumbs** trên trang bài viết — người dùng chỉ có "← Quay lại" mà không biết vị trí hiện tại trong cấu trúc site
- Nav link "Tuyển tập" trỏ tới `/#tuyen-tap` (anchor trên homepage) — confusing nếu user đang ở trang khác và kỳ vọng được đưa tới một trang riêng

### 3. Emotional Resonance ★★★★★

**Điểm mạnh nhất** của trang web. Mọi quyết định thiết kế đều nhất quán với tinh thần "hàn lâm, trí tuệ, trầm lắng":
- Grain texture → giấy cũ
- Grid lines → sổ vẽ kỹ thuật  
- Grayscale photos → editorial nghiêm túc
- Crimson Pro serif → sách triết học
- Trích dẫn Pascal → ngay lập tức thiết lập tone
- Warm palette (paper #F9F7F1, sand, chalk) → thư viện cổ

> [!TIP]
> Đây là phần nên giữ nguyên. Emotional resonance là tài sản quý nhất của thiết kế này.

### 4. Discoverability & Affordance ★★★☆☆

**Vấn đề**:
- **Grid lines gây nhầm lẫn**: Đường kẻ dọc trang trí có thể bị hiểu nhầm là ranh giới cột hoặc interactive element, nhất là trên mobile
- **Theme toggle icon**: Icon Sun/Moon ở góc phải navbar nhỏ và không có label text — user mới có thể không biết đó là nút chuyển theme
- **"Đọc bài viết"** CTA trên Featured Section thiếu visual weight — chỉ là text link monospace cỡ nhỏ, dễ bị bỏ qua
- **Article cards**: Toàn bộ card là 1 link nhưng không có visual feedback nào (underline, arrow) cho đến khi hover — có thể cải thiện discoverability trên touch devices

### 5. Composition & Balance ★★★★☆

**Ưu điểm**: 
- Hero layout asymmetric (8-col title + 4-col sidebar) tạo rhythm tốt
- Featured Section 50/50 split text/image rất editorial
- Whitespace generous và intentional

**Vấn đề**:
- **Quote Section centered** trong khi mọi thứ khác left-aligned → phá vỡ visual consistency
- **Footer 3-column grid** thiếu cân bằng — cột "Liên hệ" chỉ có 2 items (Liên hệ, Email), trông trống trải
- Trên Homepage, khi chỉ có 2 article cards (sau khi 1 post đã lên Featured), grid 3 cột để trống 1 ô → unbalanced

### 6. Typography as Communication ★★★★☆

**Ưu điểm**:
- **Font pairing tuyệt vời**: Crimson Pro (serif, cho scholarly feel) + Be Vietnam Pro (sans, tối ưu cho diacritics tiếng Việt) + IBM Plex Mono (cho labels kỹ thuật)
- Fluid typography scale với `clamp()` — responsive tự nhiên
- Line-height 1.75 cho body text — rất thoải mái để đọc long-form

**Vấn đề**:
- **Quá lạm dụng font-mono uppercase tracking-widest**: Pattern này xuất hiện ở *mọi nơi* — navbar links, section labels, article meta, footer headings, category badges, TOC header, đọc thêm links. Tạo cảm giác mọi thứ đều "hét" cùng một kiểu
- **Category labels cỡ 10px** (`text-[10px]`) quá nhỏ — dưới mức readable tối thiểu, đặc biệt trên mobile
- **Date format inconsistent**: "24 THÁNG 2, 2026" vs "6 Tháng 3, 2026" — khác nhau giữa card footer và article header

### 7. Color with Purpose ★★★★☆

**Ưu điểm**:
- Palette cohesive: paper → ink → sand → leather tạo spectrum ấm áp
- Category colors có ý nghĩa: Blue = Logic, Red = Nhận thức luận, Green = Đạo đức luận, Yellow = Nghịch lý
- Tinted neutrals (#F9F7F1 thay vì pure white) — đúng theo guideline
- Dark mode dùng `#1C1B1A` (leather) thay vì pure black ✅

**Vấn đề**:
- **QuoteSection hardcoded**: Background dùng `linear-gradient(135deg, var(--color-ink))` — luôn là dark bất kể theme. Tạo "dark stripe" giữa light mode page
- **Accent color thay đổi giữa themes**: Light dùng `--academic-blue`, Dark dùng `--academic-yellow`. Điều này khiến visual identity không nhất quán khi user chuyển theme
- **3 chấm trang trí ở footer** (đỏ, xanh, vàng) — decorative nhưng không communicate gì, vô nghĩa

### 8. States & Edge Cases ★★★☆☆

**Vấn đề**:
- **Empty state** khi không có bài viết: chỉ text "Chưa có bài viết nào. Hãy quay lại sớm!" — không guide action, không engaging
- **Loading state**: Spinner + "Đang tải..." — functional nhưng generic, không match phong cách editorial của site
- **Error state**: Khá tốt — hiện lỗi + mã lỗi + 2 CTA (Thử lại, Về trang chủ)
- **404 page**: Copy tốt ("Phải chăng trang bạn tìm kiếm đang tồn tại trong một không gian khác của vũ trụ?") nhưng thiếu visual — chỉ text trên nền trắng/tối
- **Mobile TOC**: Dùng conditional render (`{mobileOpen && ...}`) thay vì animate → instantly appears/disappears, jarring
- **Featured image grayscale → color on hover**: Thay đổi unexpectedly, không có instruction cho user biết "hover để xem màu"

### 9. Microcopy & Voice ★★★★★

**Điểm mạnh**: Toàn bộ UI copy bằng tiếng Việt, tự nhiên và consistent:
- "Chuyển đến nội dung chính" (skip-to-content)
- "Bật chế độ sáng/tối"
- "5 phút đọc"
- "Có thể bạn cũng quan tâm"
- "Đã sao chép!"

Voice intellectual, không quá formal, phù hợp target audience.

### 10. Motion & Animation ★★★☆☆

**Ưu điểm**:
- `prefers-reduced-motion` được respect toàn bộ ✅
- Scroll-triggered animations (`fade-up`, `scale-up`) tinh tế
- Theme transition 500ms smooth

**Vấn đề**:
- **Staggered card animations**: `delay={index * 100}` — mỗi card delay 100ms. Với 2-3 cards thì OK, nhưng nếu list dài sẽ khiến user chờ lâu để thấy content
- **Featured image zoom on hover** (`group-hover:scale-105 transition-transform duration-[1.5s]`) — 1500ms quá chậm, cảm giác laggy
- **Không có exit animation**: Mobile menu có entrance animation (slide-in, staggered links) nhưng khi đóng chỉ có transition cơ bản

---

## III. Audit — Detailed Findings

### 🔴 Critical Issues

#### C-1: KaTeX CSS Integrity Hash Mismatch
- **Location**: [layout.tsx:51-56](file:///home/machiavelli127/Documents/logos-ethos/app/layout.tsx#L51-L56)
- **Category**: Performance / Functionality
- **Description**: KaTeX CSS loaded with `integrity` attribute. Browser console shows `Failed to find a valid digest` — CSS bị block, **tất cả công thức toán học không render được**
- **Impact**: Với một blog về Toán học, đây là critical — nội dung cốt lõi bị hỏng
- **Recommendation**: Cập nhật integrity hash hoặc self-host KaTeX CSS
- **Suggested command**: `/harden`

#### C-2: `usedHeadingIds` Map — Global Mutable State
- **Location**: [blog/[slug]/page.tsx:187](file:///home/machiavelli127/Documents/logos-ethos/app/blog/%5Bslug%5D/page.tsx#L187)
- **Category**: Performance / Bug
- **Description**: `usedHeadingIds` là `Map()` toàn cục, không reset giữa các renders. Trong SSG, mỗi page build accumulates IDs → có thể gây duplicate hoặc incorrect heading IDs
- **Impact**: TOC links có thể không hoạt động đúng
- **Recommendation**: Reset map trước mỗi MDX render hoặc chuyển sang local scope

### 🟠 High-Severity Issues

#### H-1: Grid Lines — Visual Noise trên Mobile
- **Location**: [GridLines.tsx](file:///home/machiavelli127/Documents/logos-ethos/components/GridLines.tsx)
- **Severity**: High
- **Category**: Responsive / UX
- **Description**: Grid lines dọc hiển thị ở 25% intervals. Trên mobile (375px), các đường này cách nhau ~94px — quá dày đặc, tạo visual noise
- **Impact**: Giảm readability trên mobile, phân tán attention khỏi content
- **Recommendation**: Ẩn hoặc giảm opacity grid lines dưới breakpoint [md](file:///home/machiavelli127/Documents/logos-ethos/README.md) (768px)
- **Suggested command**: `/quieter` hoặc `/optimize`

#### H-2: QuoteSection — Hardcoded Dark Background
- **Location**: [QuoteSection.tsx:19-21](file:///home/machiavelli127/Documents/logos-ethos/components/QuoteSection.tsx#L19-L21)
- **Severity**: High
- **Category**: Theming
- **Description**: Background luôn dùng `var(--color-ink)` → luôn là nền tối, ngay cả trong Light mode. Tạo "dark stripe" chói giữa trang sáng
- **Impact**: Phá vỡ visual consistency của light theme
- **Recommendation**: Tạo variant cho light mode hoặc dùng CSS variables theo theme
- **Suggested command**: `/normalize`

#### H-3: Article Card Images — Thiếu `loading="lazy"`
- **Location**: [ArticleCard.tsx:33-41](file:///home/machiavelli127/Documents/logos-ethos/components/ArticleCard.tsx#L33-L41)
- **Severity**: High
- **Category**: Performance
- **Description**: Tất cả article card images đều load eagerly (Next.js Image mặc định `loading="lazy"` nhưng `placeholder="blur"` có thể override behavior). Cần verify actual behavior
- **Impact**: Nếu lazy loading không hoạt động, homepage loads tất cả images cùng lúc
- **Recommendation**: Explicit set `loading="lazy"` và verify trong Network tab
- **Suggested command**: `/optimize`

#### H-4: Touch Target — Theme Toggle quá nhỏ
- **Location**: [ThemeToggle.tsx:69-82](file:///home/machiavelli127/Documents/logos-ethos/components/ThemeToggle.tsx#L69-L82)
- **Severity**: High
- **Category**: Accessibility
- **Description**: Button chỉ có `p-2` padding (~8px) với icon 20px → tổng touch target ~36x36px, dưới mức WCAG 44x44px
- **Impact**: Khó tap trên mobile
- **Recommendation**: Tăng `p-2` lên `p-3` (48x48px) trên mobile
- **Suggested command**: `/harden`

### 🟡 Medium-Severity Issues

#### M-1: Category Labels — Font Size 10px
- **Location**: [ArticleCard.tsx:61](file:///home/machiavelli127/Documents/logos-ethos/components/ArticleCard.tsx#L61), [blog/[slug]/page.tsx:307](file:///home/machiavelli127/Documents/logos-ethos/app/blog/%5Bslug%5D/page.tsx#L307)
- **Category**: Accessibility
- **Description**: `text-[10px]` cho category labels — dưới minimum recommended 12px
- **WCAG**: 1.4.4 Resize Text
- **Recommendation**: Tăng lên `text-[11px]` hoặc `text-xs` (12px)
- **Suggested command**: `/polish`

#### M-2: Featured Image — Grayscale Filter Bất Ngờ
- **Location**: [FeaturedSection.tsx:60](file:///home/machiavelli127/Documents/logos-ethos/components/FeaturedSection.tsx#L60), [blog/[slug]/page.tsx:337](file:///home/machiavelli127/Documents/logos-ethos/app/blog/%5Bslug%5D/page.tsx#L337)
- **Category**: UX
- **Description**: Ảnh Featured và Blog Post mặc định grayscale, hover → color. Không có affordance nào gợi ý cho user "hover để thấy ảnh gốc". Trên mobile không hover → user không bao giờ thấy ảnh màu
- **Impact**: Mobile users luôn thấy ảnh xám — giảm visual appeal
- **Recommendation**: Bỏ grayscale filter hoặc chỉ áp dụng trên hover (invert logic), hoặc dùng grayscale nhẹ hơn (`grayscale-[60%]`)
- **Suggested command**: `/bolder` hoặc `/colorize`

#### M-3: Lạm dụng Font Mono Uppercase
- **Category**: Typography
- **Description**: Pattern `font-mono text-xs uppercase tracking-widest` xuất hiện ở **ít nhất 15 vị trí**: navbar links, section labels, category badges, date/time, footer headings, TOC header, "Đọc bài viết" CTA, "Chia sẻ", "Lưu", "Quay lại"... Tất cả trông giống nhau, phá vỡ hierarchy
- **Recommendation**: Giảm xuống 3-4 vị trí quan trọng (labels, meta). Dùng sans-serif regular cho phần còn lại
- **Suggested command**: `/distill`

#### M-4: "Tiêu điểm" Badge — Redundant
- **Location**: [FeaturedSection.tsx:21-23](file:///home/machiavelli127/Documents/logos-ethos/components/FeaturedSection.tsx#L21-L23)
- **Category**: UX Writing
- **Description**: Badge "Tiêu điểm" + Category label + Section title "Suy ngẫm & Lý luận" = 3 lớp labeling cho cùng 1 section. Redundant
- **Recommendation**: Bỏ badge "Tiêu điểm" — featured position đã communicate đủ
- **Suggested command**: `/distill`

#### M-5: Body Overlays — 3 Fixed Layers Performance
- **Location**: [globals.css:107-145](file:///home/machiavelli127/Documents/logos-ethos/app/globals.css#L107-L145), [GridLines.tsx](file:///home/machiavelli127/Documents/logos-ethos/components/GridLines.tsx)
- **Category**: Performance
- **Description**: 3 fixed overlay trên mọi page: `body::before` (grain), `body::after` (hero glow), [GridLines](file:///home/machiavelli127/Documents/logos-ethos/components/GridLines.tsx#1-30) (grid). Tổng 3 compositing layers phủ toàn viewport
- **Impact**: GPU memory trên thiết bị yếu, potential jank khi scroll
- **Recommendation**: Gom grain + grid vào 1 layer duy nhất bằng multi-background, hoặc disable trên mobile
- **Suggested command**: `/optimize`

#### M-6: Mobile TOC — Instant Show/Hide
- **Location**: [TableOfContents.tsx:151-155](file:///home/machiavelli127/Documents/logos-ethos/components/TableOfContents.tsx#L151-L155)
- **Category**: Motion
- **Description**: Dùng conditional render `{mobileOpen && ...}` → content instantly appears. Không có slide/expand animation
- **Recommendation**: Dùng `grid-template-rows: 0fr → 1fr` transition (như frontend-design skill khuyến nghị)
- **Suggested command**: `/animate`

### 🟢 Low-Severity Issues

#### L-1: Hero Sidebar — Vô mục đích
- **Location**: [HeroSection.tsx:25-38](file:///home/machiavelli127/Documents/logos-ethos/components/HeroSection.tsx#L25-L38)
- **Description**: 3 items (Lập luận & Phân tích, Nghịch lý & Bất toàn, Logic & Đạo đức luận) không phải links, không phải filter, chỉ là labels tĩnh
- **Recommendation**: Biến thành links tới category pages, hoặc loại bỏ nếu không phục vụ mục đích

#### L-2: Footer Dots — Decorative Noise
- **Location**: [Footer.tsx:74-78](file:///home/machiavelli127/Documents/logos-ethos/components/Footer.tsx#L74-L78)
- **Description**: 3 chấm tròn red/blue/yellow ở footer — decorative nhưng không communicate gì
- **Recommendation**: Giữ hoặc bỏ — low priority

#### L-3: Date Format Inconsistency
- **Description**: "24 THÁNG 2, 2026" (mono uppercase trong cards) vs "6 Tháng 3, 2026" (mixed case trong article header)
- **Recommendation**: Standardize format xuyên suốt

#### L-4: `ease-spring` Token Unused/Risky
- **Location**: [globals.css:40](file:///home/machiavelli127/Documents/logos-ethos/app/globals.css#L40)
- **Description**: `--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275)` — bounce easing, vi phạm DON'T rule. Hiện chưa thấy sử dụng nhưng tồn tại sẵn trong token
- **Recommendation**: Xóa token này để tránh vô tình dùng

---

## IV. Patterns & Systemic Issues

### Pattern 1: "Mono-uppercase-tracking" Syndrome
Font mono + uppercase + letter-spacing widest trở thành *default styling* cho mọi text nhỏ. Tạo cảm giác đơn điệu khi tất cả labels, dates, category names, CTAs, menu items đều trông giống nhau.

### Pattern 2: Centered vs Left-Aligned Conflicts
Site chủ yếu left-aligned (hero, featured, articles) nhưng QuoteSection, blog post header, about contact section centered → không nhất quán.

### Pattern 3: Fixed Overlays Accumulation
Mỗi lần thêm "enhancement" decorative (grain, grid, glow) đều thêm 1 fixed overlay. Cần cân nhắc performance budget cho mobile.

---

## V. Positive Findings ✨

| Điểm mạnh | Chi tiết |
|---|---|
| **Emotional coherence** | Mọi quyết định (font, color, texture, photo treatment) đều reinforce identity "thư viện cổ điển" |
| **Vietnamese typography** | Be Vietnam Pro chosen specifically cho diacritics — không phải "random font" |
| **Accessibility foundation** | Skip-to-content, ARIA labels, `prefers-reduced-motion` respect, keyboard navigation on mobile menu |
| **Reading experience** | Blog post layout: max-w-3xl centered, responsive TOC, reading progress bar, comfortable line-height |
| **Dark mode quality** | Không chỉ đảo màu — có layered surfaces, warm glow, adjusted opacities |
| **Category color system** | Functional, meaningful color mapping cho từng danh mục bài viết |
| **Performance-aware code** | `scaleX` for reading progress, `will-change`, `contain: strict`, RAF-throttled scroll |

---

## VI. Recommendations by Priority

### 🚨 Immediate (Tuần này)
1. **Fix KaTeX CSS** — Nội dung toán học không render → C-1 → `/harden`
2. **Fix `usedHeadingIds`** global state → C-2 → manual fix
3. **Increase touch targets** → H-4 → `/harden`

### 📋 Short-term (Sprint này)
4. **Grid lines on mobile** — Ẩn/giảm dưới 768px → H-1 → `/quieter`
5. **QuoteSection theming** — Tạo light variant → H-2 → `/normalize`
6. **Grayscale filter rethink** — Bỏ trên mobile → M-2 → `/colorize`
7. **Fix category label size** — 10px → 12px → M-1 → `/polish`

### 📐 Medium-term (Sprint tới)
8. **Reduce mono-uppercase overuse** → M-3 → `/distill`
9. **Add TOC expand animation** → M-6 → `/animate`
10. **Performance: merge overlays** → M-5 → `/optimize`
11. **Remove "Tiêu điểm" redundancy** → M-4 → `/distill`

### 🎯 Long-term (Backlog)
12. Hero sidebar → links hoặc remove → L-1
13. Date format consistency → L-3 → `/normalize`
14. Enhanced empty/loading states → `/delight`
15. Enhanced 404 page → `/delight`

---

## VII. Suggested Commands Map

| Command | Issues Addressed | Count |
|---|---|---|
| `/harden` | C-1, C-2, H-4 | 3 |
| `/quieter` | H-1, M-5 | 2 |
| `/normalize` | H-2, L-3 | 2 |
| `/optimize` | H-3, M-5 | 2 |
| `/distill` | M-3, M-4 | 2 |
| `/polish` | M-1, L-4 | 2 |
| `/colorize` | M-2 | 1 |
| `/animate` | M-6 | 1 |
| `/delight` | L-1, empty states, 404 | 2-3 |

---

## VIII. Tổng kết

**Logos & Ethos có một trong những thiết kế blog cá nhân đáng nhớ nhất** — personality rõ ràng, emotional resonance mạnh mẽ, và technical foundation vững chắc. Trang web "có gu" theo đúng nghĩa: font pairing có lý do, color palette kể chuyện, texture tạo bầu không khí.

**3 việc quan trọng nhất cần làm:**
1. **Fix KaTeX** — blog về Toán mà không render được công thức thì mất hồn
2. **Giảm visual noise trên mobile** — grid lines + grain + 10px text = khó đọc
3. **Đa dạng hóa typography styling** — phá vỡ sự đơn điệu của mono-uppercase pattern

> Thiết kế tốt là thiết kế có quan điểm. Logos & Ethos có quan điểm. Giờ cần tinh chỉnh để quan điểm đó dễ tiếp cận hơn cho mọi người.
