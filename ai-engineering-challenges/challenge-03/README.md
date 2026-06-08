# Challenge 03 — Claim Notification Email Templates

**Difficulty:** Beginner · **Estimated time:** 2–3 hours  
**Status:** ✅ Completed

## Live Demo

> Deploy URL sẽ được thêm sau khi deploy preview page lên Netlify.

## Overview

Six branded HTML email templates for insurance claim lifecycle events, plus a preview web app to render each template with sample data and variable interpolation.

## Email Templates

| Event | Subject | Key variables |
|-------|---------|---------------|
| Claim Submitted | Your claim {{claim_number}} has been received | claim_number, member_name, claim_type, submitted_date |
| Documents Received | Documents received for claim {{claim_number}} | claim_number, member_name, document_count, documents_list |
| Under Review | Your claim {{claim_number}} is being reviewed | claim_number, member_name, assessor_name, estimated_days |
| Approved | Good news! Claim {{claim_number}} has been approved | claim_number, member_name, approved_amount, original_amount, payment_method |
| Rejected | Update on claim {{claim_number}} | claim_number, member_name, rejection_reason, appeal_deadline |
| Payment Sent | Payment for claim {{claim_number}} has been processed | claim_number, member_name, payment_amount, payment_date, reference_number |

## Brand Guidelines

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#2563EB` | Header, links, default accents |
| Secondary | `#10B981` | Approved / payment positive outcomes |
| Warning | `#EF4444` | Rejection / urgent messaging |
| Font | System sans-serif stack | Email-safe typography |
| Logo | Text placeholder "Papaya Insurance" | Email header |
| Layout | Single column, max 600px | Email client compatibility |

## Run Locally

```powershell
cd d:\hgk\papaya-fullstack-engineer-test\ai-engineering-challenges\challenge-03
npm install
npm run dev
```

Open http://localhost:5173

## Build

```powershell
npm run build
npm run preview
```

## Deploy Preview (Netlify)

Tạo site mới trên Netlify (hoặc đổi base directory nếu dùng chung repo):

| Setting | Value |
|---------|-------|
| Base directory | `ai-engineering-challenges/challenge-03` |
| Build command | `npm run build` |
| Publish directory | `dist` |

```powershell
cd ai-engineering-challenges/challenge-03
netlify login
netlify init
netlify deploy --prod
```

## Project Structure

```
src/
├── components/TemplatePreview.tsx   # Preview UI
├── data/sampleData.ts               # Sample data per event
├── templates/
│   ├── layout.ts                    # Shared email layout & helpers
│   ├── claimSubmitted.ts
│   ├── documentsReceived.ts
│   ├── underReview.ts
│   ├── approved.ts
│   ├── rejected.ts
│   ├── paymentSent.ts
│   └── index.ts
├── utils/renderTemplate.ts          # {{variable}} interpolation
└── types/template.ts
```

## Features

- 6 HTML email templates with `{{variable}}` placeholders (no hardcoded member data)
- Shared layout: logo header, body, support footer
- Rejection email: explanation block + numbered next steps
- Approval email: highlighted approved amount card
- Preview page: event selector, subject preview, variable list, live iframe render
- Responsive email layout (table-based, inline CSS, 600px max-width)

## Timeline Estimate

| Phase | Time |
|-------|------|
| Layout system + brand tokens | 40 min |
| 6 email templates + copy | 70 min |
| Preview page + interpolation | 40 min |
| README + build/deploy | 20 min |
| **Total** | **~2.5 hours** |
