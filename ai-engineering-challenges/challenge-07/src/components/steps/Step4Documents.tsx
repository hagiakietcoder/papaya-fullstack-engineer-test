import type { ClaimFormState, DocumentId, UploadedFile } from '../../types/claim';
import { getDocumentRequirements, isDocumentRequired } from '../../utils/documents';
import { DocumentUpload } from '../DocumentUpload';

interface Step4DocumentsProps {
  state: ClaimFormState;
  errors: Record<string, string>;
  onUpload: (id: DocumentId, file: UploadedFile | null) => void;
}

export function Step4Documents({ state, errors, onUpload }: Step4DocumentsProps) {
  if (!state.claimType) {
    return null;
  }

  const requirements = getDocumentRequirements(state.claimType, state.isMajorDental);

  return (
    <section className="wizard-step" aria-labelledby="step4-title">
      <h2 id="step4-title" className="step-title">
        Document upload
      </h2>
      <p className="step-description">
        Upload supporting documents for your {state.claimType.toLowerCase()} claim. Required
        documents must be attached before you can continue.
      </p>

      <div className="document-list">
        {requirements.map((doc) => (
          <DocumentUpload
            key={doc.id}
            id={doc.id}
            label={doc.label}
            required={isDocumentRequired(doc, state.isMajorDental)}
            file={state.documents[doc.id]}
            error={errors[doc.id]}
            onUpload={onUpload}
          />
        ))}
      </div>
    </section>
  );
}
