import type { ReactNode } from 'react';
import './ChartCard.css';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function ChartCard({ title, subtitle, action, children }: ChartCardProps) {
  return (
    <article className="chart-card">
      <div className="chart-card-header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="chart-card-body">{children}</div>
    </article>
  );
}
