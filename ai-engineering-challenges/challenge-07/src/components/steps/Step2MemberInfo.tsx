import { mockMember } from '../../data/mockMember';
import type { ClaimFormState } from '../../types/claim';
import { DependentDropdown } from '../DependentDropdown';

interface Step2MemberInfoProps {
  state: ClaimFormState;
  errors: Record<string, string>;
  onChange: <K extends keyof ClaimFormState>(field: K, value: ClaimFormState[K]) => void;
}

export function Step2MemberInfo({ state, errors, onChange }: Step2MemberInfoProps) {
  return (
    <section className="wizard-step" aria-labelledby="step2-title">
      <h2 id="step2-title" className="step-title">
        Member & policy information
      </h2>
      <p className="step-description">
        Pre-filled from your policy. You can edit fields or submit on behalf of a dependent.
      </p>

      <div className="form-grid">
        <div className="form-field">
          <label className="field-label" htmlFor="memberName">
            Member name
          </label>
          <input
            id="memberName"
            type="text"
            className={`field-input ${errors.memberName ? 'has-error' : ''}`}
            value={state.memberName}
            onChange={(event) => onChange('memberName', event.target.value)}
          />
          {errors.memberName && <p className="field-error">{errors.memberName}</p>}
        </div>

        <div className="form-field">
          <label className="field-label" htmlFor="policyNumber">
            Policy number
          </label>
          <input
            id="policyNumber"
            type="text"
            className={`field-input ${errors.policyNumber ? 'has-error' : ''}`}
            value={state.policyNumber}
            onChange={(event) => onChange('policyNumber', event.target.value)}
          />
          {errors.policyNumber && <p className="field-error">{errors.policyNumber}</p>}
        </div>

        <div className="form-field">
          <label className="field-label" htmlFor="memberId">
            Member ID
          </label>
          <input
            id="memberId"
            type="text"
            className={`field-input ${errors.memberId ? 'has-error' : ''}`}
            value={state.memberId}
            onChange={(event) => onChange('memberId', event.target.value)}
          />
          {errors.memberId && <p className="field-error">{errors.memberId}</p>}
        </div>

        <div className="form-field">
          <label className="field-label" htmlFor="dateOfBirth">
            Date of birth
          </label>
          <input
            id="dateOfBirth"
            type="date"
            className={`field-input ${errors.dateOfBirth ? 'has-error' : ''}`}
            value={state.dateOfBirth}
            onChange={(event) => onChange('dateOfBirth', event.target.value)}
          />
          {errors.dateOfBirth && <p className="field-error">{errors.dateOfBirth}</p>}
        </div>
      </div>

      <div className="dependent-toggle">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={state.isForDependent}
            onChange={(event) => {
              onChange('isForDependent', event.target.checked);
              if (!event.target.checked) {
                onChange('dependentId', null);
              }
            }}
          />
          This claim is for a dependent
        </label>
      </div>

      {state.isForDependent && (
        <DependentDropdown
          dependents={mockMember.dependents}
          value={state.dependentId}
          onChange={(dependentId) => onChange('dependentId', dependentId)}
          error={errors.dependentId}
        />
      )}
    </section>
  );
}
