export type ClaimType = 'OUTPATIENT' | 'INPATIENT' | 'DENTAL';

export type DocumentId =
  | 'medical_receipt'
  | 'prescription'
  | 'discharge_summary'
  | 'itemized_bill'
  | 'dental_receipt'
  | 'treatment_plan';

export interface Icd10Code {
  code: string;
  description: string;
}

export interface Dependent {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
}

export interface MemberProfile {
  memberName: string;
  policyNumber: string;
  memberId: string;
  dateOfBirth: string;
  dependents: Dependent[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

export interface DocumentRequirement {
  id: DocumentId;
  label: string;
  required: boolean;
  requiredWhenMajor?: boolean;
}

export interface ClaimFormState {
  claimType: ClaimType | null;
  memberName: string;
  policyNumber: string;
  memberId: string;
  dateOfBirth: string;
  isForDependent: boolean;
  dependentId: string | null;
  diagnosis: string;
  icd10Code: string;
  icd10Description: string;
  treatmentDate: string;
  admissionDate: string;
  dischargeDate: string;
  providerName: string;
  admissionReason: string;
  isMajorDental: boolean;
  documents: Partial<Record<DocumentId, UploadedFile>>;
  confirmed: boolean;
}

export const WIZARD_STEPS = [
  { id: 1, label: 'Claim Type' },
  { id: 2, label: 'Member Info' },
  { id: 3, label: 'Diagnosis' },
  { id: 4, label: 'Documents' },
  { id: 5, label: 'Review' },
] as const;
