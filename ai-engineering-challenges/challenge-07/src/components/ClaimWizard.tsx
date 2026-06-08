import { useClaimWizard } from '../hooks/useClaimWizard';
import { ProgressIndicator } from './ProgressIndicator';
import { WizardNavigation } from './WizardNavigation';
import { Step1ClaimType } from './steps/Step1ClaimType';
import { Step2MemberInfo } from './steps/Step2MemberInfo';
import { Step3Diagnosis } from './steps/Step3Diagnosis';
import { Step4Documents } from './steps/Step4Documents';
import { Step5Review } from './steps/Step5Review';
import './ClaimWizard.css';

export function ClaimWizard() {
  const wizard = useClaimWizard();

  if (wizard.submitted && wizard.submissionId) {
    return (
      <div className="claim-wizard">
        <div className="success-panel">
          <div className="success-icon" aria-hidden="true">
            ✓
          </div>
          <h2>Claim submitted successfully</h2>
          <p>
            Your claim <strong>{wizard.submissionId}</strong> has been received. Our team will
            review your submission and contact you within 3–5 business days.
          </p>
          <p className="success-hint">
            Submission details were logged to the browser console for demo purposes.
          </p>
          <button type="button" className="btn btn-primary" onClick={wizard.resetWizard}>
            Submit another claim
          </button>
        </div>
      </div>
    );
  }

  function renderStep() {
    switch (wizard.currentStep) {
      case 1:
        return (
          <Step1ClaimType
            selected={wizard.formState.claimType}
            onSelect={wizard.selectClaimType}
            error={wizard.stepErrors.claimType}
          />
        );
      case 2:
        return (
          <Step2MemberInfo
            state={wizard.formState}
            errors={wizard.stepErrors}
            onChange={wizard.updateField}
          />
        );
      case 3:
        return (
          <Step3Diagnosis
            state={wizard.formState}
            errors={wizard.stepErrors}
            onChange={wizard.updateField}
          />
        );
      case 4:
        return (
          <Step4Documents
            state={wizard.formState}
            errors={wizard.stepErrors}
            onUpload={wizard.setDocument}
          />
        );
      case 5:
        return (
          <Step5Review
            state={wizard.formState}
            errors={wizard.stepErrors}
            onChange={wizard.updateField}
            onEditStep={wizard.goToStep}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="claim-wizard">
      <header className="wizard-header">
        <p className="wizard-eyebrow">Papaya Insurance</p>
        <h1>Claims Intake Wizard</h1>
        <p className="wizard-subtitle">
          Submit your medical claim in five guided steps. Your progress is saved as you navigate.
        </p>
      </header>

      <ProgressIndicator
        currentStep={wizard.currentStep}
        onStepClick={(step) => {
          if (step < wizard.currentStep) {
            wizard.goToStep(step);
          }
        }}
      />

      <div className="wizard-card">{renderStep()}</div>

      <WizardNavigation
        currentStep={wizard.currentStep}
        onBack={wizard.goBack}
        onNext={wizard.goNext}
        onSubmit={wizard.submitClaim}
        showBack={wizard.currentStep > 1}
      />
    </div>
  );
}
