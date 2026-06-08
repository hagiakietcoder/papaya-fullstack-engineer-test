import type { ClaimStatus, ClaimType, Country, DashboardFilters } from '../types/claim';
import { CLAIM_TYPES, COUNTRIES, STATUSES } from '../types/claim';
import { FilterDropdown } from './FilterDropdown';
import './FilterBar.css';

interface FilterBarProps {
  filters: DashboardFilters;
  insurers: string[];
  onChange: (patch: Partial<DashboardFilters>) => void;
  onReset: () => void;
}

export function FilterBar({ filters, insurers, onChange, onReset }: FilterBarProps) {
  return (
    <section className="filter-bar" aria-label="Dashboard filters">
      <div className="filter-row">
        <div className="date-filter">
          <label>
            <span className="filter-label">From</span>
            <input
              type="date"
              value={filters.dateFrom}
              min="2024-01-01"
              max={filters.dateTo}
              onChange={(event) => onChange({ dateFrom: event.target.value })}
            />
          </label>
          <label>
            <span className="filter-label">To</span>
            <input
              type="date"
              value={filters.dateTo}
              min={filters.dateFrom}
              max="2024-12-31"
              onChange={(event) => onChange({ dateTo: event.target.value })}
            />
          </label>
        </div>

        <FilterDropdown<ClaimType>
          label="Claim Type"
          options={CLAIM_TYPES}
          selected={filters.claimTypes}
          onChange={(claimTypes) => onChange({ claimTypes })}
        />

        <FilterDropdown
          label="Insurer"
          options={insurers}
          selected={filters.insurers}
          onChange={(insurers) => onChange({ insurers })}
        />

        <FilterDropdown<Country>
          label="Country"
          options={COUNTRIES}
          selected={filters.countries}
          onChange={(countries) => onChange({ countries })}
        />

        <FilterDropdown<ClaimStatus>
          label="Status"
          options={STATUSES}
          selected={filters.statuses}
          onChange={(statuses) => onChange({ statuses })}
        />

        <button type="button" className="reset-btn" onClick={onReset}>
          Reset filters
        </button>
      </div>

      {filters.diagnosisDrilldown && (
        <div className="drilldown-banner">
          Showing claims for diagnosis: <strong>{filters.diagnosisDrilldown}</strong>
          <button type="button" onClick={() => onChange({ diagnosisDrilldown: null })}>
            Clear
          </button>
        </div>
      )}
    </section>
  );
}
