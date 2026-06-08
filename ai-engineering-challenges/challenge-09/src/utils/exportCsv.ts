import type { Claim } from '../types/claim';

function escapeCsv(value: string | number | null): string {
  if (value === null) return '';
  const text = String(value);
  if (text.includes(',') || text.includes('"')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function claimsToCsv(claims: Claim[]): string {
  const headers = [
    'claim_id', 'policy_id', 'member_name', 'claim_type', 'diagnosis_icd10',
    'submitted_amount', 'approved_amount', 'status', 'submitted_date',
    'processed_date', 'assessor', 'insurer', 'country',
  ];

  const rows = claims.map((claim) =>
    [
      claim.claim_id,
      claim.policy_id,
      claim.member_name,
      claim.claim_type,
      claim.diagnosis_icd10,
      claim.submitted_amount,
      claim.approved_amount,
      claim.status,
      claim.submitted_date,
      claim.processed_date,
      claim.assessor,
      claim.insurer,
      claim.country,
    ].map(escapeCsv).join(','),
  );

  return [headers.join(','), ...rows].join('\n');
}

export function downloadCsv(claims: Claim[], filename = 'filtered-claims.csv'): void {
  const csv = claimsToCsv(claims);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
