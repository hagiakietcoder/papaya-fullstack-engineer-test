# Challenge 07 — Claims Intake Wizard

**Difficulty:** Intermediate · **Estimated time:** 3–5 hours  
**Status:** ✅ Completed

## Live Demo

> Deploy URL sẽ được thêm sau khi deploy lên Netlify.

## Overview

A multi-step claim submission wizard for insurance members. The form adapts based on claim type (Outpatient, Inpatient, Dental) with conditional fields, document requirements, validation, and a final review step.

## Features

### Step 1 — Claim Type Selection
- Outpatient, Inpatient, Dental cards with document preview
- Selection drives all subsequent conditional logic

### Step 2 — Member & Policy Information
- Pre-filled from mock data (editable)
- Custom dependent dropdown (no native `<select>`)
- Dependent selector when claim is for a family member

### Step 3 — Diagnosis & Treatment
- Free-text diagnosis
- ICD-10 autocomplete (120+ common codes, keyboard navigable)
- Provider/hospital autocomplete from mock list
- Single treatment date (outpatient/dental) or date range (inpatient)
- Auto-calculated length of stay for inpatient
- Major dental toggle (makes treatment plan required)

### Step 4 — Document Upload
- Required vs optional documents per claim type
- File validation: PDF, JPG, PNG only · max 10 MB
- Simulated upload progress bar
- Blocks Continue until required documents are uploaded

### Step 5 — Review & Submit
- Summary of all entered data with Edit links per section
- Confirmation checkbox
- Mock submission (console log + success screen)

### General
- Form state persists across back/forward navigation
- Progress indicator with clickable completed steps
- Responsive layout (desktop + mobile)
- Keyboard accessible (tab, Enter, arrow keys in autocompletes)

## Run Locally

**Yêu cầu:** Node.js 18+

```powershell
cd d:\hgk\papaya-fullstack-engineer-test\ai-engineering-challenges\challenge-07
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

Tạo site Netlify riêng:

| Setting | Value |
|---------|-------|
| Base directory | `ai-engineering-challenges/challenge-07` |
| Build command | `npm run build` |
| Publish directory | `dist` |

```powershell
cd ai-engineering-challenges/challenge-07
netlify login
netlify init
netlify deploy --prod
```

## Commit & Push

```powershell
cd d:\hgk\papaya-fullstack-engineer-test

git add .
git commit -m "Add AI challenge 07: claims intake wizard"
git push
```

## Project Structure

```
src/
├── components/
│   ├── ClaimWizard.tsx          # Main wizard orchestrator
│   ├── ProgressIndicator.tsx
│   ├── WizardNavigation.tsx
│   ├── DependentDropdown.tsx    # Custom dropdown
│   ├── Icd10Autocomplete.tsx
│   ├── ProviderAutocomplete.tsx
│   ├── DocumentUpload.tsx
│   └── steps/
│       ├── Step1ClaimType.tsx
│       ├── Step2MemberInfo.tsx
│       ├── Step3Diagnosis.tsx
│       ├── Step4Documents.tsx
│       └── Step5Review.tsx
├── data/
│   ├── mockMember.ts
│   ├── providers.ts
│   └── icd10Codes.ts            # 120+ ICD-10 codes
├── hooks/useClaimWizard.ts      # Central form state
├── types/claim.ts
└── utils/
    ├── documents.ts
    └── validation.ts
```

## Document Requirements by Claim Type

| Claim Type | Required | Optional |
|------------|----------|----------|
| Outpatient | Medical receipt | Prescription |
| Inpatient | Discharge summary, itemized bill, medical receipt | — |
| Dental | Dental receipt | Treatment plan (required for major dental) |

## Timeline Estimate

| Phase | Time |
|-------|------|
| Project scaffold + types + mock data | 45 min |
| Steps 1–3 with conditional logic | 90 min |
| Document upload + validation | 60 min |
| Review step + wizard state/navigation | 45 min |
| Styling, accessibility, responsive | 45 min |
| README + build/deploy | 25 min |
| **Total** | **~5 hours** |
