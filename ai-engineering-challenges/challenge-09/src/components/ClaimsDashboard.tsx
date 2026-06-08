import { useMemo, useState } from 'react';
import type { Claim, DashboardFilters } from '../types/claim';
import { calculateKpis } from '../utils/analytics';
import { filterClaims, getDefaultFilters } from '../utils/filterClaims';
import { FilterBar } from './FilterBar';
import { KpiCards } from './KpiCards';
import { DashboardCharts } from './charts/DashboardCharts';
import { ClaimsTable } from './ClaimsTable';
import './ClaimsDashboard.css';

interface ClaimsDashboardProps {
  claims: Claim[];
}

export function ClaimsDashboard({ claims }: ClaimsDashboardProps) {
  const insurers = useMemo(
    () => [...new Set(claims.map((claim) => claim.insurer))].sort(),
    [claims],
  );

  const [filters, setFilters] = useState<DashboardFilters>(() => getDefaultFilters(claims));

  const filteredClaims = useMemo(() => filterClaims(claims, filters), [claims, filters]);
  const kpis = useMemo(() => calculateKpis(filteredClaims), [filteredClaims]);

  function updateFilters(patch: Partial<DashboardFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function handleDiagnosisClick(code: string) {
    setFilters((prev) => ({
      ...prev,
      diagnosisDrilldown: prev.diagnosisDrilldown === code ? null : code,
    }));
  }

  return (
    <div className="claims-dashboard">
      <header className="dashboard-header">
        <p className="dashboard-eyebrow">Papaya Insurance · Operations</p>
        <h1>Claims Analytics Dashboard</h1>
        <p className="dashboard-subtitle">
          Interactive view of {claims.length.toLocaleString()} claims across insurers and regions.
          All filters apply globally to KPIs, charts, and the detail table.
        </p>
      </header>

      <FilterBar
        filters={filters}
        insurers={insurers}
        onChange={updateFilters}
        onReset={() => setFilters(getDefaultFilters(claims))}
      />

      <KpiCards metrics={kpis} />

      <DashboardCharts
        claims={filteredClaims}
        selectedDiagnosis={filters.diagnosisDrilldown}
        onDiagnosisClick={handleDiagnosisClick}
      />

      <ClaimsTable claims={filteredClaims} />
    </div>
  );
}
