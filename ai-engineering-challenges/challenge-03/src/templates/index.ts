import type { EmailTemplate, EventType } from '../types/template';
import { approvedTemplate } from './approved';
import { claimSubmittedTemplate } from './claimSubmitted';
import { documentsReceivedTemplate } from './documentsReceived';
import { paymentSentTemplate } from './paymentSent';
import { rejectedTemplate } from './rejected';
import { underReviewTemplate } from './underReview';

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  claimSubmittedTemplate,
  documentsReceivedTemplate,
  underReviewTemplate,
  approvedTemplate,
  rejectedTemplate,
  paymentSentTemplate,
];

export const TEMPLATE_MAP: Record<EventType, EmailTemplate> = EMAIL_TEMPLATES.reduce(
  (accumulator, template) => {
    accumulator[template.id] = template;
    return accumulator;
  },
  {} as Record<EventType, EmailTemplate>,
);

export function getTemplate(id: EventType): EmailTemplate {
  return TEMPLATE_MAP[id];
}
