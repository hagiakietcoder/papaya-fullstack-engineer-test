import type { ClaimFormState } from '../../types/claim';
import { calculateLengthOfStay } from '../../utils/validation';
import { Icd10Autocomplete } from '../Icd10Autocomplete';
import { ProviderAutocomplete } from '../ProviderAutocomplete';

interface Step3DiagnosisProps {
  state: ClaimFormState;
  errors: Record<string, string>;
  onChange: <K extends keyof ClaimFormState>(field: K, value: ClaimFormState[K]) => void;
}

export function Step3Diagnosis({ state, errors, onChange }: Step3DiagnosisProps) {
  const lengthOfStay =
    state.claimType === 'INPATIENT'
      ? calculateLengthOfStay(state.admissionDate, state.dischargeDate)
      : null;

  return (
    <section className="wizard-step" aria-labelledby="step3-title">
      <h2 id="step3-title" className="step-title">
        Diagnosis & treatment
      </h2>
      <p className="step-description">
        Provide clinical details and treatment dates. Fields adapt based on your claim type.
      </p>

      <div className="form-grid">
        <div className="form-field form-field-full">
          <label className="field-label" htmlFor="diagnosis">
            Diagnosis description
          </label>
          <textarea
            id="diagnosis"
            className={`field-textarea ${errors.diagnosis ? 'has-error' : ''}`}
            rows={3}
            value={state.diagnosis}
            placeholder="Describe the condition or reason for treatment"
            onChange={(event) => onChange('diagnosis', event.target.value)}
          />
          {errors.diagnosis && <p className="field-error">{errors.diagnosis}</p>}
        </div>

        <div className="form-field form-field-full">
          <Icd10Autocomplete
            code={state.icd10Code}
            description={state.icd10Description}
            error={errors.icd10Code}
            onSelect={(item) => {
              onChange('icd10Code', item.code);
              onChange('icd10Description', item.description);
            }}
            onClear={() => {
              onChange('icd10Code', '');
              onChange('icd10Description', '');
            }}
          />
        </div>

        <div className="form-field form-field-full">
          <ProviderAutocomplete
            value={state.providerName}
            onChange={(value) => onChange('providerName', value)}
            error={errors.providerName}
          />
        </div>

        {state.claimType === 'INPATIENT' ? (
          <>
            <div className="form-field">
              <label className="field-label" htmlFor="admissionDate">
                Admission date
              </label>
              <input
                id="admissionDate"
                type="date"
                className={`field-input ${errors.admissionDate ? 'has-error' : ''}`}
                value={state.admissionDate}
                onChange={(event) => onChange('admissionDate', event.target.value)}
              />
              {errors.admissionDate && <p className="field-error">{errors.admissionDate}</p>}
            </div>

            <div className="form-field">
              <label className="field-label" htmlFor="dischargeDate">
                Discharge date
              </label>
              <input
                id="dischargeDate"
                type="date"
                className={`field-input ${errors.dischargeDate ? 'has-error' : ''}`}
                value={state.dischargeDate}
                onChange={(event) => onChange('dischargeDate', event.target.value)}
              />
              {errors.dischargeDate && <p className="field-error">{errors.dischargeDate}</p>}
            </div>

            <div className="form-field form-field-full">
              <label className="field-label" htmlFor="admissionReason">
                Admission reason
              </label>
              <input
                id="admissionReason"
                type="text"
                className={`field-input ${errors.admissionReason ? 'has-error' : ''}`}
                value={state.admissionReason}
                placeholder="e.g. Pneumonia requiring IV antibiotics"
                onChange={(event) => onChange('admissionReason', event.target.value)}
              />
              {errors.admissionReason && <p className="field-error">{errors.admissionReason}</p>}
            </div>

            {lengthOfStay !== null && (
              <div className="info-banner form-field-full">
                Length of stay: <strong>{lengthOfStay} day{lengthOfStay === 1 ? '' : 's'}</strong>{' '}
                (auto-calculated from admission and discharge dates)
              </div>
            )}
          </>
        ) : (
          <div className="form-field">
            <label className="field-label" htmlFor="treatmentDate">
              Treatment date
            </label>
            <input
              id="treatmentDate"
              type="date"
              className={`field-input ${errors.treatmentDate ? 'has-error' : ''}`}
              value={state.treatmentDate}
              onChange={(event) => onChange('treatmentDate', event.target.value)}
            />
            {errors.treatmentDate && <p className="field-error">{errors.treatmentDate}</p>}
          </div>
        )}

        {state.claimType === 'DENTAL' && (
          <div className="form-field form-field-full">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={state.isMajorDental}
                onChange={(event) => onChange('isMajorDental', event.target.checked)}
              />
              This is a major dental procedure (requires treatment plan)
            </label>
          </div>
        )}
      </div>
    </section>
  );
}
