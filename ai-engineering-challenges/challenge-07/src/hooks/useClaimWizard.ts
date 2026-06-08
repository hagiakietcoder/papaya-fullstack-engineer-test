import { useCallback, useState } from 'react';
import { mockMember } from '../data/mockMember';
import type { ClaimFormState, ClaimType, DocumentId, UploadedFile } from '../types/claim';
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
} from '../utils/validation';

function createInitialState(): ClaimFormState {
  return {
    claimType: null,
    memberName: mockMember.memberName,
    policyNumber: mockMember.policyNumber,
    memberId: mockMember.memberId,
    dateOfBirth: mockMember.dateOfBirth,
    isForDependent: false,
    dependentId: null,
    diagnosis: '',
    icd10Code: '',
    icd10Description: '',
    treatmentDate: '',
    admissionDate: '',
    dischargeDate: '',
    providerName: '',
    admissionReason: '',
    isMajorDental: false,
    documents: {},
    confirmed: false,
  };
}

export function useClaimWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState<ClaimFormState>(createInitialState);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const updateField = useCallback(
    <K extends keyof ClaimFormState>(field: K, value: ClaimFormState[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
      setStepErrors((prev) => {
        const next = { ...prev };
        delete next[field as string];
        return next;
      });
    },
    [],
  );

  const setDocument = useCallback((id: DocumentId, file: UploadedFile | null) => {
    setFormState((prev) => {
      const documents = { ...prev.documents };
      if (file) {
        documents[id] = file;
      } else {
        delete documents[id];
      }

      return { ...prev, documents };
    });

    setStepErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const validateCurrentStep = useCallback(() => {
    let result;

    switch (currentStep) {
      case 1:
        result = validateStep1(formState.claimType);
        break;
      case 2:
        result = validateStep2(formState);
        break;
      case 3:
        result = validateStep3(formState);
        break;
      case 4:
        result = validateStep4(formState);
        break;
      case 5:
        result = validateStep5(formState);
        break;
      default:
        result = { valid: true, errors: {} };
    }

    setStepErrors(result.errors);
    return result.valid;
  }, [currentStep, formState]);

  const goNext = useCallback(() => {
    if (!validateCurrentStep()) {
      return false;
    }

    setCurrentStep((step) => Math.min(step + 1, 5));
    setStepErrors({});
    return true;
  }, [validateCurrentStep]);

  const goBack = useCallback(() => {
    setCurrentStep((step) => Math.max(step - 1, 1));
    setStepErrors({});
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 5) {
      setCurrentStep(step);
      setStepErrors({});
    }
  }, []);

  const selectClaimType = useCallback((claimType: ClaimType) => {
    setFormState((prev) => ({
      ...prev,
      claimType,
      isMajorDental: claimType === 'DENTAL' ? prev.isMajorDental : false,
    }));
    setStepErrors((prev) => {
      const next = { ...prev };
      delete next.claimType;
      return next;
    });
  }, []);

  const submitClaim = useCallback(() => {
    if (!validateCurrentStep()) {
      return false;
    }

    const id = `CLM-${Date.now().toString(36).toUpperCase()}`;
    const payload = {
      submissionId: id,
      submittedAt: new Date().toISOString(),
      ...formState,
    };

    console.log('Claim submitted:', payload);
    setSubmissionId(id);
    setSubmitted(true);
    return true;
  }, [formState, validateCurrentStep]);

  const resetWizard = useCallback(() => {
    setFormState(createInitialState());
    setCurrentStep(1);
    setStepErrors({});
    setSubmitted(false);
    setSubmissionId(null);
  }, []);

  return {
    currentStep,
    formState,
    stepErrors,
    submitted,
    submissionId,
    updateField,
    setDocument,
    selectClaimType,
    goNext,
    goBack,
    goToStep,
    submitClaim,
    resetWizard,
    validateCurrentStep,
  };
}
