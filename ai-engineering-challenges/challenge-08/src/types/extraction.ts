export type DocumentType =
  | 'receipt'
  | 'discharge_summary'
  | 'lab_report'
  | 'prescription';

export interface FieldValue<T = unknown> {
  value: T | null;
  confidence: number;
}

export interface ReceiptItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface LabTest {
  test_name: string;
  result: string;
  unit: string;
  reference_range: string;
  flag: 'normal' | 'high' | 'low';
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
}

export type ExtractedFields = Record<string, FieldValue>;

export interface ExtractionResult {
  document_id: string;
  source_file: string;
  document_type: DocumentType;
  confidence: number;
  fields: ExtractedFields;
  validation_errors: string[];
  raw_model_response?: string;
  processing_mode: 'llm' | 'mock';
}

export interface GroundTruthDocument {
  id: string;
  filename: string;
  document_type: DocumentType;
  fields: Record<string, unknown>;
}
