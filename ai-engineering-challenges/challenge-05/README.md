# Challenge 05 — Policy Summary Generator

**Difficulty:** Beginner · **Estimated time:** 2–4 hours  
**Status:** ✅ Completed

## Live Demo

> Deploy URL sẽ được thêm sau khi deploy lên Netlify.

## Overview

A tool that takes policy JSON and generates a well-formatted, human-readable HTML summary. Works with any policy matching the schema — not hardcoded to one example.

**Sample policies included:**
1. **Corporate Health Plus** — corporate Gold plan (4 benefit types incl. maternity)
2. **Family Care Silver** — individual/family plan (3 benefit types, different copay)

## Features

- Quick reference card (annual limit, copay, members, hospitals)
- Policy overview (number, holder, plan, dates)
- Member count breakdown
- Benefits tables by type with sub-benefit limits
- Copay schedule
- Waiting periods (warning styling)
- Exclusions list (alert styling)
- Network information
- Currency formatting with thousand separators (฿)
- Print-friendly layout
- Policy selector to demo flexibility

## Run Locally

**Yêu cầu:** Node.js 18+

```powershell
cd d:\hgk\papaya-fullstack-engineer-test\ai-engineering-challenges\challenge-05
npm install
npm run dev
```

Mở http://localhost:5173 → chọn policy từ dropdown.

## Build

```powershell
npm run build
npm run preview
```

## Deploy (Netlify)

Tạo site Netlify riêng:

| Setting | Value |
|---------|-------|
| Base directory | `ai-engineering-challenges/challenge-05` |
| Build command | `npm run build` |
| Publish directory | `dist` |

```powershell
cd ai-engineering-challenges/challenge-05
netlify login
netlify init
netlify deploy --prod
```

## Commit & Push

```powershell
cd d:\hgk\papaya-fullstack-engineer-test

git add .
git commit -m "Add AI challenge 05: policy summary generator"
git push
```

## Project Structure

```
src/
├── components/
│   ├── PolicySummaryApp.tsx   # Policy selector + layout
│   └── PolicySummary.tsx      # Dynamic summary renderer
├── data/policies/
│   ├── corporate-health-plus.json
│   ├── family-care-silver.json
│   └── index.ts
├── types/policy.ts            # JSON schema types
└── utils/formatters.ts        # Currency, date, quick-ref stats
```

## Timeline Estimate

| Phase | Time |
|-------|------|
| Schema types + 2 policy JSONs | 40 min |
| Summary sections + formatters | 70 min |
| Quick reference + warning styling | 40 min |
| README + build/deploy | 20 min |
| **Total** | **~2.5 hours** |
