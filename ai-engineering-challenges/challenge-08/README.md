# Challenge 08 — Medical Document Extractor

**Difficulty:** Advanced · **Estimated time:** 4–6 hours  
**Status:** ✅ Completed

## Overview

A reusable document extraction pipeline that takes medical documents (PDF or image) and returns structured JSON with extracted fields, per-field confidence scores, and validation errors.

Uses a **two-stage LLM vision pipeline**: classify document type → extract type-specific fields → post-validate.

## Sample Documents (10)

| ID | Type | File |
|----|------|------|
| receipt-01 | Receipt | Bangkok Hospital outpatient |
| receipt-02 | Receipt | Samitivej pharmacy |
| receipt-03 | Receipt | Phyathai emergency |
| discharge-01 | Discharge summary | Bangkok pneumonia |
| discharge-02 | Discharge summary | Samitivej appendectomy |
| discharge-03 | Discharge summary | Phyathai maternity |
| lab-01 | Lab report | Bangkok CBC panel |
| lab-02 | Lab report | Samitivej lipid panel |
| prescription-01 | Prescription | Dr. Somchai antibiotics |
| prescription-02 | Prescription | Dr. Naree chronic meds |

**Formats:** `documents/html/` (source), `documents/samples/` (PNG + PDF), `documents/ground-truth/` (expected fields)

## Quick Start

**Yêu cầu:** Node.js 18+

```powershell
cd d:\hgk\papaya-fullstack-engineer-test\ai-engineering-challenges\challenge-08
npm install
npm run setup-docs    # Generate HTML + render PNG/PDF (first time)
npm test              # 16 tests
npm run extract:all   # Extract all 10 docs (mock mode by default)
```

### Mock mode (no API key)

Default `LLM_PROVIDER=mock` uses ground-truth data — useful for CI and offline demo.

### Real LLM extraction

Copy `.env.example` → `.env` and set your API key:

```env
# Anthropic Claude vision
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...

# OR OpenAI GPT-4o vision
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

```powershell
npm run extract:all
```

Results → `output/extraction-results.json`

## Output Format

```json
{
  "document_type": "receipt",
  "confidence": 0.96,
  "fields": {
    "hospital_name": { "value": "Bangkok Hospital", "confidence": 0.94 },
    "grand_total": { "value": 4550, "confidence": 0.94 }
  },
  "validation_errors": []
}
```

Committed results: [`documents/extraction-results.json`](./documents/extraction-results.json)

## Pipeline Architecture

```
PNG/PDF → classify (vision LLM) → extract (typed schema) → validate → JSON
```

| Module | Purpose |
|--------|---------|
| `src/llm/visionClient.ts` | Anthropic / OpenAI vision API |
| `src/prompts/` | Classification + extraction prompts |
| `src/pipeline/extractDocument.ts` | Main reusable entry point |
| `src/validation/validateExtraction.ts` | Date, amount, total mismatch checks |
| `src/pipeline/mockExtractor.ts` | Offline mode without API key |

## Usage (as a module)

```typescript
import { extractDocument } from './src/pipeline/extractDocument.js';

const result = await extractDocument('path/to/receipt.png');
console.log(result.document_type, result.fields, result.validation_errors);
```

## Validation Rules

- Dates must be valid ISO `YYYY-MM-DD`
- Amounts must be positive numbers
- Receipt item totals must sum to `grand_total` within 5%
- `discharge_date` must be ≥ `admission_date`
- Null fields cannot have high confidence (> 0.5)

## Prompt Engineering

See [`PROMPT_ENGINEERING.md`](./PROMPT_ENGINEERING.md) for the two-stage approach, anti-hallucination rules, and iteration notes.

## Project Structure

```
challenge-08/
├── documents/
│   ├── html/                  # 10 source HTML documents
│   ├── samples/               # Rendered PNG + PDF
│   ├── ground-truth/          # Expected field values
│   └── extraction-results.json
├── src/
│   ├── pipeline/
│   ├── llm/
│   ├── prompts/
│   ├── validation/
│   └── data/documentDefinitions.ts
├── scripts/
│   ├── generate-documents.ts
│   ├── render-documents.ts
│   └── run-extraction.ts
├── tests/                     # 16 unit tests
└── PROMPT_ENGINEERING.md
```

## Commit & Push

```powershell
cd d:\hgk\papaya-fullstack-engineer-test

git add .
git commit -m "Add AI challenge 08: medical document extractor"
git push
```

## Timeline Estimate

| Phase | Time |
|-------|------|
| Document design + HTML generation (10 docs) | 75 min |
| Vision LLM client + two-stage prompts | 90 min |
| Validation layer + pipeline | 60 min |
| Tests + mock mode + extraction run | 45 min |
| Prompt engineering writeup + README | 30 min |
| **Total** | **~5 hours** |
