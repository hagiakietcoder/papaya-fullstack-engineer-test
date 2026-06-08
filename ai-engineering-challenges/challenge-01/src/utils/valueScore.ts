import type { Plan } from '../types/plan';

/**
 * Value-for-money score balances coverage against cost and affordability.
 * Coverage efficiency = annual_limit / annual_premium
 * Affordability factor penalizes plans far from the mid-tier price (better for typical buyers)
 */
export function calculateValueScore(plan: Plan): number {
  const annualPremium = plan.monthly_premium * 12;
  const coverageEfficiency = plan.annual_limit / annualPremium;

  const activeBenefits = Object.values(plan.benefits).filter(Boolean).length;
  const benefitBonus = activeBenefits * 0.02;

  const copayPenalty = plan.copay_percentage * 0.001;
  const waitingPenalty = plan.waiting_period_days * 0.0002;

  const midTierPremium = 350;
  const affordabilityFactor = 1 - Math.abs(plan.monthly_premium - midTierPremium) / 700;

  return coverageEfficiency * affordabilityFactor + benefitBonus - copayPenalty - waitingPenalty;
}

export function getRecommendedPlanName(plans: Plan[]): string {
  return plans.reduce((best, plan) =>
    calculateValueScore(plan) > calculateValueScore(best) ? plan : best,
  ).name;
}
