import type { EmailTemplate } from '../types/template';
import { BRAND, emailLayout, greeting, infoBox, infoRow, paragraph } from './layout';

export const underReviewTemplate: EmailTemplate = {
  id: 'under_review',
  label: 'Under Review',
  subject: 'Your claim {{claim_number}} is being reviewed',
  accentColor: BRAND.primary,
  body: emailLayout(
    `
      ${greeting()}
      ${paragraph('Your claim is now with our assessment team. They are carefully reviewing the details to make sure everything is complete.')}
      ${infoBox(`
        ${infoRow('Claim number', 'claim_number')}
        ${infoRow('Assessor', 'assessor_name')}
        ${infoRow('Estimated review time', 'estimated_days')}
      `)}
      ${paragraph('We will notify you as soon as a decision is ready. No action is needed from you at this time unless we reach out for more information.')}
      ${paragraph('Thank you for your patience — we know waiting can be stressful, and we are working on your case.')}
    `,
    {
      preheader: 'Your claim is currently under review by our team.',
      accentColor: BRAND.primary,
    },
  ),
};
