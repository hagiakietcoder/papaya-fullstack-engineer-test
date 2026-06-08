import type { ClaimType } from '../../types/claim';
import './Step1ClaimType.css';

interface Step1ClaimTypeProps {
  selected: ClaimType | null;
  onSelect: (type: ClaimType) => void;
  error?: string;
}

const CLAIM_OPTIONS: Array<{
  type: ClaimType;
  title: string;
  description: string;
  documents: string;
}> = [
  {
    type: 'OUTPATIENT',
    title: 'Outpatient',
    description: 'Doctor visits, prescriptions, and same-day treatments.',
    documents: 'Medical receipt (required), prescription (optional)',
  },
  {
    type: 'INPATIENT',
    title: 'Inpatient',
    description: 'Hospital admission with overnight stay or surgery.',
    documents: 'Discharge summary, itemized bill, medical receipt (all required)',
  },
  {
    type: 'DENTAL',
    title: 'Dental',
    description: 'Dental check-ups, fillings, extractions, and major procedures.',
    documents: 'Dental receipt (required), treatment plan (required for major dental)',
  },
];

export function Step1ClaimType({ selected, onSelect, error }: Step1ClaimTypeProps) {
  return (
    <section className="wizard-step" aria-labelledby="step1-title">
      <h2 id="step1-title" className="step-title">
        Select claim type
      </h2>
      <p className="step-description">
        Your selection determines the information and documents required in the following steps.
      </p>

      <div className="claim-type-grid" role="radiogroup" aria-label="Claim type">
        {CLAIM_OPTIONS.map((option) => {
          const isSelected = selected === option.type;

          return (
            <button
              key={option.type}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`claim-type-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(option.type)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(option.type);
                }
              }}
            >
              <span className="claim-type-title">{option.title}</span>
              <span className="claim-type-desc">{option.description}</span>
              <span className="claim-type-docs">
                <strong>Documents:</strong> {option.documents}
              </span>
            </button>
          );
        })}
      </div>

      {error && <p className="field-error step-error">{error}</p>}
    </section>
  );
}
