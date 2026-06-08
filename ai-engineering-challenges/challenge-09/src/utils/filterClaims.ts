import type { Claim, DashboardFilters } from '../types/claim';

export function filterClaims(claims: Claim[], filters: DashboardFilters): Claim[] {
  return claims.filter((claim) => {
    if (claim.submitted_date < filters.dateFrom || claim.submitted_date > filters.dateTo) {
      return false;
    }

    if (filters.claimTypes.length > 0 && !filters.claimTypes.includes(claim.claim_type)) {
      return false;
    }

    if (filters.insurers.length > 0 && !filters.insurers.includes(claim.insurer)) {
      return false;
    }

    if (filters.countries.length > 0 && !filters.countries.includes(claim.country)) {
      return false;
    }

    if (filters.statuses.length > 0 && !filters.statuses.includes(claim.status)) {
      return false;
    }

    if (filters.diagnosisDrilldown && claim.diagnosis_icd10 !== filters.diagnosisDrilldown) {
      return false;
    }

    return true;
  });
}

export function getDefaultFilters(claims: Claim[]): DashboardFilters {
  const dates = claims.map((claim) => claim.submitted_date).sort();

  return {
    dateFrom: dates[0] ?? '2024-01-01',
    dateTo: dates[dates.length - 1] ?? '2024-12-31',
    claimTypes: [],
    insurers: [],
    countries: [],
    statuses: [],
    diagnosisDrilldown: null,
  };
}
