import { WIZARD_STEPS } from '../types/claim';
import './ProgressIndicator.css';

interface ProgressIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function ProgressIndicator({ currentStep, onStepClick }: ProgressIndicatorProps) {
  return (
    <nav className="progress-indicator" aria-label="Claim submission progress">
      <ol className="progress-list">
        {WIZARD_STEPS.map((step) => {
          const isComplete = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <li
              key={step.id}
              className={`progress-item ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <button
                type="button"
                className="progress-button"
                onClick={() => onStepClick?.(step.id)}
                disabled={!onStepClick || step.id > currentStep}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className="progress-number">{isComplete ? '✓' : step.id}</span>
                <span className="progress-label">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
