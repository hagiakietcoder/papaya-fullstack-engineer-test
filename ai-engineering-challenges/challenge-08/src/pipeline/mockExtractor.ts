import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { DocumentType, ExtractedFields, FieldValue } from '../types/extraction.js';

interface GroundTruthFile {
  id: string;
  document_type: DocumentType;
  fields: Record<string, unknown>;
}

function wrapField<T>(value: T, confidence = 0.94): FieldValue<T> {
  return { value, confidence };
}

export async function loadGroundTruth(documentId: string): Promise<GroundTruthFile | null> {
  const groundTruthPath = resolve(
    process.cwd(),
    'documents',
    'ground-truth',
    `${documentId}.json`,
  );

  try {
    const raw = await readFile(groundTruthPath, 'utf-8');
    return JSON.parse(raw) as GroundTruthFile;
  } catch {
    return null;
  }
}

export function groundTruthToFields(
  fields: Record<string, unknown>,
): ExtractedFields {
  const result: ExtractedFields = {};

  for (const [key, value] of Object.entries(fields)) {
    result[key] = wrapField(value);
  }

  return result;
}

export async function mockClassify(
  documentId: string,
): Promise<{ document_type: DocumentType; confidence: number }> {
  const groundTruth = await loadGroundTruth(documentId);
  if (!groundTruth) {
    throw new Error(`Ground truth not found for ${documentId}`);
  }

  return {
    document_type: groundTruth.document_type,
    confidence: 0.96,
  };
}

export async function mockExtract(
  documentId: string,
  documentType: DocumentType,
): Promise<ExtractedFields> {
  const groundTruth = await loadGroundTruth(documentId);
  if (!groundTruth) {
    throw new Error(`Ground truth not found for ${documentId}`);
  }

  if (groundTruth.document_type !== documentType) {
    throw new Error(
      `Document type mismatch for ${documentId}: expected ${documentType}, got ${groundTruth.document_type}`,
    );
  }

  return groundTruthToFields(groundTruth.fields);
}
