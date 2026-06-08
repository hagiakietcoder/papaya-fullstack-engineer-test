export interface Policyholder {
  name: string;
  type: string;
  industry?: string;
  employee_count?: number;
}

export interface Plan {
  name: string;
  tier: string;
  effective_date: string;
  expiry_date: string;
  currency: string;
}

export interface Members {
  total: number;
  employee: number;
  dependent_spouse?: number;
  dependent_child?: number;
}

export interface SubBenefit {
  name: string;
  limit_per_day?: number;
  max_days?: number;
  limit_per_visit?: number;
  visits_per_year?: number;
  limit_per_event?: number;
  limit_per_year?: number;
  limit_per_pregnancy?: number;
}

export interface Benefit {
  type: string;
  annual_limit?: number;
  lifetime_limit?: number;
  waiting_period_days?: number;
  sub_benefits: SubBenefit[];
}

export interface CopayRule {
  percentage: number;
  max_per_visit?: number;
}

export interface Copay {
  [benefitType: string]: CopayRule;
}

export interface Network {
  type: string;
  hospital_count: number;
  countries: string[];
}

export interface Policy {
  policy_number: string;
  policyholder: Policyholder;
  plan: Plan;
  members: Members;
  benefits: Benefit[];
  exclusions: string[];
  copay: Copay;
  network: Network;
}

export interface QuickReferenceStats {
  totalAnnualLimit: number;
  lifetimeLimits: { type: string; amount: number }[];
  benefitCount: number;
  copaySummary: string[];
  waitingPeriodCount: number;
}
