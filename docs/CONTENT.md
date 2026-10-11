# Quy ước nội dung

Mọi bài viết đi qua cùng một quy trình: tạo từ template, viết bằng MDX, kiểm tra tự động, rồi xuất bản bằng cách bỏ `draft`. Build sẽ dừng lại nếu frontmatter sai, nên bạn không cần nhớ quy ước, chỉ cần đọc thông báo lỗi.

## Viết bài mới

```bash
npm run new -- "Nghịch lý Russell" --category toan-hoc
npm run dev
```

Lệnh trên tạo `src/content/blog/nghich-ly-russell/index.mdx` với `draft: true`. Bài nháp hiện khi chạy `npm run dev` (có nhãn "Bản nháp") nhưng bị loại khỏi bản build production, RSS và sitemap. Khi viết xong, xoá dòng `draft: true`.

Trước khi đẩy lên:

```bash
npm run check:content   # cấu trúc thư mục, liên kết nội bộ, thẻ trùng, tiêu đề
npm run build           # kiểm tra schema frontmatter
npm run verify          # mọi link, anchor (#...) và ảnh trong bản build đều tồn tại
```

Hoặc chạy `npm run ci` để làm mọi bước kiểm tra một lượt.

## Cấu trúc thư mục

```text
src/content/
├── blog/
│   ├── _template/index.mdx      # mẫu cho `npm run new`, không được xuất bản
│   └── dinh-ly-godel/           # tên thư mục = URL /blog/dinh-ly-godel/
│       ├── index.mdx
│       └── cover.jpg            # ảnh của bài nằm cạnh bài
└── taxonomy/
    ├── categories.yaml          # danh sách lĩnh vực
    └── series.yaml              # danh sách chuyên đề
```

- Tên thư mục chỉ dùng chữ thường không dấu, số và `-`. Đổi tên thư mục là đổi URL, nên tránh đổi sau khi đã xuất bản.
- Thư mục hoặc file bắt đầu bằng `_` bị bỏ qua.

## Frontmatter

| Trường        | Bắt buộc        | Ghi chú                                                                              |
| ------------- | --------------- | ------------------------------------------------------------------------------------ |
| `title`       | ✓               |                                                                                      |
| `description` | ✓               | 40–220 ký tự. Dùng cho thẻ bài viết, meta description, RSS.                          |
| `date`        | ✓               | `YYYY-MM-DD`                                                                         |
| `updated`     |                 | Ngày sửa nội dung đáng kể. Hiện "Cập nhật …" và `dateModified` cho SEO.              |
| `category`    | ✓               | Một `id` trong `taxonomy/categories.yaml`.                                           |
| `tags`        |                 | Danh sách tự do, ví dụ `["Gödel", "tự tham chiếu"]`. URL tự sinh không dấu.          |
| `series`      |                 | Một `id` trong `taxonomy/series.yaml`. Đi kèm `seriesOrder`.                         |
| `seriesOrder` | khi có `series` | Số thứ tự trong chuyên đề, bắt đầu từ 1.                                             |
| `draft`       |                 | `true` để ẩn khỏi production.                                                        |
| `featured`    |                 | Ghim lên vị trí nổi bật ở trang chủ. Nếu không bài nào ghim, bài mới nhất được chọn. |
| `cover`       |                 | Đường dẫn tương đối, ví dụ `./cover.jpg`. Hiện ở trang bài và ô bìa, phủ hai tông.   |
| `coverAlt`    | khi có `cover`  | Mô tả nội dung ảnh cho người dùng trình đọc màn hình.                                |
| `artCover`    |                 | `true` để hiện bìa tự sinh trên trang bài khi không có `cover`.                      |
| `toc`         |                 | `false` để ẩn mục lục (mặc định hiện).                                               |
| `sources`     |                 | Tài liệu tham khảo: `title`, tuỳ chọn `author`, `url`.                               |

Giữ thứ tự trường như bảng trên để mọi bài trông giống nhau.

## Lĩnh vực, thẻ và chuyên đề

- **Lĩnh vực** (`category`): mỗi bài đúng một lĩnh vực trong bốn: `toan-hoc`, `ai-hoc-may`, `triet-hoc`, `chinh-tri`. Mỗi mục trong `categories.yaml` có `id`, `name`, `description`, `tone` (`blue` | `green` | `violet` | `red`: chọn màu nhãn và hình vẽ trên bìa tự sinh), `symbol` (ký tự lớn trên bìa). Chủ đề hẹp hơn, như logic học hay nhận thức luận, dùng thẻ.
- **Thẻ** (`tags`): không cần khai báo trước. Viết thống nhất một cách (`Gödel`, không lúc `Godel` lúc `gödel`); `check:content` sẽ cảnh báo khi hai cách viết trùng URL hoặc khi một bài có quá 8 thẻ, và báo lỗi khi thẻ chỉ gồm ký hiệu (`∞`, `λ`) vì không tạo được URL.
- **Chuyên đề** (`series`): khai báo trong `series.yaml` (`id`, `title`, `description`, tuỳ chọn `symbol` cho bìa), rồi gắn `series` + `seriesOrder` cho từng bài. Trang `/blog/loat-bai/<id>/` và khung điều hướng "Phần trước / Phần tiếp" tự sinh. Trang chủ hiện kệ chuyên đề khi có từ hai chuyên đề.

## Viết nội dung

Tiêu đề trong bài bắt đầu từ `##` (tiêu đề bài đã là h1). Chỉ `##` xuất hiện trong mục lục; `###` thì không, để mục lục không dài quá màn hình.

### Toán

```mdx
Công thức trong dòng $a^2 + b^2 = c^2$ và công thức riêng dòng:

$$
\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}
$$
```

### Chú thích cuối trang

```mdx
Gödel công bố kết quả năm 1931.[^1]

[^1]: Kurt Gödel, _Über formal unentscheidbare Sätze…_
```

### Ảnh

Ảnh thường dùng cú pháp Markdown, Astro tự tối ưu:

```mdx
![Mô tả ảnh](./hilbert.jpg)
```

Ảnh có chú thích dùng `<Figure>`:

```mdx
import hilbert from './hilbert.jpg';

<Figure src={hilbert} alt="David Hilbert năm 1912" caption="David Hilbert" credit="Ảnh: Wikimedia Commons" />
```

### Component có sẵn

Dùng trực tiếp trong mọi bài, không cần `import`. Danh sách đăng ký tại `src/components/mdx/index.ts`.

| Component                                                         | Dùng cho                                                                                                                      |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `<Theorem>`, `<Lemma>`, `<Proposition>`, `<Corollary>`, `<Axiom>` | Mệnh đề toán học. Nội dung in nghiêng theo quy ước. Tuỳ chọn `title`.                                                         |
| `<Definition>`, `<Example>`, `<Remark>`                           | Định nghĩa, ví dụ, nhận xét. Tuỳ chọn `title`.                                                                                |
| `<Proof>`                                                         | Chứng minh, tự thêm ∎. Tuỳ chọn `label="Phác thảo chứng minh"`.                                                               |
| `<Term original="Consistency">Tính nhất quán</Term>`              | Thuật ngữ kèm tên gốc. Tuỳ chọn `lang` (mặc định `en`).                                                                       |
| `<Callout type="note \| warning \| idea" title="…">`              | Hộp ghi chú.                                                                                                                  |
| `từ<Sidenote>…</Sidenote>`                                        | Ghi chú đánh chữ (a, b, c), viết ngay sau từ cần giải thích. Nằm ở lề phải trên màn hình rộng; trên điện thoại bấm chữ để mở. |
| `<PullQuote author="…">`                                          | Trích dẫn nổi bật.                                                                                                            |
| `<Figure>`                                                        | Ảnh có chú thích (xem trên).                                                                                                  |

```mdx
<Theorem title="Bất toàn thứ nhất">
  Mọi hệ hình thức nhất quán, đủ mạnh đều chứa một mệnh đề $G$ không thể chứng minh cũng không thể bác bỏ.
</Theorem>

<Proof label="Phác thảo chứng minh">Xây dựng câu $G$ nói rằng "$G$ không chứng minh được"…</Proof>
```

Thêm component mới: tạo file trong `src/components/mdx/`, đăng ký trong `index.ts`, thêm một dòng vào bảng trên.

## Những gì được sinh tự động

- Thời gian đọc, mục lục, bài liên quan (ưu tiên cùng chuyên đề, rồi cùng lĩnh vực, rồi thẻ chung).
- Trang lĩnh vực `/blog/chu-de/<id>/`, thẻ `/blog/tag/<thẻ>/`, chuyên đề `/blog/loat-bai/<id>/`.
- Bìa tự sinh cho bài nổi bật ở trang chủ và cho chuyên đề, theo hình vẽ của lĩnh vực.
- `rss.xml`, `sitemap-index.xml`, ảnh chia sẻ mạng xã hội (1200×630) từ `cover`.

## Ghi chú

- Khi `series.yaml` còn rỗng, build in cảnh báo `The collection "series" does not exist or is empty`. Cảnh báo này vô hại và tự hết khi có chuyên đề đầu tiên.
