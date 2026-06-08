import type { DocumentType } from '../types/extraction.js';
import { getSchemaForType } from '../data/documentDefinitions.js';

export function buildExtractionPrompt(documentType: DocumentType): string {
  return `You are a medical document data extractor for insurance claims.

The document has been classified as: ${documentType}

Extract structured fields from the attached image. For EACH field return:
- "value": the extracted value (use null if not visible or illegible)
- "confidence": 0.0–1.0 reflecting how certain you are

CRITICAL RULES:
1. Return ONLY valid JSON matching the schema below — no markdown fences.
2. NEVER fabricate data. If a field is missing, blurred, or not present, set value to null and confidence ≤ 0.3.
3. Use ISO date format YYYY-MM-DD for all dates.
4. Amounts must be numbers without currency symbols.
5. For list fields (items, tests, medications), extract only rows clearly visible in the document.
6. Lower confidence (0.4–0.7) for partially obscured or ambiguous text.
7. High confidence (0.85–0.99) only when text is clearly legible.

Schema:
${getSchemaForType(documentType)}

Wrap all fields under a top-level "fields" object:
{
  "fields": { ... }
}`;
}
