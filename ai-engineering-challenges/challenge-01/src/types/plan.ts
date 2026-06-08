export interface OutpatientBenefit {
  limit_per_visit: number;
  visits_per_year: number;
}

export interface InpatientBenefit {
  limit_per_day: number;
  days_per_year: number;
}

export interface DentalBenefit {
  limit_per_year: number;
}

export interface MaternityBenefit {
  limit_per_pregnancy: number;
}

export interface PlanBenefits {
  outpatient: OutpatientBenefit | null;
  inpatient: InpatientBenefit | null;
  dental: DentalBenefit | null;
  maternity: MaternityBenefit | null;
}

export interface Plan {
  name: string;
  monthly_premium: number;
  annual_limit: number;
  benefits: PlanBenefits;
  copay_percentage: number;
  waiting_period_days: number;
  highlights: string[];
}

export type CompareDirection = 'higher' | 'lower';

export interface ComparisonRow {
  id: string;
  label: string;
  direction: CompareDirection;
  getValue: (plan: Plan) => number | null;
  format: (plan: Plan) => string;
  isIncluded?: (plan: Plan) => boolean;
}
