import type { EmailTemplate } from '../types/template';
import { BRAND, emailLayout, greeting, infoBox, infoRow, paragraph } from './layout';

export const paymentSentTemplate: EmailTemplate = {
  id: 'payment_sent',
  label: 'Payment Sent',
  subject: 'Payment for claim {{claim_number}} has been processed',
  accentColor: BRAND.secondary,
  body: emailLayout(
    `
      ${greeting()}
      ${paragraph('Your payment has been processed successfully. Funds should arrive according to your bank or payment provider timeline.')}
      ${infoBox(`
        ${infoRow('Claim number', 'claim_number')}
        ${infoRow('Payment amount', 'payment_amount')}
        ${infoRow('Payment date', 'payment_date')}
        ${infoRow('Reference number', 'reference_number')}
      `, BRAND.secondary)}
      ${paragraph('Please keep this email for your records. If you do not see the payment within the expected timeframe, contact us with the reference number above.')}
      ${paragraph('Thank you for choosing Papaya Insurance. We hope you are feeling better soon.')}
    `,
    {
      preheader: 'Your claim payment has been sent — details inside.',
      accentColor: BRAND.secondary,
    },
  ),
};
