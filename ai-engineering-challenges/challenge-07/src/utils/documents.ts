import type { ClaimType, DocumentId, DocumentRequirement } from '../types/claim';

export const DOCUMENT_REQUIREMENTS: Record<ClaimType, DocumentRequirement[]> = {
  OUTPATIENT: [
    { id: 'medical_receipt', label: 'Medical Receipt', required: true },
    { id: 'prescription', label: 'Prescription', required: false },
  ],
  INPATIENT: [
    { id: 'discharge_summary', label: 'Discharge Summary', required: true },
    { id: 'itemized_bill', label: 'Itemized Bill', required: true },
    { id: 'medical_receipt', label: 'Medical Receipt', required: true },
  ],
  DENTAL: [
    { id: 'dental_receipt', label: 'Dental Receipt', required: true },
    { id: 'treatment_plan', label: 'Treatment Plan', required: false, requiredWhenMajor: true },
  ],
};

export function getDocumentRequirements(
  claimType: ClaimType,
  isMajorDental: boolean,
): DocumentRequirement[] {
  return DOCUMENT_REQUIREMENTS[claimType].map((doc) => ({
    ...doc,
    required: doc.requiredWhenMajor ? isMajorDental : doc.required,
  }));
}

export function isDocumentRequired(
  doc: DocumentRequirement,
  isMajorDental: boolean,
): boolean {
  if (doc.requiredWhenMajor) {
    return isMajorDental;
  }

  return doc.required;
}

export const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
export const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export function validateFile(file: File): string | null {
  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  const typeAllowed =
    ALLOWED_FILE_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(extension);

  if (!typeAllowed) {
    return 'Only PDF, JPG, and PNG files are allowed.';
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'File must be 10 MB or smaller.';
  }

  return null;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getClaimTypeLabel(claimType: ClaimType): string {
  const labels: Record<ClaimType, string> = {
    OUTPATIENT: 'Outpatient',
    INPATIENT: 'Inpatient',
    DENTAL: 'Dental',
  };

  return labels[claimType];
}

export function getDocumentLabel(id: DocumentId): string {
  for (const requirements of Object.values(DOCUMENT_REQUIREMENTS)) {
    const match = requirements.find((item) => item.id === id);
    if (match) {
      return match.label;
    }
  }

  return id;
}
