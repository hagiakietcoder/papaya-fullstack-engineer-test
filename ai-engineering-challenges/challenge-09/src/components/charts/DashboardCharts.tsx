import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TimeGrouping } from '../../types/claim';
import {
  approvalRateByInsurer,
  groupByStatus,
  groupClaimsOverTime,
  processingTimeHistogram,
  topDiagnosesByCost,
  topDiagnosesByFrequency,
} from '../../utils/analytics';
import type { Claim } from '../../types/claim';
import { ChartCard } from './ChartCard';

const STATUS_COLORS: Record<string, string> = {
  APPROVED: '#16a34a',
  REJECTED: '#dc2626',
  PENDING: '#f59e0b',
  IN_REVIEW: '#3b82f6',
};

interface DashboardChartsProps {
  claims: Claim[];
  selectedDiagnosis: string | null;
  onDiagnosisClick: (code: string) => void;
}

export function DashboardCharts({
  claims,
  selectedDiagnosis,
  onDiagnosisClick,
}: DashboardChartsProps) {
  const [timeGrouping, setTimeGrouping] = useState<TimeGrouping>('month');

  const statusData = groupByStatus(claims);
  const timeData = groupClaimsOverTime(claims, timeGrouping);
  const freqData = topDiagnosesByFrequency(claims);
  const costData = topDiagnosesByCost(claims);
  const processingData = processingTimeHistogram(claims);
  const insurerData = approvalRateByInsurer(claims);

  return (
    <section className="charts-grid">
      <ChartCard title="Claims by Status" subtitle="Distribution of claim statuses">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
            >
              {statusData.map((entry) => (
                <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? '#94a3b8'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Claims Over Time"
        subtitle="Submitted claims grouped by period"
        action={
          <div className="chart-toggle">
            <button
              type="button"
              className={timeGrouping === 'week' ? 'active' : ''}
              onClick={() => setTimeGrouping('week')}
            >
              Week
            </button>
            <button
              type="button"
              className={timeGrouping === 'month' ? 'active' : ''}
              onClick={() => setTimeGrouping('month')}
            >
              Month
            </button>
          </div>
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="period" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#0f766e" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top 10 Diagnoses by Frequency" subtitle="Click a bar to drill down">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={freqData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="code" width={70} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar
              dataKey="count"
              fill="#0f766e"
              radius={[0, 4, 4, 0]}
              cursor="pointer"
              onClick={(data) => {
                if (data && 'code' in data) onDiagnosisClick(String(data.code));
              }}
            >
              {freqData.map((entry) => (
                <Cell
                  key={entry.code}
                  fill={selectedDiagnosis === entry.code ? '#047857' : '#0f766e'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Top 10 Diagnoses by Total Cost" subtitle="Sum of submitted amounts">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={costData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              tick={{ fontSize: 11 }}
              tickFormatter={(value: number) => `฿${(value / 1000).toFixed(0)}K`}
            />
            <YAxis type="category" dataKey="code" width={70} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value) => `฿${Number(value).toLocaleString()}`} />
            <Bar dataKey="total" fill="#0369a1" radius={[0, 4, 4, 0]} cursor="pointer" onClick={(data) => {
                if (data && 'code' in data) onDiagnosisClick(String(data.code));
              }}>
              {costData.map((entry) => (
                <Cell
                  key={entry.code}
                  fill={selectedDiagnosis === entry.code ? '#075985' : '#0369a1'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Processing Time Distribution" subtitle="Days from submission to processing">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="range" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Approval Rate by Insurer" subtitle="Approved / (Approved + Rejected)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={insurerData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="insurer" tick={{ fontSize: 10 }} interval={0} angle={-12} textAnchor="end" height={60} />
            <YAxis domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="approvalRate" fill="#16a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </section>
  );
}
