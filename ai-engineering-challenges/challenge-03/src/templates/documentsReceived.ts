import type { EmailTemplate } from '../types/template';
import { BRAND, emailLayout, greeting, infoBox, infoRow, paragraph } from './layout';

export const documentsReceivedTemplate: EmailTemplate = {
  id: 'documents_received',
  label: 'Documents Received',
  subject: 'Documents received for claim {{claim_number}}',
  accentColor: BRAND.primary,
  body: emailLayout(
    `
      ${greeting()}
      ${paragraph('Good news — we have received the documents for your claim. This helps us move your case forward without delays.')}
      ${infoBox(`
        ${infoRow('Claim number', 'claim_number')}
        ${infoRow('Documents received', 'document_count')}
      `)}
      ${paragraph('Documents on file:')}
      <div style="margin:0 0 16px;padding:16px 20px;background-color:#F9FAFB;border:1px solid ${BRAND.border};border-radius:8px;font-size:15px;line-height:1.7;color:${BRAND.text};">
        {{documents_list}}
      </div>
      ${paragraph('If anything is missing, we will contact you. Otherwise, your claim will continue to the next review stage.')}
    `,
    {
      preheader: 'Your supporting documents were received successfully.',
      accentColor: BRAND.primary,
    },
  ),
};
