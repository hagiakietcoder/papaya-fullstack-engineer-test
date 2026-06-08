import type { Policy, QuickReferenceStats, SubBenefit } from '../types/policy';

const CURRENCY_SYMBOLS: Record<string, string> = {
  THB: '฿',
  USD: '$',
  VND: '₫',
  SGD: 'S$',
};

export function formatCurrency(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  return `${symbol}${amount.toLocaleString('en-US')}`;
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatLabel(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

export function formatSubBenefitLimit(sub: SubBenefit, currency: string): string {
  const parts: string[] = [];

  if (sub.limit_per_day !== undefined) {
    parts.push(`${formatCurrency(sub.limit_per_day, currency)}/day`);
  }
  if (sub.max_days !== undefined) {
    parts.push(`max ${sub.max_days} days`);
  }
  if (sub.limit_per_visit !== undefined) {
    parts.push(`${formatCurrency(sub.limit_per_visit, currency)}/visit`);
  }
  if (sub.visits_per_year !== undefined) {
    parts.push(`${sub.visits_per_year} visits/year`);
  }
  if (sub.limit_per_event !== undefined) {
    parts.push(`${formatCurrency(sub.limit_per_event, currency)}/event`);
  }
  if (sub.limit_per_year !== undefined) {
    parts.push(`${formatCurrency(sub.limit_per_year, currency)}/year`);
  }
  if (sub.limit_per_pregnancy !== undefined) {
    parts.push(`${formatCurrency(sub.limit_per_pregnancy, currency)}/pregnancy`);
  }

  return parts.join(' · ') || '—';
}

export function formatCopay(percentage: number, maxPerVisit?: number, currency?: string): string {
  if (percentage === 0) {
    return 'No copay';
  }

  const base = `${percentage}%`;
  if (maxPerVisit !== undefined && currency) {
    return `${base} (max ${formatCurrency(maxPerVisit, currency)}/visit)`;
  }

  return base;
}

export function computeQuickReference(policy: Policy): QuickReferenceStats {
  const totalAnnualLimit = policy.benefits.reduce(
    (sum, benefit) => sum + (benefit.annual_limit ?? 0),
    0,
  );

  const lifetimeLimits = policy.benefits
    .filter((benefit) => benefit.lifetime_limit !== undefined)
    .map((benefit) => ({
      type: benefit.type,
      amount: benefit.lifetime_limit!,
    }));

  const copaySummary = Object.entries(policy.copay).map(([type, rule]) =>
    `${formatLabel(type)}: ${formatCopay(rule.percentage, rule.max_per_visit, policy.plan.currency)}`,
  );

  const waitingPeriodCount = policy.benefits.filter(
    (benefit) => benefit.waiting_period_days !== undefined && benefit.waiting_period_days > 0,
  ).length;

  return {
    totalAnnualLimit,
    lifetimeLimits,
    benefitCount: policy.benefits.length,
    copaySummary,
    waitingPeriodCount,
  };
}
