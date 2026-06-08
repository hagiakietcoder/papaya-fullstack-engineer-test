# AI Engineering Challenges

**Cấp độ:** Beginner  
**Trạng thái:** 🔄 Challenge 01–09 hoàn thành

---

## Danh sách bài làm

| # | Bài | Cấp độ | Thời gian ước lượng | Trạng thái | Link |
|---|-----|--------|---------------------|------------|------|
| 01 | [Insurance Plan Comparison Page](./challenge-01/) | Beginner | 2–3 giờ | ✅ Done | Live URL: _pending deploy_ |
| 02 | [Claims Data Cleanup & Report](./challenge-02/) | Beginner | 2–3 giờ | ✅ Done | [Report](./challenge-02/output/data_quality_report.md) |
| 03 | [Claim Notification Email Templates](./challenge-03/) | Beginner | 2–3 giờ | ✅ Done | Live URL: _pending deploy_ |
| 04 | [Insurance Glossary Search App](./challenge-04/) | Beginner | 2–3 giờ | ✅ Done | Live URL: _pending deploy_ |
| 05 | [Policy Summary Generator](./challenge-05/) | Beginner | 2–4 giờ | ✅ Done | Live URL: _pending deploy_ |
| 06 | [Policy Benefits Calculator](./challenge-06/) | Intermediate | 2–4 giờ | ✅ Done | [Results](./challenge-06/src/data/expected-results.json) |
| 07 | [Claims Intake Wizard](./challenge-07/) | Intermediate | 3–5 giờ | ✅ Done | Live URL: _pending deploy_ |
| 08 | [Medical Document Extractor](./challenge-08/) | Advanced | 4–6 giờ | ✅ Done | [Results](./challenge-08/documents/extraction-results.json) |
| 09 | [Claims Analytics Dashboard](./challenge-09/) | Intermediate | 3–5 giờ | ✅ Done | Live URL: _pending deploy_ |

---

## Challenge 01 — Insurance Plan Comparison Page

**Tech stack:** React + TypeScript + Vite

```powershell
cd challenge-01
npm install
npm run dev
```

**Deploy (Netlify):** Base directory = `ai-engineering-challenges/challenge-01`

---

## Challenge 02 — Claims Data Cleanup & Report

**Tech stack:** Python 3 (stdlib only)

```powershell
cd challenge-02
python run.py
```

→ Chi tiết: [`challenge-02/README.md`](./challenge-02/README.md)

---

## Challenge 03 — Claim Notification Email Templates

**Tech stack:** React + TypeScript + Vite

```powershell
cd challenge-03
npm install
npm run dev
```

**Deploy (Netlify):** Base directory = `ai-engineering-challenges/challenge-03`

→ Chi tiết: [`challenge-03/README.md`](./challenge-03/README.md)

---

## Challenge 04 — Insurance Glossary Search App

**Tech stack:** React + TypeScript + Vite

46 insurance terms, live search, A–Z jump, related term links.

```powershell
cd challenge-04
npm install
npm run dev
```

**Deploy (Netlify):** Base directory = `ai-engineering-challenges/challenge-04`

→ Chi tiết: [`challenge-04/README.md`](./challenge-04/README.md)

---

## Challenge 05 — Policy Summary Generator

**Tech stack:** React + TypeScript + Vite

Policy JSON → formatted HTML summary. 2 sample policies included.

```powershell
cd challenge-05
npm install
npm run dev
```

**Deploy (Netlify):** Base directory = `ai-engineering-challenges/challenge-05`

→ Chi tiết: [`challenge-05/README.md`](./challenge-05/README.md)

---

## Challenge 06 — Policy Benefits Calculator

**Tech stack:** TypeScript + Vitest (library module, no web UI)

Policy JSON + 20 expenses → covered amount per claim with explanations. Chronological processing with running limits.

```powershell
cd challenge-06
npm install
npm test
npm run calculate
```

→ Chi tiết: [`challenge-06/README.md`](./challenge-06/README.md)

---

## Challenge 07 — Claims Intake Wizard

**Tech stack:** React + TypeScript + Vite

5-step claim submission wizard with conditional logic, ICD-10 autocomplete, document upload, and review.

```powershell
cd challenge-07
npm install
npm run dev
```

**Deploy (Netlify):** Base directory = `ai-engineering-challenges/challenge-07`

→ Chi tiết: [`challenge-07/README.md`](./challenge-07/README.md)

---

## Challenge 08 — Medical Document Extractor

**Tech stack:** TypeScript + Vision LLM (Claude / GPT-4o)

10 mock medical documents → structured JSON extraction with confidence scores and validation.

```powershell
cd challenge-08
npm install
npm run setup-docs
npm test
npm run extract:all
```

→ Chi tiết: [`challenge-08/README.md`](./challenge-08/README.md) · [`PROMPT_ENGINEERING.md`](./challenge-08/PROMPT_ENGINEERING.md)

---

## Challenge 09 — Claims Analytics Dashboard

**Tech stack:** React + TypeScript + Vite + Recharts

5,000-claim dataset → interactive KPIs, 6 charts, global filters, drill-down table, CSV export.

```powershell
cd challenge-09
npm install
npm run generate-data
npm run dev
```

**Deploy (Netlify):** Base directory = `ai-engineering-challenges/challenge-09`

→ Chi tiết: [`challenge-09/README.md`](./challenge-09/README.md)

---

## Commit & push lên GitHub

```powershell
cd d:\hgk\papaya-fullstack-engineer-test

git add .
git commit -m "Add AI challenge 05: policy summary generator"
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
| Challenge 03 (Beginner) | 2–3 giờ |
| Challenge 04 (Beginner) | 2–3 giờ |
| Challenge 05 (Beginner) | 2–4 giờ |
| Challenge 06 (Intermediate) | 2–4 giờ |
| Challenge 07 (Intermediate) | 3–5 giờ |
| Challenge 08 (Advanced) | 4–6 giờ |
| Challenge 09 (Intermediate) | 3–5 giờ |
| **Tổng (9 bài)** | **~23–36 giờ** |

**Tổng ước lượng ban đầu:** ~8 giờ (theo đề bài Papaya)
