import type { ClaimFormState, ClaimType } from '../types/claim';
import { getDocumentRequirements, isDocumentRequired } from './documents';

export interface StepValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

function hasValue(value: string): boolean {
  return value.trim().length > 0;
}

export function validateStep1(claimType: ClaimType | null): StepValidationResult {
  if (!claimType) {
    return { valid: false, errors: { claimType: 'Please select a claim type.' } };
  }

  return { valid: true, errors: {} };
}

export function validateStep2(state: ClaimFormState): StepValidationResult {
  const errors: Record<string, string> = {};

  if (!hasValue(state.memberName)) {
    errors.memberName = 'Member name is required.';
  }

  if (!hasValue(state.policyNumber)) {
    errors.policyNumber = 'Policy number is required.';
  }

  if (!hasValue(state.memberId)) {
    errors.memberId = 'Member ID is required.';
  }

  if (!hasValue(state.dateOfBirth)) {
    errors.dateOfBirth = 'Date of birth is required.';
  }

  if (state.isForDependent && !state.dependentId) {
    errors.dependentId = 'Please select a dependent.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStep3(state: ClaimFormState): StepValidationResult {
  const errors: Record<string, string> = {};

  if (!hasValue(state.diagnosis)) {
    errors.diagnosis = 'Diagnosis description is required.';
  }

  if (!hasValue(state.icd10Code)) {
    errors.icd10Code = 'ICD-10 code is required.';
  }

  if (!hasValue(state.providerName)) {
    errors.providerName = 'Provider or hospital name is required.';
  }

  if (!state.claimType) {
    return { valid: false, errors: { claimType: 'Claim type is required.' } };
  }

  if (state.claimType === 'INPATIENT') {
    if (!hasValue(state.admissionDate)) {
      errors.admissionDate = 'Admission date is required.';
    }

    if (!hasValue(state.dischargeDate)) {
      errors.dischargeDate = 'Discharge date is required.';
    }

    if (
      hasValue(state.admissionDate) &&
      hasValue(state.dischargeDate) &&
      state.dischargeDate < state.admissionDate
    ) {
      errors.dischargeDate = 'Discharge date must be on or after admission date.';
    }

    if (!hasValue(state.admissionReason)) {
      errors.admissionReason = 'Admission reason is required.';
    }
  } else if (!hasValue(state.treatmentDate)) {
    errors.treatmentDate = 'Treatment date is required.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStep4(state: ClaimFormState): StepValidationResult {
  const errors: Record<string, string> = {};

  if (!state.claimType) {
    return { valid: false, errors: { claimType: 'Claim type is required.' } };
  }

  const requirements = getDocumentRequirements(state.claimType, state.isMajorDental);

  for (const doc of requirements) {
    if (!isDocumentRequired(doc, state.isMajorDental)) {
      continue;
    }

    const uploaded = state.documents[doc.id];
    if (!uploaded || uploaded.status !== 'complete') {
      errors[doc.id] = `${doc.label} is required.`;
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateStep5(state: ClaimFormState): StepValidationResult {
  if (!state.confirmed) {
    return {
      valid: false,
      errors: { confirmed: 'Please confirm that the information is accurate.' },
    };
  }

  return { valid: true, errors: {} };
}

export function calculateLengthOfStay(admissionDate: string, dischargeDate: string): number | null {
  if (!admissionDate || !dischargeDate) {
    return null;
  }

  const start = new Date(admissionDate);
  const end = new Date(dischargeDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return null;
  }

  const diffMs = end.getTime() - start.getTime();
  return Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 1);
}
