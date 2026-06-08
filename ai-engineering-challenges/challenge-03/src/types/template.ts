export type EventType =
  | 'claim_submitted'
  | 'documents_received'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'payment_sent';

export interface EmailTemplate {
  id: EventType;
  label: string;
  subject: string;
  accentColor: string;
  body: string;
}

export type TemplateData = Record<string, string>;

export interface EventOption {
  id: EventType;
  label: string;
  description: string;
}
