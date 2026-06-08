import type { EventType, TemplateData } from '../types/template';

const shared: TemplateData = {
  claim_number: 'CLM-2024-00847',
  member_name: 'Somchai Wong',
};

export const SAMPLE_DATA: Record<EventType, TemplateData> = {
  claim_submitted: {
    ...shared,
    claim_type: 'Outpatient',
    submitted_date: 'March 15, 2024',
  },
  documents_received: {
    ...shared,
    document_count: '3',
    documents_list: '• Medical receipt — Bangkok General Hospital<br />• Doctor&apos;s diagnosis letter<br />• Pharmacy invoice',
  },
  under_review: {
    ...shared,
    assessor_name: 'Niran Patel',
    estimated_days: '3–5 business days',
  },
  approved: {
    ...shared,
    approved_amount: 'THB 12,500',
    original_amount: 'THB 15,000',
    payment_method: 'Bank transfer (SCB ···4821)',
  },
  rejected: {
    ...shared,
    rejection_reason:
      'The submitted receipt does not include a valid diagnosis code required for outpatient coverage under your plan. Without this information, we cannot confirm that the treatment qualifies for reimbursement.',
    appeal_deadline: 'April 30, 2024',
  },
  payment_sent: {
    ...shared,
    payment_amount: 'THB 12,500',
    payment_date: 'April 2, 2024',
    reference_number: 'PAY-2024-991823',
  },
};
