import type { ReactNode } from 'react';
import { mockMember } from '../../data/mockMember';
import type { ClaimFormState } from '../../types/claim';
import { formatFileSize, getClaimTypeLabel, getDocumentRequirements, isDocumentRequired } from '../../utils/documents';
import { calculateLengthOfStay } from '../../utils/validation';

interface Step5ReviewProps {
  state: ClaimFormState;
  errors: Record<string, string>;
  onChange: <K extends keyof ClaimFormState>(field: K, value: ClaimFormState[K]) => void;
  onEditStep: (step: number) => void;
}

function ReviewSection({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: ReactNode;
}) {
  return (
    <div className="review-section">
      <div className="review-section-header">
        <h3>{title}</h3>
        <button type="button" className="review-edit-btn" onClick={() => onEdit(step)}>
          Edit
        </button>
      </div>
      <dl className="review-list">{children}</dl>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value || '—'}</dd>
    </>
  );
}

export function Step5Review({ state, errors, onChange, onEditStep }: Step5ReviewProps) {
  const dependent = mockMember.dependents.find((item) => item.id === state.dependentId);
  const lengthOfStay =
    state.claimType === 'INPATIENT'
      ? calculateLengthOfStay(state.admissionDate, state.dischargeDate)
      : null;

  const documents =
    state.claimType
      ? getDocumentRequirements(state.claimType, state.isMajorDental).filter((doc) => state.documents[doc.id])
      : [];

  return (
    <section className="wizard-step" aria-labelledby="step5-title">
      <h2 id="step5-title" className="step-title">
        Review & submit
      </h2>
      <p className="step-description">
        Please review all information before submitting. You can go back to any step to make changes.
      </p>

      <ReviewSection title="Claim type" step={1} onEdit={onEditStep}>
        <ReviewItem label="Type" value={state.claimType ? getClaimTypeLabel(state.claimType) : '—'} />
      </ReviewSection>

      <ReviewSection title="Member & policy" step={2} onEdit={onEditStep}>
        <ReviewItem label="Member name" value={state.memberName} />
        <ReviewItem label="Policy number" value={state.policyNumber} />
        <ReviewItem label="Member ID" value={state.memberId} />
        <ReviewItem label="Date of birth" value={state.dateOfBirth} />
        <ReviewItem
          label="Claim for"
          value={
            state.isForDependent && dependent
              ? `${dependent.name} (${dependent.relationship})`
              : 'Policy holder'
          }
        />
      </ReviewSection>

      <ReviewSection title="Diagnosis & treatment" step={3} onEdit={onEditStep}>
        <ReviewItem label="Diagnosis" value={state.diagnosis} />
        <ReviewItem
          label="ICD-10"
          value={state.icd10Code ? `${state.icd10Code} — ${state.icd10Description}` : '—'}
        />
        <ReviewItem label="Provider" value={state.providerName} />
        {state.claimType === 'INPATIENT' ? (
          <>
            <ReviewItem label="Admission date" value={state.admissionDate} />
            <ReviewItem label="Discharge date" value={state.dischargeDate} />
            <ReviewItem
              label="Length of stay"
              value={lengthOfStay !== null ? `${lengthOfStay} day(s)` : '—'}
            />
            <ReviewItem label="Admission reason" value={state.admissionReason} />
          </>
        ) : (
          <ReviewItem label="Treatment date" value={state.treatmentDate} />
        )}
        {state.claimType === 'DENTAL' && (
          <ReviewItem
            label="Major dental"
            value={state.isMajorDental ? 'Yes — treatment plan required' : 'No'}
          />
        )}
      </ReviewSection>

      <ReviewSection title="Documents" step={4} onEdit={onEditStep}>
        {documents.length === 0 ? (
          <ReviewItem label="Uploaded" value="No documents uploaded" />
        ) : (
          documents.map((doc) => {
            const file = state.documents[doc.id];
            return (
              <ReviewItem
                key={doc.id}
                label={doc.label}
                value={
                  file
                    ? `${file.name} (${formatFileSize(file.size)}) — ${
                        isDocumentRequired(doc, state.isMajorDental) ? 'Required' : 'Optional'
                      }`
                    : '—'
                }
              />
            );
          })
        )}
      </ReviewSection>

      <div className="confirm-box">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={state.confirmed}
            onChange={(event) => onChange('confirmed', event.target.checked)}
          />
          I confirm this information is accurate
        </label>
        {errors.confirmed && <p className="field-error">{errors.confirmed}</p>}
      </div>
    </section>
  );
}
