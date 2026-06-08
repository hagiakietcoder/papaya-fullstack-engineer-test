import { describe, expect, it } from 'vitest';
import { validateExtraction, normalizeFieldConfidences } from '../src/validation/validateExtraction.js';
import type { ExtractedFields } from '../src/types/extraction.js';

describe('validateExtraction', () => {
  it('accepts valid receipt with matching item totals', () => {
    const fields: ExtractedFields = {
      hospital_name: { value: 'Bangkok Hospital', confidence: 0.98 },
      patient_name: { value: 'Somchai Prasert', confidence: 0.95 },
      date: { value: '2024-03-15', confidence: 0.97 },
      items: {
        value: [
          { description: 'Consultation', quantity: 1, unit_price: 1500, total: 1500 },
          { description: 'X-ray', quantity: 1, unit_price: 2200, total: 2200 },
        ],
        confidence: 0.9,
      },
      grand_total: { value: 3700, confidence: 0.96 },
      payment_method: { value: 'Credit Card', confidence: 0.88 },
    };

    expect(validateExtraction('receipt', fields)).toEqual([]);
  });

  it('flags receipt when item totals differ from grand_total by more than 5%', () => {
    const fields: ExtractedFields = {
      date: { value: '2024-03-15', confidence: 0.9 },
      items: {
        value: [
          { description: 'A', quantity: 1, unit_price: 1000, total: 1000 },
          { description: 'B', quantity: 1, unit_price: 1000, total: 1000 },
        ],
        confidence: 0.9,
      },
      grand_total: { value: 5000, confidence: 0.9 },
    };

    const errors = validateExtraction('receipt', fields);
    expect(errors.some((error) => error.includes('differ from grand_total'))).toBe(true);
  });

  it('rejects invalid dates', () => {
    const fields: ExtractedFields = {
      date: { value: '15-03-2024', confidence: 0.8 },
      grand_total: { value: 100, confidence: 0.9 },
    };

    const errors = validateExtraction('receipt', fields);
    expect(errors.some((error) => error.includes('not a valid ISO date'))).toBe(true);
  });

  it('rejects discharge date before admission date', () => {
    const fields: ExtractedFields = {
      admission_date: { value: '2024-04-10', confidence: 0.9 },
      discharge_date: { value: '2024-04-05', confidence: 0.9 },
    };

    const errors = validateExtraction('discharge_summary', fields);
    expect(errors.some((error) => error.includes('discharge_date must be on or after'))).toBe(true);
  });

  it('flags null fields with high confidence', () => {
    const fields: ExtractedFields = {
      patient_name: { value: null, confidence: 0.95 },
    };

    const errors = validateExtraction('receipt', fields);
    expect(errors.some((error) => error.includes('null but confidence is high'))).toBe(true);
  });
});

describe('normalizeFieldConfidences', () => {
  it('caps confidence for null values at 0.3', () => {
    const normalized = normalizeFieldConfidences({
      doctor_name: { value: null, confidence: 0.9 },
    });

    expect(normalized.doctor_name.confidence).toBeLessThanOrEqual(0.3);
  });
});
