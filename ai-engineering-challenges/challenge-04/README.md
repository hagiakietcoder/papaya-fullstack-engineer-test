# Challenge 04 — Insurance Glossary Search App

**Difficulty:** Beginner · **Estimated time:** 2–3 hours  
**Status:** ✅ Completed

## Live Demo

> Deploy URL sẽ được thêm sau khi deploy lên Netlify.

## Overview

Searchable insurance glossary with **46 terms** across 6 categories. All data is bundled client-side for fast, offline-friendly access after the first load.

## Features

- Terms grouped by category with expandable sections
- Live full-text search (name + definition) with highlighted matches
- Click a term to view full definition and related terms
- Related terms are clickable and navigate to that term
- A–Z alphabet quick-jump sidebar
- Clean, scannable typography
- Offline-ready (static bundled data, no API)

## Run Locally

**Yêu cầu:** Node.js 18+

```powershell
cd d:\hgk\papaya-fullstack-engineer-test\ai-engineering-challenges\challenge-04
npm install
npm run dev
```

Mở http://localhost:5173

## Build

```powershell
npm run build
npm run preview
```

## Deploy (Netlify)

Tạo **site Netlify riêng** (repo gốc đang trỏ challenge-01):

| Setting | Value |
|---------|-------|
| Base directory | `ai-engineering-challenges/challenge-04` |
| Build command | `npm run build` |
| Publish directory | `dist` |

**Qua Netlify Dashboard:**
1. [app.netlify.com](https://app.netlify.com) → **Add new site** → Import GitHub repo
2. Set Base directory = `ai-engineering-challenges/challenge-04`
3. **Deploy site** → copy live URL vào README

**Qua CLI:**

```powershell
cd d:\hgk\papaya-fullstack-engineer-test\ai-engineering-challenges\challenge-04
netlify login
netlify init
netlify deploy --prod
```

## Commit & Push

```powershell
cd d:\hgk\papaya-fullstack-engineer-test

git add .
git commit -m "Add AI challenge 04: insurance glossary search app"
git push
```

## Project Structure

```
src/
├── components/
│   ├── GlossaryApp.tsx       # Main layout & state
│   ├── SearchBar.tsx         # Live search input
│   ├── AlphabetNav.tsx       # A–Z quick jump
│   ├── CategorySection.tsx   # Expandable category groups
│   └── TermDetail.tsx        # Definition + related terms
├── data/glossary.ts          # 46 bundled terms
├── utils/search.ts           # Filter & grouping helpers
└── utils/highlight.tsx       # Search match highlighting
```

## Glossary Categories

| Category | Terms |
|----------|-------|
| General Insurance | 8 |
| Claims | 8 |
| Coverage | 8 |
| Life & Health | 8 |
| Reinsurance | 7 |
| Regulatory | 7 |
| **Total** | **46** |

## Timeline Estimate

| Phase | Time |
|-------|------|
| Glossary data (46 terms) | 50 min |
| Search + highlight + grouping | 45 min |
| UI: categories, A–Z, detail panel | 50 min |
| README + build/deploy | 15 min |
| **Total** | **~2.5 hours** |
