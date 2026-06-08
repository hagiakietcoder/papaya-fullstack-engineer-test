import type { ComparisonRow, Plan } from '../types/plan';
import { formatCount, formatCurrency, formatDays, formatPercentage } from './formatters';

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    id: 'monthly-premium',
    label: 'Monthly Premium',
    direction: 'lower',
    getValue: (plan) => plan.monthly_premium,
    format: (plan) => formatCurrency(plan.monthly_premium),
  },
  {
    id: 'annual-limit',
    label: 'Annual Limit',
    direction: 'higher',
    getValue: (plan) => plan.annual_limit,
    format: (plan) => formatCurrency(plan.annual_limit),
  },
  {
    id: 'outpatient-visit-limit',
    label: 'Outpatient — Limit per Visit',
    direction: 'higher',
    getValue: (plan) => plan.benefits.outpatient?.limit_per_visit ?? null,
    format: (plan) =>
      plan.benefits.outpatient
        ? formatCurrency(plan.benefits.outpatient.limit_per_visit)
        : 'Not included',
    isIncluded: (plan) => plan.benefits.outpatient !== null,
  },
  {
    id: 'outpatient-visits',
    label: 'Outpatient — Visits per Year',
    direction: 'higher',
    getValue: (plan) => plan.benefits.outpatient?.visits_per_year ?? null,
    format: (plan) =>
      plan.benefits.outpatient
        ? formatCount(plan.benefits.outpatient.visits_per_year, 'visit')
        : 'Not included',
    isIncluded: (plan) => plan.benefits.outpatient !== null,
  },
  {
    id: 'inpatient-day-limit',
    label: 'Inpatient — Limit per Day',
    direction: 'higher',
    getValue: (plan) => plan.benefits.inpatient?.limit_per_day ?? null,
    format: (plan) =>
      plan.benefits.inpatient
        ? formatCurrency(plan.benefits.inpatient.limit_per_day)
        : 'Not included',
    isIncluded: (plan) => plan.benefits.inpatient !== null,
  },
  {
    id: 'inpatient-days',
    label: 'Inpatient — Days per Year',
    direction: 'higher',
    getValue: (plan) => plan.benefits.inpatient?.days_per_year ?? null,
    format: (plan) =>
      plan.benefits.inpatient
        ? formatCount(plan.benefits.inpatient.days_per_year, 'day')
        : 'Not included',
    isIncluded: (plan) => plan.benefits.inpatient !== null,
  },
  {
    id: 'dental',
    label: 'Dental Coverage',
    direction: 'higher',
    getValue: (plan) => plan.benefits.dental?.limit_per_year ?? null,
    format: (plan) =>
      plan.benefits.dental
        ? `${formatCurrency(plan.benefits.dental.limit_per_year)}/year`
        : 'Not included',
    isIncluded: (plan) => plan.benefits.dental !== null,
  },
  {
    id: 'maternity',
    label: 'Maternity Coverage',
    direction: 'higher',
    getValue: (plan) => plan.benefits.maternity?.limit_per_pregnancy ?? null,
    format: (plan) =>
      plan.benefits.maternity
        ? `${formatCurrency(plan.benefits.maternity.limit_per_pregnancy)}/pregnancy`
        : 'Not included',
    isIncluded: (plan) => plan.benefits.maternity !== null,
  },
  {
    id: 'copay',
    label: 'Copay',
    direction: 'lower',
    getValue: (plan) => plan.copay_percentage,
    format: (plan) => formatPercentage(plan.copay_percentage),
  },
  {
    id: 'waiting-period',
    label: 'Waiting Period',
    direction: 'lower',
    getValue: (plan) => plan.waiting_period_days,
    format: (plan) => formatDays(plan.waiting_period_days),
  },
];

function normalizeCompareValue(value: number): number {
  return value === -1 ? Number.POSITIVE_INFINITY : value;
}

export function getBestPlanNames(row: ComparisonRow, plans: Plan[]): string[] {
  const scoredPlans = plans
    .map((plan) => ({
      name: plan.name,
      value: row.getValue(plan),
    }))
    .filter((entry): entry is { name: string; value: number } => entry.value !== null);

  if (scoredPlans.length === 0) {
    return [];
  }

  const target =
    row.direction === 'higher'
      ? Math.max(...scoredPlans.map((entry) => normalizeCompareValue(entry.value)))
      : Math.min(...scoredPlans.map((entry) => normalizeCompareValue(entry.value)));

  return scoredPlans
    .filter((entry) => normalizeCompareValue(entry.value) === target)
    .map((entry) => entry.name);
}

export function isPlanIncluded(row: ComparisonRow, plan: Plan): boolean {
  if (row.isIncluded) {
    return row.isIncluded(plan);
  }

  return row.getValue(plan) !== null;
}

export function getPlanTierClass(name: string): string {
  return name.toLowerCase();
}
