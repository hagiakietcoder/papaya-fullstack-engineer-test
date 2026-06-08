import { useId } from 'react';
import type { DocumentId, UploadedFile } from '../types/claim';
import { formatFileSize, validateFile } from '../utils/documents';
import './DocumentUpload.css';

interface DocumentUploadProps {
  id: DocumentId;
  label: string;
  required: boolean;
  file: UploadedFile | undefined;
  error?: string;
  onUpload: (id: DocumentId, file: UploadedFile | null) => void;
}

function simulateUpload(
  id: DocumentId,
  file: File,
  onProgress: (progress: number) => void,
): Promise<UploadedFile> {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = window.setInterval(() => {
      progress += 20;
      onProgress(progress);

      if (progress >= 100) {
        window.clearInterval(interval);
        resolve({
          id,
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 100,
          status: 'complete',
        });
      }
    }, 120);
  });
}

export function DocumentUpload({
  id,
  label,
  required,
  file,
  error,
  onUpload,
}: DocumentUploadProps) {
  const inputId = useId();

  async function handleFileChange(selected: File | null) {
    if (!selected) {
      onUpload(id, null);
      return;
    }

    const validationError = validateFile(selected);
    if (validationError) {
      onUpload(id, {
        id,
        name: selected.name,
        size: selected.size,
        type: selected.type,
        progress: 0,
        status: 'error',
        error: validationError,
      });
      return;
    }

    onUpload(id, {
      id,
      name: selected.name,
      size: selected.size,
      type: selected.type,
      progress: 0,
      status: 'uploading',
    });

    const completed = await simulateUpload(id, selected, (progress) => {
      onUpload(id, {
        id,
        name: selected.name,
        size: selected.size,
        type: selected.type,
        progress,
        status: progress >= 100 ? 'complete' : 'uploading',
      });
    });

    onUpload(id, completed);
  }

  return (
    <div className={`document-upload ${error ? 'has-error' : ''}`}>
      <div className="document-header">
        <label className="document-label" htmlFor={inputId}>
          {label}
          <span className={`document-badge ${required ? 'required' : 'optional'}`}>
            {required ? 'Required' : 'Optional'}
          </span>
        </label>
      </div>

      <div className="document-dropzone">
        <input
          id={inputId}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="document-input"
          onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
        />
        <label htmlFor={inputId} className="document-trigger">
          Choose file (PDF, JPG, PNG · max 10 MB)
        </label>
      </div>

      {file && (
        <div className={`document-status status-${file.status}`}>
          <div className="document-meta">
            <span className="document-name">{file.name}</span>
            <span className="document-size">{formatFileSize(file.size)}</span>
          </div>

          {file.status === 'uploading' && (
            <div className="upload-progress" role="progressbar" aria-valuenow={file.progress} aria-valuemin={0} aria-valuemax={100}>
              <div className="upload-progress-bar" style={{ width: `${file.progress}%` }} />
            </div>
          )}

          {file.status === 'complete' && (
            <button type="button" className="document-remove" onClick={() => onUpload(id, null)}>
              Remove
            </button>
          )}

          {file.status === 'error' && <p className="field-error">{file.error}</p>}
        </div>
      )}

      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
