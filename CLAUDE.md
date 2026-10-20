# iMango Studio site

Site tĩnh trong `public/`, không build. Deploy 2 nơi từ cùng thư mục:

- GitHub Pages (`.github/workflows/pages.yml`, tự chạy khi push `main`): https://dangmixx.github.io/imangostudio/ — gốc là `/imangostudio/`.
- Firebase Hosting (`firebase deploy --only hosting`, project `imango-studio`): gốc là `/`.

Vì 2 gốc khác nhau, **mọi link và file nội bộ dùng đường dẫn tương đối** (`../`, `img/icon.png`, `../../theme.css`), không bao giờ bắt đầu bằng `/`.

Toàn bộ nội dung trang bằng tiếng Anh.

## Cấu trúc

```
public/
  index.html            trang chủ: danh sách app (thẻ .game) + liên hệ + footer
  theme.css             bảng màu chung, nơi DUY NHẤT định nghĩa màu
  privacy/              privacy policy chung (app chưa có trang riêng, dùng cho closed test)
  <app>/index.html      trang giới thiệu app
  <app>/privacy/        privacy policy riêng của app
  <app>/img/            icon.png (512²), feature.png (1024×500), ảnh chụp màn hình
  404.html              trang lỗi
```

Slug `<app>` viết thường, nối bằng gạch ngang, theo tên app (`floating-overlay`, `manglo`). Không đổi slug khi app đã lên Play, vì URL privacy đã khai trong Play Console.

## Màu (bắt buộc)

Một bảng màu cho toàn site, lấy từ trang /floating-overlay/. Không dùng màu riêng theo từng app.

- Mọi trang link `theme.css` bằng đường dẫn tương đối, đặt ngay trước `<style>`: `<link rel="stylesheet" href="../theme.css">` (độ sâu tùy trang).
- Trong `<style>` của trang **chỉ dùng token**, không viết mã màu (`#hex`, `rgb()`, tên màu) và không khai lại `:root`:

| Token | Light | Dark | Dùng cho |
|---|---|---|---|
| `--bg` | `#f2f6fc` | `#0f141b` | nền trang, nền nút phụ |
| `--panel` | `#ffffff` | `#18202a` | thẻ / section / article |
| `--text` | `#1b2533` | `#e6edf5` | chữ chính |
| `--muted` | `#5f6b7a` | `#9aa8b8` | chữ phụ, ngày hiệu lực, footer |
| `--accent` | `#0d6fd8` | `#6fb2ff` | link, nút chính, điểm nhấn |
| `--accent-text` | `#ffffff` | `#18202a` | chữ trên nền `--accent` |
| `--line` | `#d6e2f2` | `#2a3644` | viền, đường kẻ bảng |

- Dark mode theo `prefers-color-scheme`; `data-theme="light"` / `"dark"` trên `<html>` ép theo ý. Cả hai đã nằm trong `theme.css`, trang không cần làm gì thêm.
- Đổi màu thì chỉ sửa `theme.css`, rồi chép y hệt sang khối `:root` trong `404.html`. `404.html` là ngoại lệ duy nhất: nó được trả về ở mọi độ sâu và trên 2 gốc khác nhau nên không link `theme.css` được.
- Màu thương hiệu của từng app chỉ nằm trong ảnh (icon, feature graphic, ảnh chụp), không nằm trong CSS.

## Bố cục và chữ

- Font: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`, 16px.
- Khung `main`: `max-width` 820px cho trang app, 760px cho trang privacy, lề ngang 16px.
- Thẻ: nền `--panel`, viền `--line`, `border-radius: 20px`. Nút: viên thuốc `border-radius: 999px`.
- Trang con có link quay lại ở đầu, class `.back`: trang app → `← iMango Studio` (`../`), trang privacy → `← <Tên app>` (`../`).
- Chạy tốt ở bề ngang điện thoại, không cuộn ngang; bảng rộng bọc trong `.wrap { overflow-x: auto }`.

## Thêm app mới

1. Chép `public/floating-overlay/` làm khung (trang app + privacy), đổi nội dung, ảnh để trong `img/`.
2. Thêm thẻ `.game` vào `public/index.html` (icon, tên, `<Thể loại> · <Nền tảng>`).
3. Privacy: nêu đúng những gì app thực sự làm (quyền, SDK, quảng cáo, dữ liệu lưu trên máy). Đầu file có comment chỉ ra bản gốc trong repo app và nhắc giữ khớp với Data safety. Khi đổi nội dung thì cập nhật "Effective date".
4. App chưa có privacy riêng (closed test) dùng `privacy/` chung, nhưng chỉ khi app không thu thập gì: không có quảng cáo, analytics, crash report, leaderboard, tài khoản.

## Kiểm tra trước khi commit

- Mở thử từng trang đã sửa ở cả light và dark (ví dụ `python -m http.server 8765 --directory public`).
- `grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(" public --include=*.html` chỉ được ra kết quả trong `404.html`.
