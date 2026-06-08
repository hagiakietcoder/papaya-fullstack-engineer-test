import { useMemo, useState } from 'react';
import { SAMPLE_DATA } from '../data/sampleData';
import { EMAIL_TEMPLATES } from '../templates';
import type { EventType } from '../types/template';
import { extractVariables, renderSubject, renderTemplate } from '../utils/renderTemplate';
import { EventTypeDropdown } from './EventTypeDropdown';
import './TemplatePreview.css';

const EVENT_DESCRIPTIONS: Record<EventType, string> = {
  claim_submitted: 'Sent when a member first submits a claim.',
  documents_received: 'Confirms supporting documents were uploaded successfully.',
  under_review: 'Notifies the member that an assessor is reviewing the claim.',
  approved: 'Shares the approved amount and payment method.',
  rejected: 'Explains why the claim was not approved and how to appeal.',
  payment_sent: 'Confirms payment has been processed with reference details.',
};

export function TemplatePreview() {
  const [selectedEvent, setSelectedEvent] = useState<EventType>('claim_submitted');

  const template = EMAIL_TEMPLATES.find((item) => item.id === selectedEvent)!;
  const sampleData = SAMPLE_DATA[selectedEvent];

  const renderedSubject = useMemo(
    () => renderSubject(template.subject, sampleData),
    [template.subject, sampleData],
  );

  const renderedHtml = useMemo(
    () => renderTemplate(template.body, sampleData),
    [template.body, sampleData],
  );

  const variables = useMemo(
    () => extractVariables(`${template.subject}${template.body}`),
    [template.subject, template.body],
  );

  return (
    <div className="preview">
      <header className="preview__hero">
        <p className="preview__eyebrow">Papaya Insurance · Challenge 03</p>
        <h1>Claim Notification Email Preview</h1>
        <p className="preview__subtitle">
          Select a lifecycle event to preview the branded HTML email with sample data.
        </p>
      </header>

      <div className="preview__layout">
        <aside className="preview__sidebar">
          <EventTypeDropdown
            templates={EMAIL_TEMPLATES}
            value={selectedEvent}
            descriptions={EVENT_DESCRIPTIONS}
            onChange={setSelectedEvent}
          />

          <div className="preview__meta">
            <h2>Subject line</h2>
            <p className="preview__subject">{renderedSubject}</p>
          </div>

          <div className="preview__meta">
            <h2>Template variables</h2>
            <ul className="preview__variables">
              {variables.map((variable) => (
                <li key={variable}>
                  <code>{`{{${variable}}}`}</code>
                  <span>{sampleData[variable] ?? '—'}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="preview__meta">
            <h2>Brand colors</h2>
            <div className="preview__swatches">
              <span style={{ background: '#2563EB' }}>Primary</span>
              <span style={{ background: '#10B981' }}>Secondary</span>
              <span style={{ background: '#EF4444' }}>Warning</span>
            </div>
          </div>
        </aside>

        <section className="preview__canvas" aria-label="Email preview">
          <div className="preview__canvas-header">
            <span>{template.label} email preview</span>
            <span className="preview__badge">600px max-width</span>
          </div>
          <iframe
            title={`${template.label} email preview`}
            className="preview__iframe"
            srcDoc={renderedHtml}
            sandbox="allow-same-origin"
          />
        </section>
      </div>
    </div>
  );
}
