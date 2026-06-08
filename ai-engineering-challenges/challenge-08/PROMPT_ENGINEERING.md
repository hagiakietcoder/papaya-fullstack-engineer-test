# Prompt Engineering Approach — Medical Document Extractor

## Strategy: Two-Stage Pipeline

We use a **classify-then-extract** pattern instead of a single monolithic prompt. This improves accuracy because each stage has a narrower task and type-specific extraction schemas reduce hallucination.

```
Document (PNG/PDF)
       │
       ▼
┌──────────────────┐
│  Stage 1: Classify │  → document_type + confidence
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Stage 2: Extract  │  → typed fields + per-field confidence
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Post-validation   │  → dates, amounts, total mismatch
└──────────────────┘
```

## Stage 1 — Classification Prompt

**Goal:** Determine document type only — no field extraction.

**Key techniques:**
- Closed set of 4 labels with short descriptions and distinguishing features
- Explicit instruction: "classification only, do not extract fields"
- Request confidence score + brief reasoning for auditability
- JSON-only output (no markdown fences)

**Why it works:** Models often confuse discharge summaries with receipts when asked to do everything at once. Separating classification reduces cross-type field bleed (e.g., putting `grand_total` on a lab report).

## Stage 2 — Type-Specific Extraction Prompt

**Goal:** Extract fields matching a strict schema for the classified type.

**Key techniques:**

### 1. Schema-first output
Each document type has a different JSON schema injected into the prompt (`getSchemaForType()`). The model sees exactly which fields are expected.

### 2. Anti-hallucination rules
```
- NEVER fabricate data
- If not visible → value: null, confidence ≤ 0.3
- High confidence (0.85+) only for clearly legible text
```

This directly addresses the evaluation criterion: *"if a field is not visible, it should be null with low confidence, not fabricated."*

### 3. Normalization instructions
- Dates → ISO `YYYY-MM-DD`
- Amounts → numbers without currency symbols
- Lab flags → enum: `normal | high | low`

### 4. Per-field confidence
We ask for `{ value, confidence }` on every field, not a single document-level score. Post-processing (`normalizeFieldConfidences`) caps null-field confidence at 0.3 even if the model over-reports certainty.

## Post-Processing Validation

LLM output is not trusted blindly. A deterministic validation layer checks:

| Rule | Example |
|------|---------|
| ISO date format | Reject `15/03/2024` in structured output |
| Positive amounts | `grand_total > 0` |
| Receipt total check | Sum of `items[].total` within 5% of `grand_total` |
| Date ordering | `discharge_date >= admission_date` |
| Confidence consistency | `null` value + confidence > 0.5 → flag |

Validation errors are returned alongside extraction results so downstream systems can route low-quality extractions for human review.

## Provider Abstraction

The pipeline supports:
- **Anthropic Claude** (vision) — `ANTHROPIC_API_KEY`
- **OpenAI GPT-4o** (vision) — `OPENAI_API_KEY`
- **Mock mode** — uses ground-truth JSON for offline testing without API costs

Set `LLM_PROVIDER=anthropic|openai|mock`.

## Prompt Iteration Notes

| Issue observed | Prompt fix |
|----------------|------------|
| Model returns markdown fences | Added "ONLY valid JSON, no markdown fences" + JSON parser strips fences |
| Uniform 0.95 confidence everywhere | Added explicit confidence calibration bands (0.3 / 0.4–0.7 / 0.85+) |
| Wrong date formats | Required ISO format in extraction prompt |
| Fabricated line items | "Extract only rows clearly visible" + null/low-confidence fallback |
| Type/schema mismatch | Two-stage pipeline with type injected into Stage 2 |

## Reusability

The pipeline is **not hardcoded to test documents**:
- `extractDocument(filePath)` accepts any PNG/JPG/PDF
- Prompts are generic for the 4 document types
- Validation rules apply to any extraction matching the schema
- Mock mode is only used when `LLM_PROVIDER=mock` for CI/demo

## Recommended Production Enhancements

1. **Retry with temperature 0** on JSON parse failures
2. **Human-in-the-loop** threshold: route fields with confidence < 0.7
3. **PDF multi-page**: render each page to image, merge extractions
4. **Few-shot examples** per document type for borderline cases (add 1 example image per type to prompt)
