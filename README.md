# Papaya Insurtech — Full-Stack Engineer Test

**Ứng viên:** Ha Gia Kiet  
**Vị trí:** Full-Stack Engineer  
**Trạng thái:** Đang làm bài (chưa nộp)

---

## Cấu trúc bài nộp

| Phần | Thư mục | Trạng thái |
|------|---------|------------|
| Logical Questions | [`logical-questions/`](./logical-questions/) | ✅ Đã trả lời 7 câu |
| AI Engineering Challenges | [`ai-engineering-challenges/`](./ai-engineering-challenges/) | 🔄 Challenge 01–04 done |

---

## Logical Questions

Đã chọn và trả lời **7 câu** (yêu cầu tối thiểu: 5 câu):

| Câu | Mức độ | Chủ đề |
|-----|--------|--------|
| [Q5](./logical-questions/Q05-forgot-item.md) | Trung cấp | Lần cuối bỏ quên đồ |
| [Q6](./logical-questions/Q06-movie-queue.md) | Trung cấp | Vị trí trong hàng đợi rạp chiếu phim |
| [Q7](./logical-questions/Q07-bus-seat.md) | Trung cấp | Vị trí ngồi trên xe buýt |
| [Q12](./logical-questions/Q12-refuel-guide.md) | Chuyên sâu | Hướng dẫn đổ xăng nhanh nhất |
| [Q14](./logical-questions/Q14-restroom-door.md) | Chuyên sâu | Thiết kế cửa nhà vệ sinh Nam công cộng |
| [Q15](./logical-questions/Q15-fruit-market.md) | Chuyên sâu | Chọn quầy trái cây "ngon, bổ, rẻ" |
| [Q17](./logical-questions/Q17-walking-with-child.md) | Chuyên sâu | Dắt con đi: khi nào bé dẫn, khi nào mình dẫn |

---

## AI Engineering Challenges

| # | Bài | Cấp độ | Live Demo / Output |
|---|-----|--------|---------------------|
| 01 | [Insurance Plan Comparison](./ai-engineering-challenges/challenge-01/) | Beginner | _pending deploy_ |
| 02 | [Claims Data Cleanup & Report](./ai-engineering-challenges/challenge-02/) | Beginner | [Report](./ai-engineering-challenges/challenge-02/output/data_quality_report.md) |
| 03 | [Claim Notification Email Templates](./ai-engineering-challenges/challenge-03/) | Beginner | _pending deploy_ |
| 04 | [Insurance Glossary Search App](./ai-engineering-challenges/challenge-04/) | Beginner | _pending deploy_ |

→ Xem [`ai-engineering-challenges/README.md`](./ai-engineering-challenges/README.md)

---

## Cách chạy Challenge 02

**Yêu cầu:** Python 3.10+ (không cần cài thêm package).

```powershell
cd d:\hgk\papaya-fullstack-engineer-test\ai-engineering-challenges\challenge-02
python run.py
```

Script sẽ tự động:

1. Tạo `data/claims_dirty.csv` (500 rows, có lỗi cố ý)
2. Làm sạch dữ liệu → `output/claims_clean.csv`
3. Xuất báo cáo → `output/data_quality_report.md`

**Chạy từng bước (tuỳ chọn):**

```powershell
cd d:\hgk\papaya-fullstack-engineer-test\ai-engineering-challenges\challenge-02\scripts
python generate_dirty_data.py
python clean_claims.py
```

**Kết quả mong đợi:**

```
Generated 500 dirty claim rows -> ...\data\claims_dirty.csv
Clean CSV written -> ...\output\claims_clean.csv (477 rows)
Report written -> ...\output\data_quality_report.md
```

Chi tiết: [`challenge-02/README.md`](./ai-engineering-challenges/challenge-02/README.md)

---

## Cách chạy Challenge 03

**Yêu cầu:** Node.js 18+

```powershell
cd d:\hgk\papaya-fullstack-engineer-test\ai-engineering-challenges\challenge-03
npm install
npm run dev
```

Mở http://localhost:5173 → chọn event type để xem email preview.

**Deploy preview (Netlify):** set Base directory = `ai-engineering-challenges/challenge-03`

Chi tiết: [`challenge-03/README.md`](./ai-engineering-challenges/challenge-03/README.md)

---

## Cách chạy Challenge 04

**Yêu cầu:** Node.js 18+

```powershell
cd d:\hgk\papaya-fullstack-engineer-test\ai-engineering-challenges\challenge-04
npm install
npm run dev
```

Mở http://localhost:5173 → search, browse categories, click A–Z jump.

**Deploy (Netlify):** set Base directory = `ai-engineering-challenges/challenge-04`

Chi tiết: [`challenge-04/README.md`](./ai-engineering-challenges/challenge-04/README.md)

---

## Cách commit & push lên GitHub

Repo remote: `https://github.com/hagiakietcoder/papaya-fullstack-engineer-test.git`

### Lần đầu push

```powershell
cd d:\hgk\papaya-fullstack-engineer-test

git add .
git commit -m "Submit Papaya test: logical questions + AI challenges 01 & 02"
git push -u origin main
```

### Cập nhật sau này (thêm challenge mới, sửa README, thêm live URL…)

```powershell
cd d:\hgk\papaya-fullstack-engineer-test

git add .
git commit -m "Add AI challenge 04: insurance glossary search app"
git push
```

### Kiểm tra trạng thái trước khi commit

```powershell
git status
git diff
```

### Link nộp bài

Sau khi push, gửi link repo cho Papaya:

**https://github.com/hagiakietcoder/papaya-fullstack-engineer-test**

Email: **people@papaya.asia**

---

## Ghi chú nộp bài

- **Email nộp:** people@papaya.asia
- **Hình thức:** Gửi link GitHub/GitLab tổng hợp câu trả lời
- **Thời hạn:** Không muộn hơn 5 ngày kể từ ngày nhận email
