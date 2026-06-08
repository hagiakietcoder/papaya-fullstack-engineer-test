# AI Engineering Challenges

**Cấp độ:** Beginner  
**Trạng thái:** 🔄 Challenge 01 & 02 hoàn thành

---

## Danh sách bài làm

| # | Bài | Cấp độ | Thời gian ước lượng | Trạng thái | Link |
|---|-----|--------|---------------------|------------|------|
| 01 | [Insurance Plan Comparison Page](./challenge-01/) | Beginner | 2–3 giờ | ✅ Done | Live URL: _pending deploy_ |
| 02 | [Claims Data Cleanup & Report](./challenge-02/) | Beginner | 2–3 giờ | ✅ Done | [Report](./challenge-02/output/data_quality_report.md) |

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

---

## Challenge 02 — Claims Data Cleanup & Report

**Mô tả:** Script Python làm sạch CSV 500 claims và xuất báo cáo chất lượng dữ liệu.

**Tech stack:** Python 3 (stdlib only)

### Chạy

```powershell
cd d:\hgk\papaya-fullstack-engineer-test\ai-engineering-challenges\challenge-02
python run.py
```

**Output:**
- `data/claims_dirty.csv` — dữ liệu gốc có lỗi
- `output/claims_clean.csv` — dữ liệu đã làm sạch
- `output/data_quality_report.md` — báo cáo

→ Chi tiết: [`challenge-02/README.md`](./challenge-02/README.md)

---

## Commit & push lên GitHub

```powershell
cd d:\hgk\papaya-fullstack-engineer-test

# Lần đầu
git add .
git commit -m "Submit Papaya test: logical questions + AI challenges 01 & 02"
git push -u origin main

# Lần sau (cập nhật thêm)
git add .
git commit -m "Update: ..."
git push
```

**Repo:** https://github.com/hagiakietcoder/papaya-fullstack-engineer-test

**Nộp bài:** Gửi link repo về **people@papaya.asia**

---

## Timeline tổng thể

| Challenge | Estimate |
|-----------|----------|
| Challenge 01 (Beginner) | 2–3 giờ |
| Challenge 02 (Beginner) | 2–3 giờ |
| _Các challenge tiếp theo_ | TBD |

**Tổng ước lượng ban đầu:** ~8 giờ (theo đề bài Papaya)
