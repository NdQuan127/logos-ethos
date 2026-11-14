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
    └── categories.yaml          # danh sách lĩnh vực
```

- Tên thư mục chỉ dùng chữ thường không dấu, số và `-`. Đổi tên thư mục là đổi URL, nên tránh đổi sau khi đã xuất bản.
- Thư mục hoặc file bắt đầu bằng `_` bị bỏ qua.

## Frontmatter

| Trường        | Bắt buộc       | Ghi chú                                                                     |
| ------------- | -------------- | --------------------------------------------------------------------------- |
| `title`       | ✓              |                                                                             |
| `description` | ✓              | 40–220 ký tự. Dùng cho thẻ bài viết, meta description, RSS.                 |
| `date`        | ✓              | `YYYY-MM-DD`                                                                |
| `updated`     |                | Ngày sửa nội dung đáng kể. Hiện "Cập nhật …" và `dateModified` cho SEO.     |
| `category`    | ✓              | Một `id` trong `taxonomy/categories.yaml`.                                  |
| `tags`        |                | Danh sách tự do, ví dụ `["Gödel", "tự tham chiếu"]`. URL tự sinh không dấu. |
| `draft`       |                | `true` để ẩn khỏi production.                                               |
| `cover`       |                | Đường dẫn tương đối, ví dụ `./cover.jpg`. Hiện ở đầu trang bài.             |
| `coverAlt`    | khi có `cover` | Mô tả nội dung ảnh cho người dùng trình đọc màn hình.                       |
| `toc`         |                | `false` để ẩn mục lục (mặc định hiện).                                      |
| `sources`     |                | Tài liệu tham khảo: `title`, tuỳ chọn `author`, `url`.                      |

Giữ thứ tự trường như bảng trên để mọi bài trông giống nhau.

## Lĩnh vực và thẻ

- **Lĩnh vực** (`category`): mỗi bài đúng một lĩnh vực trong bốn: `toan-hoc`, `ai-hoc-may`, `triet-hoc`, `chinh-tri`. Mỗi mục trong `categories.yaml` có `id`, `name`, `description` và `tone` (`blue` | `green` | `violet` | `red`): màu chấm nhỏ đi kèm tên lĩnh vực, màu duy nhất của giao diện. Chủ đề hẹp hơn, như logic học hay nhận thức luận, dùng thẻ.
- **Thẻ** (`tags`): không cần khai báo trước. Viết thống nhất một cách (`Gödel`, không lúc `Godel` lúc `gödel`); `check:content` sẽ cảnh báo khi hai cách viết trùng URL hoặc khi một bài có quá 8 thẻ, và báo lỗi khi thẻ chỉ gồm ký hiệu (`∞`, `λ`) vì không tạo được URL.

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

| Component                                                         | Dùng cho                                                                                                      |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `<Theorem>`, `<Lemma>`, `<Proposition>`, `<Corollary>`, `<Axiom>` | Mệnh đề toán học. Nội dung in nghiêng theo quy ước. Tuỳ chọn `title`.                                         |
| `<Definition>`, `<Example>`, `<Remark>`                           | Định nghĩa, ví dụ, nhận xét. Tuỳ chọn `title`.                                                                |
| `<Proof>`                                                         | Chứng minh, gập lại được, tự thêm ∎. Tuỳ chọn `label="Phác thảo chứng minh"`.                                 |
| `<Term original="Consistency">Tính nhất quán</Term>`              | Thuật ngữ kèm tên gốc. Tuỳ chọn `lang` (mặc định `en`).                                                       |
| `<Callout type="note \| warning \| idea" title="…">`              | Hộp ghi chú.                                                                                                  |
| `từ<Sidenote>…</Sidenote>`                                        | Ghi chú đánh chữ (a, b, c), viết ngay sau từ cần giải thích. Bấm hoặc rê chuột lên chữ để mở trong một ô nổi. |
| `<PullQuote author="…">`                                          | Trích dẫn nổi bật.                                                                                            |
| `<Figure>`                                                        | Ảnh có chú thích (xem trên).                                                                                  |

```mdx
<Theorem title="Bất toàn thứ nhất">
  Mọi hệ hình thức nhất quán, đủ mạnh đều chứa một mệnh đề $G$ không thể chứng minh cũng không thể bác bỏ.
</Theorem>

<Proof label="Phác thảo chứng minh">Xây dựng câu $G$ nói rằng "$G$ không chứng minh được"…</Proof>
```

Thêm component mới: tạo file trong `src/components/mdx/`, đăng ký trong `index.ts`, thêm một dòng vào bảng trên.

## Những gì được sinh tự động

- Thời gian đọc, mục lục (khi bài có từ ba mục), bài mới hơn và cũ hơn ở cuối bài.
- Trang chủ liệt kê mọi bài, mới nhất trước. Trang lĩnh vực `/blog/chu-de/<id>/` và thẻ `/blog/tag/<thẻ>/`.
- Chú thích `[^1]` hiện thành số tròn, rê chuột hoặc bấm để đọc ngay tại chỗ; danh sách đầy đủ vẫn ở cuối bài.
- Khối code có tô màu theo hai nền và nút chép; bảng và công thức dài cuộn ngang trong khung riêng; ảnh lớn bấm để phóng to.
- Ảnh chia sẻ mạng xã hội (1200×630) cho từng bài tại `/og/<slug>.png`, vẽ lúc build từ tiêu đề và lĩnh vực.
- `rss.xml`, `sitemap-index.xml`, `search.json` cho ô tìm kiếm (`Ctrl K`).

## Soát giao diện

- `/thanh-phan/`: bảng màu, thang chữ và các component, không có trong menu và không cho máy tìm kiếm lập chỉ mục.
- `/blog/kitchen-sink/` (chỉ khi chạy `npm run dev`): bài nháp chứa mọi phần tử Markdown và mọi thẻ MDX. Sửa style thân bài thì mở bài này ở cả hai nền và khổ điện thoại.
