import type { DocumentType, ExtractedFields, FieldValue } from '../types/extraction.js';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function getFieldValue<T>(fields: ExtractedFields, key: string): T | null {
  const field = fields[key] as FieldValue<T> | undefined;
  return field?.value ?? null;
}

function isValidDate(value: unknown): boolean {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

function isPositiveNumber(value: unknown): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function validateDateField(
  fields: ExtractedFields,
  key: string,
  errors: string[],
): void {
  const value = getFieldValue<string>(fields, key);
  if (value === null) {
    return;
  }

  if (!isValidDate(value)) {
    errors.push(`${key} is not a valid ISO date: ${value}`);
  }
}

function validateAmountField(
  fields: ExtractedFields,
  key: string,
  errors: string[],
): void {
  const value = getFieldValue<number>(fields, key);
  if (value === null) {
    return;
  }

  if (!isPositiveNumber(value)) {
    errors.push(`${key} must be a positive number`);
  }
}

function validateReceipt(fields: ExtractedFields, errors: string[]): void {
  validateDateField(fields, 'date', errors);
  validateAmountField(fields, 'grand_total', errors);

  const items = getFieldValue<Array<{ total?: number }>>(fields, 'items');
  const grandTotal = getFieldValue<number>(fields, 'grand_total');

  if (items && Array.isArray(items)) {
    for (const [index, item] of items.entries()) {
      if (item.total !== undefined && !isPositiveNumber(item.total)) {
        errors.push(`items[${index}].total must be a positive number`);
      }
    }

    if (grandTotal !== null) {
      const sum = items.reduce((acc, item) => acc + (item.total ?? 0), 0);
      if (sum > 0) {
        const diff = Math.abs(sum - grandTotal);
        const tolerance = grandTotal * 0.05;
        if (diff > tolerance) {
          errors.push(
            `Item totals (${sum.toFixed(2)}) differ from grand_total (${grandTotal.toFixed(2)}) by more than 5%`,
          );
        }
      }
    }
  }
}

function validateDischargeSummary(fields: ExtractedFields, errors: string[]): void {
  validateDateField(fields, 'admission_date', errors);
  validateDateField(fields, 'discharge_date', errors);

  const admission = getFieldValue<string>(fields, 'admission_date');
  const discharge = getFieldValue<string>(fields, 'discharge_date');

  if (admission && discharge && isValidDate(admission) && isValidDate(discharge)) {
    if (discharge < admission) {
      errors.push('discharge_date must be on or after admission_date');
    }
  }
}

function validateLabReport(fields: ExtractedFields, errors: string[]): void {
  validateDateField(fields, 'date', errors);

  const tests = getFieldValue<Array<{ flag?: string }>>(fields, 'tests');
  if (tests && Array.isArray(tests)) {
    for (const [index, test] of tests.entries()) {
      if (
        test.flag &&
        !['normal', 'high', 'low'].includes(test.flag)
      ) {
        errors.push(`tests[${index}].flag must be normal, high, or low`);
      }
    }
  }
}

function validatePrescription(fields: ExtractedFields, errors: string[]): void {
  validateDateField(fields, 'date', errors);

  const medications = getFieldValue<Array<{ quantity?: number }>>(fields, 'medications');
  if (medications && Array.isArray(medications)) {
    for (const [index, med] of medications.entries()) {
      if (med.quantity !== undefined && !isPositiveNumber(med.quantity)) {
        errors.push(`medications[${index}].quantity must be a positive number`);
      }
    }
  }
}

export function validateExtraction(
  documentType: DocumentType,
  fields: ExtractedFields,
): string[] {
  const errors: string[] = [];

  for (const [key, field] of Object.entries(fields)) {
    const confidence = (field as FieldValue).confidence;
    if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
      errors.push(`${key}.confidence must be between 0.0 and 1.0`);
    }

    const value = (field as FieldValue).value;
    if (value === null && confidence > 0.5) {
      errors.push(`${key} is null but confidence is high (${confidence}) — likely inconsistent`);
    }
  }

  switch (documentType) {
    case 'receipt':
      validateReceipt(fields, errors);
      break;
    case 'discharge_summary':
      validateDischargeSummary(fields, errors);
      break;
    case 'lab_report':
      validateLabReport(fields, errors);
      break;
    case 'prescription':
      validatePrescription(fields, errors);
      break;
    default:
      break;
  }

  return errors;
}

export function normalizeFieldConfidences(fields: ExtractedFields): ExtractedFields {
  const normalized: ExtractedFields = {};

  for (const [key, field] of Object.entries(fields)) {
    const value = (field as FieldValue).value;
    let confidence = (field as FieldValue).confidence ?? 0;

    if (value === null || value === undefined || value === '') {
      confidence = Math.min(confidence, 0.3);
    }

    normalized[key] = {
      value: value ?? null,
      confidence: Math.max(0, Math.min(1, confidence)),
    };
  }

  return normalized;
}
