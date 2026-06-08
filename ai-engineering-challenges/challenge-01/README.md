# Challenge 01 — Insurance Plan Comparison Page

**Difficulty:** Beginner · **Estimated time:** 2–3 hours  
**Status:** ✅ Completed

## Live Demo

> Deploy URL sẽ được thêm sau khi deploy lên Netlify.

## Deploy (Netlify)

Repo đã có `netlify.toml` ở thư mục gốc — Netlify tự đọc cấu hình build.

1. Push code lên GitHub
2. Đăng nhập [netlify.com](https://netlify.com) bằng GitHub
3. **Add new site** → **Import an existing project** → chọn repo
4. Netlify tự nhận:
   - **Base directory:** `ai-engineering-challenges/challenge-01`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Bấm **Deploy site**
6. Copy URL (vd. `https://xxx.netlify.app`) vào README

**Deploy bằng CLI (tuỳ chọn):**

```bash
npm install -g netlify-cli
netlify login
cd ai-engineering-challenges/challenge-01
netlify init
netlify deploy --prod
```

## Overview

A responsive web page that compares three insurance plans (Bronze, Silver, Gold) side by side, highlighting included benefits, best values per row, and a recommended plan based on value-for-money score.

## Features

- Side-by-side comparison table (desktop) with all pricing, limits, and benefits
- Visual ✓ / ✕ indicators for included vs excluded benefits
- **Best** tag on the highest-value cell in each row
- **Recommended** badge computed from value-for-money algorithm
- Mobile layout stacks plan cards vertically
- Clean, professional UI suitable for non-technical users

## Recommended Plan Algorithm

```
valueScore = (annual_limit / annual_premium)
           × affordabilityFactor
           + benefitBonus
           − copayPenalty
           − waitingPenalty

affordabilityFactor = 1 − |monthly_premium − 350| / 700
```

Silver is typically selected as the best balance of coverage and affordability.

## Tech Stack

- React 19 + TypeScript
- Vite
- Plain CSS (no UI framework)

## Run Locally

```bash
cd ai-engineering-challenges/challenge-01
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ComparisonTable.tsx   # Table + mobile cards
│   └── PlanComparison.tsx    # Page layout
├── data/plans.ts             # Plan dataset
├── types/plan.ts             # TypeScript interfaces
└── utils/
    ├── comparison.ts         # Rows config + best-value logic
    ├── formatters.ts         # Currency / unlimited formatting
    └── valueScore.ts         # Recommended plan calculation
```

## Timeline Estimate

| Phase | Time |
|-------|------|
| Setup + data modeling | 30 min |
| Comparison table + best-value logic | 60 min |
| Responsive layout + styling | 45 min |
| README + deploy | 15 min |
| **Total** | **~2.5 hours** |
