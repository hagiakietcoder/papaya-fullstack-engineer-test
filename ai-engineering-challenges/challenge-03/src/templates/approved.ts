import type { EmailTemplate } from '../types/template';
import { BRAND, emailLayout, greeting, highlightAmount, infoBox, infoRow, paragraph } from './layout';

export const approvedTemplate: EmailTemplate = {
  id: 'approved',
  label: 'Approved',
  subject: 'Good news! Claim {{claim_number}} has been approved',
  accentColor: BRAND.secondary,
  body: emailLayout(
    `
      ${greeting()}
      ${paragraph('We have good news — your claim has been approved. Here are the details:')}
      ${highlightAmount('Approved Amount', 'approved_amount', BRAND.secondary)}
      ${infoBox(`
        ${infoRow('Claim number', 'claim_number')}
        ${infoRow('Original claim amount', 'original_amount')}
        ${infoRow('Payment method', 'payment_method')}
      `, BRAND.secondary)}
      ${paragraph('We will process your payment according to the method above. You will receive another email once the payment has been sent.')}
      ${paragraph('Congratulations, and thank you for trusting Papaya Insurance with your care.')}
    `,
    {
      preheader: 'Your claim has been approved — see your approved amount inside.',
      accentColor: BRAND.secondary,
    },
  ),
};
