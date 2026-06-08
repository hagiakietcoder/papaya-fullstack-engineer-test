export type ClaimType = 'OUTPATIENT' | 'INPATIENT' | 'DENTAL' | 'MATERNITY';
export type ClaimStatus = 'APPROVED' | 'REJECTED' | 'PENDING' | 'IN_REVIEW';
export type Country = 'Thailand' | 'Vietnam' | 'Hong Kong';
export type TimeGrouping = 'week' | 'month';

export interface Claim {
  claim_id: string;
  policy_id: string;
  member_name: string;
  claim_type: ClaimType;
  diagnosis_icd10: string;
  submitted_amount: number;
  approved_amount: number;
  status: ClaimStatus;
  submitted_date: string;
  processed_date: string | null;
  assessor: string;
  insurer: string;
  country: Country;
}

export interface DashboardFilters {
  dateFrom: string;
  dateTo: string;
  claimTypes: ClaimType[];
  insurers: string[];
  countries: Country[];
  statuses: ClaimStatus[];
  diagnosisDrilldown: string | null;
}

export interface KpiMetrics {
  totalClaims: number;
  approvalRate: number;
  avgProcessingDays: number;
  totalApprovedAmount: number;
  avgClaimAmount: number;
}

export const CLAIM_TYPES: ClaimType[] = ['OUTPATIENT', 'INPATIENT', 'DENTAL', 'MATERNITY'];
export const STATUSES: ClaimStatus[] = ['APPROVED', 'REJECTED', 'PENDING', 'IN_REVIEW'];
export const COUNTRIES: Country[] = ['Thailand', 'Vietnam', 'Hong Kong'];

export const ICD10_CODES = [
  { code: 'J06.9', label: 'J06.9 — Acute URI' },
  { code: 'J20.9', label: 'J20.9 — Acute bronchitis' },
  { code: 'I10', label: 'I10 — Hypertension' },
  { code: 'E11.9', label: 'E11.9 — Type 2 diabetes' },
  { code: 'M54.5', label: 'M54.5 — Low back pain' },
  { code: 'K21.9', label: 'K21.9 — GERD' },
  { code: 'J45.909', label: 'J45.909 — Asthma' },
  { code: 'N39.0', label: 'N39.0 — UTI' },
  { code: 'K02.9', label: 'K02.9 — Dental caries' },
  { code: 'O80', label: 'O80 — Normal delivery' },
  { code: 'J18.9', label: 'J18.9 — Pneumonia' },
  { code: 'R51.9', label: 'R51.9 — Headache' },
  { code: 'E78.5', label: 'E78.5 — Hyperlipidemia' },
  { code: 'F41.1', label: 'F41.1 — Anxiety disorder' },
  { code: 'H66.90', label: 'H66.90 — Otitis media' },
  { code: 'K35.80', label: 'K35.80 — Appendicitis' },
  { code: 'S93.401A', label: 'S93.401A — Ankle sprain' },
  { code: 'Z00.00', label: 'Z00.00 — Health check-up' },
  { code: 'K08.89', label: 'K08.89 — Dental disorder' },
  { code: 'O26.9', label: 'O26.9 — Pregnancy condition' },
] as const;

export const ASSESSORS = [
  'Siriporn Wattana',
  'Anan Chaiyaporn',
  'Malee Srisuk',
  'David Chen',
  'Priya Nair',
];

export const INSURERS = ['Papaya Health', 'AsiaCare Insurance', 'Pacific Shield'];
