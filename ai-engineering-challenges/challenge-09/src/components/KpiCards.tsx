import type { KpiMetrics } from '../types/claim';
import { formatCurrency, formatNumber } from '../utils/analytics';
import './KpiCards.css';

interface KpiCardsProps {
  metrics: KpiMetrics;
}

const KPI_CONFIG = [
  { key: 'totalClaims', label: 'Total Claims', format: (v: number) => formatNumber(v) },
  { key: 'approvalRate', label: 'Approval Rate', format: (v: number) => `${formatNumber(v, 1)}%` },
  { key: 'avgProcessingDays', label: 'Avg Processing Time', format: (v: number) => `${formatNumber(v, 1)} days` },
  { key: 'totalApprovedAmount', label: 'Total Approved Amount', format: formatCurrency },
  { key: 'avgClaimAmount', label: 'Average Claim Amount', format: formatCurrency },
] as const;

export function KpiCards({ metrics }: KpiCardsProps) {
  return (
    <section className="kpi-grid" aria-label="Key performance indicators">
      {KPI_CONFIG.map((kpi) => (
        <article key={kpi.key} className="kpi-card">
          <p className="kpi-label">{kpi.label}</p>
          <p className="kpi-value">{kpi.format(metrics[kpi.key])}</p>
        </article>
      ))}
    </section>
  );
}
