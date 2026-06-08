import { basename } from 'node:path';
import {
  classifyDocument,
  extractFields,
  resolveProvider,
  type LlmProvider,
} from '../llm/visionClient.js';
import type { DocumentType, ExtractionResult, ExtractedFields } from '../types/extraction.js';
import {
  normalizeFieldConfidences,
  validateExtraction,
} from '../validation/validateExtraction.js';
import { mockClassify, mockExtract } from './mockExtractor.js';

export interface ExtractDocumentOptions {
  documentId?: string;
  forceType?: DocumentType;
}

function inferDocumentId(filePath: string): string {
  const name = basename(filePath).replace(/\.(png|jpg|jpeg|pdf)$/i, '');
  const match = name.match(/^(receipt|discharge|lab|prescription)-\d+/);
  return match ? match[0] : name;
}

export async function extractDocument(
  filePath: string,
  options: ExtractDocumentOptions = {},
): Promise<ExtractionResult> {
  const provider: LlmProvider = resolveProvider();
  const documentId = options.documentId ?? inferDocumentId(filePath);
  const sourceFile = basename(filePath);

  let documentType: DocumentType;
  let classificationConfidence: number;
  let fields: ExtractedFields;
  let rawResponses: string[] = [];
  let processingMode: 'llm' | 'mock' = provider === 'mock' ? 'mock' : 'llm';

  if (provider === 'mock') {
    const classification = await mockClassify(documentId);
    documentType = options.forceType ?? classification.document_type;
    classificationConfidence = classification.confidence;
    fields = await mockExtract(documentId, documentType);
  } else {
    if (options.forceType) {
      documentType = options.forceType;
      classificationConfidence = 1;
    } else {
      const classification = await classifyDocument(filePath);
      documentType = classification.result.document_type;
      classificationConfidence = classification.result.confidence;
      rawResponses.push(classification.raw);
    }

    const extraction = await extractFields(filePath, documentType);
    fields = extraction.result.fields;
    rawResponses.push(extraction.raw);
  }

  fields = normalizeFieldConfidences(fields);
  const validation_errors = validateExtraction(documentType, fields);

  return {
    document_id: documentId,
    source_file: sourceFile,
    document_type: documentType,
    confidence: classificationConfidence,
    fields,
    validation_errors,
    raw_model_response: rawResponses.join('\n---\n'),
    processing_mode: processingMode,
  };
}
