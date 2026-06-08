import type { Claim, KpiMetrics, TimeGrouping } from '../types/claim';

export function calculateKpis(claims: Claim[]): KpiMetrics {
  const totalClaims = claims.length;
  const decided = claims.filter((claim) => claim.status === 'APPROVED' || claim.status === 'REJECTED');
  const approved = claims.filter((claim) => claim.status === 'APPROVED');
  const approvalRate = decided.length > 0 ? (approved.length / decided.length) * 100 : 0;

  const processingDays = claims
    .filter((claim) => claim.processed_date)
    .map((claim) => {
      const start = new Date(`${claim.submitted_date}T00:00:00Z`).getTime();
      const end = new Date(`${claim.processed_date}T00:00:00Z`).getTime();
      return Math.max(Math.round((end - start) / (1000 * 60 * 60 * 24)), 0);
    });

  const avgProcessingDays =
    processingDays.length > 0
      ? processingDays.reduce((sum, days) => sum + days, 0) / processingDays.length
      : 0;

  const totalApprovedAmount = claims.reduce((sum, claim) => sum + claim.approved_amount, 0);
  const avgClaimAmount =
    totalClaims > 0
      ? claims.reduce((sum, claim) => sum + claim.submitted_amount, 0) / totalClaims
      : 0;

  return {
    totalClaims,
    approvalRate,
    avgProcessingDays,
    totalApprovedAmount,
    avgClaimAmount,
  };
}

export function groupByStatus(claims: Claim[]) {
  const counts = new Map<string, number>();
  for (const claim of claims) {
    counts.set(claim.status, (counts.get(claim.status) ?? 0) + 1);
  }

  return [...counts.entries()].map(([name, value]) => ({ name, value }));
}

function getWeekKey(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000) + 1;
  const week = Math.ceil(dayOfYear / 7);
  return `2024-W${String(week).padStart(2, '0')}`;
}

function getMonthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}

export function groupClaimsOverTime(claims: Claim[], grouping: TimeGrouping) {
  const counts = new Map<string, number>();

  for (const claim of claims) {
    const key = grouping === 'week' ? getWeekKey(claim.submitted_date) : getMonthKey(claim.submitted_date);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, count]) => ({ period, count }));
}

export function topDiagnosesByFrequency(claims: Claim[], limit = 10) {
  const counts = new Map<string, number>();
  for (const claim of claims) {
    counts.set(claim.diagnosis_icd10, (counts.get(claim.diagnosis_icd10) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([code, count]) => ({ code, count }));
}

export function topDiagnosesByCost(claims: Claim[], limit = 10) {
  const totals = new Map<string, number>();
  for (const claim of claims) {
    totals.set(
      claim.diagnosis_icd10,
      (totals.get(claim.diagnosis_icd10) ?? 0) + claim.submitted_amount,
    );
  }

  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([code, total]) => ({ code, total }));
}

export function processingTimeHistogram(claims: Claim[]) {
  const buckets = [
    { range: '1-3 days', min: 1, max: 3, count: 0 },
    { range: '4-7 days', min: 4, max: 7, count: 0 },
    { range: '8-14 days', min: 8, max: 14, count: 0 },
    { range: '15-21 days', min: 15, max: 21, count: 0 },
    { range: '22-30 days', min: 22, max: 30, count: 0 },
  ];

  for (const claim of claims) {
    if (!claim.processed_date) continue;

    const start = new Date(`${claim.submitted_date}T00:00:00Z`).getTime();
    const end = new Date(`${claim.processed_date}T00:00:00Z`).getTime();
    const days = Math.max(Math.round((end - start) / 86400000), 0);

    const bucket = buckets.find((item) => days >= item.min && days <= item.max);
    if (bucket) bucket.count += 1;
  }

  return buckets.map(({ range, count }) => ({ range, count }));
}

export function approvalRateByInsurer(claims: Claim[]) {
  const stats = new Map<string, { approved: number; decided: number }>();

  for (const claim of claims) {
    const current = stats.get(claim.insurer) ?? { approved: 0, decided: 0 };
    if (claim.status === 'APPROVED' || claim.status === 'REJECTED') {
      current.decided += 1;
      if (claim.status === 'APPROVED') current.approved += 1;
    }
    stats.set(claim.insurer, current);
  }

  return [...stats.entries()].map(([insurer, { approved, decided }]) => ({
    insurer,
    approvalRate: decided > 0 ? Math.round((approved / decided) * 1000) / 10 : 0,
    decided,
  }));
}

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `฿${(amount / 1_000_000).toFixed(2)}M`;
  }

  if (amount >= 1_000) {
    return `฿${(amount / 1_000).toFixed(1)}K`;
  }

  return `฿${Math.round(amount).toLocaleString('en-US')}`;
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
