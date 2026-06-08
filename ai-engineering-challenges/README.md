# AI Engineering Challenges

**Cấp độ:** Beginner (Challenge 01)  
**Trạng thái:** 🔄 Đang làm — Challenge 01 hoàn thành, chờ deploy

---

## Danh sách bài làm

| # | Bài | Cấp độ | Thời gian ước lượng | Trạng thái | Link |
|---|-----|--------|---------------------|------------|------|
| 01 | [Insurance Plan Comparison Page](./challenge-01/) | Beginner | 2–3 giờ | ✅ Done | Live URL: _pending deploy_ |

---

## Challenge 01 — Insurance Plan Comparison Page

**Mô tả:** Trang web so sánh 3 gói bảo hiểm (Bronze, Silver, Gold) side-by-side.

**Tech stack:** React + TypeScript + Vite

### Chạy local

```bash
cd challenge-01
npm install
npm run dev
```

### Deploy (Netlify)

Repo có file `netlify.toml` ở thư mục gốc — import GitHub là deploy được.

| Bước | Việc cần làm |
|------|--------------|
| 1 | Push repo lên GitHub |
| 2 | [netlify.com](https://netlify.com) → **Add new site** → Import repo |
| 3 | Xác nhận build settings (Netlify đọc từ `netlify.toml`) |
| 4 | **Deploy site** → lấy live URL |

**CLI (tuỳ chọn):**

```bash
netlify login
cd challenge-01
netlify init
netlify deploy --prod
```

---

## Timeline tổng thể

| Challenge | Estimate |
|-----------|----------|
| Challenge 01 (Beginner) | 2–3 giờ |
| _Các challenge tiếp theo_ | TBD |

**Tổng ước lượng ban đầu:** ~8 giờ (theo đề bài Papaya)
