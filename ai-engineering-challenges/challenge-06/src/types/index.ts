export type Decision = 'COVERED' | 'PARTIALLY_COVERED' | 'DENIED';

export interface CopayRule {
  percentage: number;
  max_per_visit?: number;
}

export interface SubBenefit {
  name: string;
  limit_per_visit?: number;
  limit_per_event?: number;
  limit_per_year?: number;
  visits_per_year?: number;
  max_days?: number;
}

export interface Benefit {
  type: string;
  annual_limit: number;
  lifetime_limit?: number;
  waiting_period_days?: number;
  sub_benefits: SubBenefit[];
}

export interface Deductible {
  annual: number;
  applies_to: string[];
}

export interface Exclusion {
  match: string;
  reason: string;
  match_field?: 'diagnosis' | 'sub_benefit';
}

export interface CalculatorPolicy {
  policy_number: string;
  effective_date: string;
  currency: string;
  deductible: Deductible;
  benefits: Benefit[];
  copay: Record<string, CopayRule>;
  exclusions: Exclusion[];
}

export interface Expense {
  expense_id: string;
  date: string;
  benefit_type: string;
  sub_benefit: string;
  amount: number;
  diagnosis: string;
  provider: string;
}

export interface ExpenseResult {
  expense_id: string;
  submitted_amount: number;
  covered_amount: number;
  copay_amount: number;
  deductible_amount: number;
  member_pays: number;
  decision: Decision;
  reason: string;
  remaining_annual_limit: number;
  remaining_visit_limit?: number;
  remaining_sub_benefit_limit?: number;
}

export interface BenefitBalance {
  benefit_type: string;
  remaining_annual_limit: number;
  remaining_lifetime_limit?: number;
  visits_used: Record<string, number>;
  sub_benefit_used: Record<string, number>;
}

export interface CalculationSummary {
  policy_number: string;
  currency: string;
  total_submitted: number;
  total_covered: number;
  total_member_pays: number;
  remaining_balances: BenefitBalance[];
}

export interface CalculationOutput {
  results: ExpenseResult[];
  summary: CalculationSummary;
}
