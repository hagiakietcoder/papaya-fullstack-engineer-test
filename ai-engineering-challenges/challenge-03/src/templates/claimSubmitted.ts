import type { EmailTemplate } from '../types/template';
import { BRAND, emailLayout, greeting, infoBox, infoRow, paragraph } from './layout';

export const claimSubmittedTemplate: EmailTemplate = {
  id: 'claim_submitted',
  label: 'Claim Submitted',
  subject: 'Your claim {{claim_number}} has been received',
  accentColor: BRAND.primary,
  body: emailLayout(
    `
      ${greeting()}
      ${paragraph('Thank you for submitting your claim. We have received it and added it to our review queue.')}
      ${paragraph('Here is a quick summary of what we received:')}
      ${infoBox(`
        ${infoRow('Claim number', 'claim_number')}
        ${infoRow('Claim type', 'claim_type')}
        ${infoRow('Submitted on', 'submitted_date')}
      `)}
      ${paragraph('Our team will review your submission and reach out if we need anything else. Most claims receive an initial update within a few business days.')}
      ${paragraph('You can reply to this email if you have questions — we are here to help.')}
    `,
    {
      preheader: 'We received your claim and will begin processing it soon.',
      accentColor: BRAND.primary,
    },
  ),
};
