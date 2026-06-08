import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { documentDefinitions } from '../src/data/documentDefinitions.js';
import { extractDocument } from '../src/pipeline/extractDocument.js';

const samplesDir = resolve(process.cwd(), 'documents/samples');

describe('extractDocument (mock mode)', () => {
  process.env.LLM_PROVIDER = 'mock';

  for (const doc of documentDefinitions) {
    it(`classifies and extracts ${doc.id} correctly`, async () => {
      const pngPath = resolve(samplesDir, `${doc.filename}.png`);
      expect(existsSync(pngPath)).toBe(true);

      const result = await extractDocument(pngPath, { documentId: doc.id });

      expect(result.document_type).toBe(doc.document_type);
      expect(result.confidence).toBeGreaterThan(0.5);
      expect(result.validation_errors).toEqual([]);
      expect(result.processing_mode).toBe('mock');

      for (const [key, expectedValue] of Object.entries(doc.fields)) {
        const extracted = result.fields[key];
        expect(extracted).toBeDefined();
        expect(extracted.value).toEqual(expectedValue);
        expect(extracted.confidence).toBeGreaterThan(0.5);
      }
    });
  }
});
