import type { Benefit, CalculatorPolicy, SubBenefit } from '../types/index.js';

export interface BenefitState {
  benefit: Benefit;
  remainingAnnual: number;
  remainingLifetime?: number;
  visitsUsed: Record<string, number>;
  subBenefitYearUsed: Record<string, number>;
}

export interface PolicyState {
  policy: CalculatorPolicy;
  benefits: Map<string, BenefitState>;
  remainingDeductible: number;
}

export function createPolicyState(policy: CalculatorPolicy): PolicyState {
  const benefits = new Map<string, BenefitState>();

  for (const benefit of policy.benefits) {
    benefits.set(benefit.type, {
      benefit,
      remainingAnnual: benefit.annual_limit ?? benefit.lifetime_limit ?? 0,
      remainingLifetime: benefit.lifetime_limit,
      visitsUsed: {},
      subBenefitYearUsed: {},
    });
  }

  return {
    policy,
    benefits,
    remainingDeductible: policy.deductible.annual,
  };
}

export function findSubBenefit(benefit: Benefit, name: string): SubBenefit | undefined {
  return benefit.sub_benefits.find(
    (sub) => sub.name.toLowerCase() === name.toLowerCase(),
  );
}

export function getCopayKey(benefitType: string): string {
  return benefitType.toLowerCase();
}

export function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getVisitLimit(sub: SubBenefit): number | undefined {
  return sub.visits_per_year;
}

export function getRemainingVisits(state: BenefitState, sub: SubBenefit): number | undefined {
  const limit = getVisitLimit(sub);
  if (limit === undefined) {
    return undefined;
  }

  const used = state.visitsUsed[sub.name] ?? 0;
  return Math.max(limit - used, 0);
}

export function getRemainingSubBenefitYearLimit(
  state: BenefitState,
  sub: SubBenefit,
): number | undefined {
  if (sub.limit_per_year === undefined) {
    return undefined;
  }

  const used = state.subBenefitYearUsed[sub.name] ?? 0;
  return Math.max(sub.limit_per_year - used, 0);
}

export function applyPerEventCap(amount: number, sub: SubBenefit): number {
  if (sub.limit_per_visit !== undefined) {
    return Math.min(amount, sub.limit_per_visit);
  }

  if (sub.limit_per_event !== undefined) {
    return Math.min(amount, sub.limit_per_event);
  }

  if (sub.limit_per_year !== undefined) {
    return amount;
  }

  return amount;
}

export function snapshotBalances(state: PolicyState) {
  return [...state.benefits.values()].map((benefitState) => ({
    benefit_type: benefitState.benefit.type,
    remaining_annual_limit: benefitState.remainingAnnual,
    remaining_lifetime_limit: benefitState.remainingLifetime,
    visits_used: { ...benefitState.visitsUsed },
    sub_benefit_used: { ...benefitState.subBenefitYearUsed },
  }));
}
