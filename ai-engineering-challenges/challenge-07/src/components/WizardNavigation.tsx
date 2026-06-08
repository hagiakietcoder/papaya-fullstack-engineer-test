import './WizardNavigation.css';

interface WizardNavigationProps {
  currentStep: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  nextLabel?: string;
  showBack?: boolean;
}

export function WizardNavigation({
  currentStep,
  onBack,
  onNext,
  onSubmit,
  nextLabel = 'Continue',
  showBack = true,
}: WizardNavigationProps) {
  const isLastStep = currentStep === 5;

  function handlePrimary() {
    if (isLastStep && onSubmit) {
      onSubmit();
    } else {
      onNext();
    }
  }

  return (
    <div className="wizard-navigation">
      {showBack && currentStep > 1 ? (
        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
      ) : (
        <span />
      )}

      <button
        type="button"
        className="btn btn-primary"
        onClick={handlePrimary}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            handlePrimary();
          }
        }}
      >
        {isLastStep ? 'Submit Claim' : nextLabel}
      </button>
    </div>
  );
}
