import type { EmailTemplate } from '../types/template';
import { BRAND, emailLayout, greeting, infoBox, infoRow, paragraph, stepsList } from './layout';

export const rejectedTemplate: EmailTemplate = {
  id: 'rejected',
  label: 'Rejected',
  subject: 'Update on claim {{claim_number}}',
  accentColor: BRAND.warning,
  body: emailLayout(
    `
      ${greeting()}
      ${paragraph('We have completed our review of your claim. Unfortunately, we are unable to approve it at this time.')}
      ${infoBox(`
        ${infoRow('Claim number', 'claim_number')}
      `, BRAND.warning)}
      <div style="margin:24px 0;padding:20px 24px;background-color:#FEF2F2;border:1px solid #FECACA;border-radius:8px;">
        <p style="margin:0 0 10px;font-size:15px;font-weight:700;color:${BRAND.warning};">Why was this claim not approved?</p>
        <p style="margin:0;font-size:15px;line-height:1.7;color:${BRAND.text};">{{rejection_reason}}</p>
      </div>
      ${stepsList('What you can do next', [
        'Review the explanation above and check whether any documents were missing or unclear.',
        'Gather any additional supporting documents if you believe the decision should be reconsidered.',
        `Submit an appeal before <strong>{{appeal_deadline}}</strong> by replying to this email or contacting support.`,
      ])}
      ${paragraph('We understand this may be disappointing. Our support team is ready to walk you through your options.')}
    `,
    {
      preheader: 'An update on your claim — please review the explanation and next steps.',
      accentColor: BRAND.warning,
    },
  ),
};
