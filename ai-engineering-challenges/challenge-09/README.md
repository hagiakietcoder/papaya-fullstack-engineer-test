# Challenge 09 — Claims Analytics Dashboard

**Difficulty:** Intermediate · **Estimated time:** 3–5 hours  
**Status:** ✅ Completed

## Live Demo

> Deploy URL sẽ được thêm sau khi deploy lên Netlify.

## Overview

An interactive claims analytics dashboard built from a generated dataset of **5,000 claims**. Global filters drive all KPIs, charts, and the detail table simultaneously. Click a diagnosis bar to drill down into matching claims.

## Dataset

**File:** [`public/data/claims.csv`](./public/data/claims.csv) (5,000 rows)

| Column | Type | Notes |
|--------|------|-------|
| claim_id | string | CLM-NNNNN |
| policy_id | string | POL-NNNNN |
| member_name | string | Realistic Asian names |
| claim_type | enum | OUTPATIENT, INPATIENT, DENTAL, MATERNITY |
| diagnosis_icd10 | string | 20 common ICD-10 codes |
| submitted_amount | number | ฿500–฿2M (skewed) |
| approved_amount | number | 0 for rejected |
| status | enum | APPROVED, REJECTED, PENDING, IN_REVIEW |
| submitted_date | date | Spread across 2024 |
| processed_date | date | 1–30 days after submit (null if PENDING) |
| assessor | string | 5 assessors |
| insurer | string | 3 insurers |
| country | string | Thailand, Vietnam, Hong Kong |

**Regenerate dataset:**

```powershell
npm run generate-data
```

## Features

### KPI Cards
- Total claims count
- Approval rate (%)
- Average processing time (days)
- Total approved amount
- Average claim amount

### Charts (Recharts)
- Claims by status (donut)
- Claims over time (line — week/month toggle)
- Top 10 diagnoses by frequency (horizontal bar, clickable)
- Top 10 diagnoses by total cost (horizontal bar, clickable)
- Processing time distribution (histogram)
- Approval rate by insurer (bar)

### Interactivity
- Global filters: date range, claim type, insurer, country, status
- All filters apply to KPIs, charts, and table
- Click diagnosis bar → drill-down table filter
- Chart tooltips on hover

### Data Table
- Sortable columns
- Pagination (15 rows/page)
- Responds to all filters
- Export filtered data as CSV

## Run Locally

**Yêu cầu:** Node.js 18+

```powershell
cd d:\hgk\papaya-fullstack-engineer-test\ai-engineering-challenges\challenge-09
npm install
npm run generate-data   # if CSV missing
npm run dev
```

Mở http://localhost:5173

## Build

```powershell
npm run build
npm run preview
```

## Deploy (Netlify)

| Setting | Value |
|---------|-------|
| Base directory | `ai-engineering-challenges/challenge-09` |
| Build command | `npm run generate-data && npm run build` |
| Publish directory | `dist` |

```powershell
cd ai-engineering-challenges/challenge-09
netlify login
netlify init
netlify deploy --prod
```

## Commit & Push

```powershell
cd d:\hgk\papaya-fullstack-engineer-test

git add .
git commit -m "Add AI challenge 09: claims analytics dashboard"
git push
```

## Project Structure

```
challenge-09/
├── public/data/claims.csv       # 5,000-claim dataset
├── scripts/generate-claims.ts   # Dataset generator
├── src/
│   ├── components/
│   │   ├── ClaimsDashboard.tsx
│   │   ├── FilterBar.tsx + FilterDropdown.tsx
│   │   ├── KpiCards.tsx
│   │   ├── ClaimsTable.tsx
│   │   └── charts/DashboardCharts.tsx
│   ├── utils/
│   │   ├── parseClaims.ts
│   │   ├── filterClaims.ts
│   │   ├── analytics.ts
│   │   └── exportCsv.ts
│   └── types/claim.ts
```

## Timeline Estimate

| Phase | Time |
|-------|------|
| Dataset generator (5,000 rows) | 50 min |
| KPI + filter logic | 60 min |
| 6 charts + drill-down | 90 min |
| Sortable table + CSV export | 45 min |
| Responsive styling + README | 35 min |
| **Total** | **~4.5 hours** |
