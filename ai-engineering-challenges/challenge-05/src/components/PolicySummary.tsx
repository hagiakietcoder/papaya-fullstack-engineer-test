import type { CopayRule, Policy } from '../types/policy';
import { computeQuickReference, formatCurrency, formatDate, formatLabel } from '../utils/formatters';
import './PolicySummary.css';

interface PolicySummaryProps {
  policy: Policy;
}

export function PolicySummary({ policy }: PolicySummaryProps) {
  const quickRef = computeQuickReference(policy);
  const currency = policy.plan.currency;

  return (
    <article className="policy-summary">
      <header className="policy-summary__header">
        <div>
          <p className="policy-summary__eyebrow">Papaya Insurance · Policy Summary</p>
          <h1>{policy.plan.name}</h1>
          <p className="policy-summary__meta">
            {policy.policy_number} · {formatLabel(policy.plan.tier)} tier ·{' '}
            {formatDate(policy.plan.effective_date)} – {formatDate(policy.plan.expiry_date)}
          </p>
        </div>
        <div className="policy-summary__tier">{policy.plan.tier}</div>
      </header>

      <section className="quick-ref" aria-label="Quick reference">
        <h2>Quick Reference</h2>
        <div className="quick-ref__grid">
          <div className="quick-ref__card quick-ref__card--primary">
            <span className="quick-ref__label">Total Annual Limit</span>
            <strong>{formatCurrency(quickRef.totalAnnualLimit, currency)}</strong>
          </div>
          <div className="quick-ref__card">
            <span className="quick-ref__label">Benefit Categories</span>
            <strong>{quickRef.benefitCount}</strong>
          </div>
          <div className="quick-ref__card">
            <span className="quick-ref__label">Covered Members</span>
            <strong>{policy.members.total.toLocaleString()}</strong>
          </div>
          <div className="quick-ref__card">
            <span className="quick-ref__label">Network Hospitals</span>
            <strong>{policy.network.hospital_count.toLocaleString()}</strong>
          </div>
        </div>
        <div className="quick-ref__copay">
          <span className="quick-ref__label">Copay rates</span>
          <div className="quick-ref__tags">
            {quickRef.copaySummary.map((item) => (
              <span key={item} className="quick-ref__tag">
                {item}
              </span>
            ))}
          </div>
        </div>
        {quickRef.lifetimeLimits.length > 0 && (
          <div className="quick-ref__lifetime">
            <span className="quick-ref__label">Lifetime limits</span>
            <div className="quick-ref__tags">
              {quickRef.lifetimeLimits.map((item) => (
                <span key={item.type} className="quick-ref__tag quick-ref__tag--lifetime">
                  {formatLabel(item.type)}: {formatCurrency(item.amount, currency)}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="summary-section">
        <h2>Policy Overview</h2>
        <dl className="summary-grid">
          <div>
            <dt>Policy number</dt>
            <dd>{policy.policy_number}</dd>
          </div>
          <div>
            <dt>Policyholder</dt>
            <dd>{policy.policyholder.name}</dd>
          </div>
          <div>
            <dt>Holder type</dt>
            <dd>{formatLabel(policy.policyholder.type)}</dd>
          </div>
          {policy.policyholder.industry && (
            <div>
              <dt>Industry</dt>
              <dd>{policy.policyholder.industry}</dd>
            </div>
          )}
          <div>
            <dt>Plan</dt>
            <dd>
              {policy.plan.name} ({policy.plan.tier})
            </dd>
          </div>
          <div>
            <dt>Coverage period</dt>
            <dd>
              {formatDate(policy.plan.effective_date)} – {formatDate(policy.plan.expiry_date)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="summary-section">
        <h2>Member Breakdown</h2>
        <div className="member-grid">
          <div className="member-card">
            <span>Total members</span>
            <strong>{policy.members.total.toLocaleString()}</strong>
          </div>
          <div className="member-card">
            <span>Employees</span>
            <strong>{policy.members.employee.toLocaleString()}</strong>
          </div>
          {policy.members.dependent_spouse !== undefined && (
            <div className="member-card">
              <span>Dependent spouses</span>
              <strong>{policy.members.dependent_spouse.toLocaleString()}</strong>
            </div>
          )}
          {policy.members.dependent_child !== undefined && (
            <div className="member-card">
              <span>Dependent children</span>
              <strong>{policy.members.dependent_child.toLocaleString()}</strong>
            </div>
          )}
        </div>
      </section>

      <section className="summary-section">
        <h2>Benefits & Limits</h2>
        {policy.benefits.map((benefit) => (
          <div key={benefit.type} className="benefit-block">
            <div className="benefit-block__header">
              <h3>{formatLabel(benefit.type)}</h3>
              <div className="benefit-block__limits">
                {benefit.annual_limit !== undefined && (
                  <span>Annual: {formatCurrency(benefit.annual_limit, currency)}</span>
                )}
                {benefit.lifetime_limit !== undefined && (
                  <span>Lifetime: {formatCurrency(benefit.lifetime_limit, currency)}</span>
                )}
                {benefit.waiting_period_days !== undefined && benefit.waiting_period_days > 0 && (
                  <span className="benefit-block__waiting">
                    Waiting period: {benefit.waiting_period_days} days
                  </span>
                )}
              </div>
            </div>
            <table className="benefit-table">
              <thead>
                <tr>
                  <th>Sub-benefit</th>
                  <th>Limit</th>
                </tr>
              </thead>
              <tbody>
                {benefit.sub_benefits.map((sub) => (
                  <tr key={sub.name}>
                    <td>{sub.name}</td>
                    <td>
                      {[
                        sub.limit_per_day !== undefined &&
                          `${formatCurrency(sub.limit_per_day, currency)}/day`,
                        sub.max_days !== undefined && `max ${sub.max_days} days`,
                        sub.limit_per_visit !== undefined &&
                          `${formatCurrency(sub.limit_per_visit, currency)}/visit`,
                        sub.visits_per_year !== undefined && `${sub.visits_per_year} visits/yr`,
                        sub.limit_per_event !== undefined &&
                          `${formatCurrency(sub.limit_per_event, currency)}/event`,
                        sub.limit_per_year !== undefined &&
                          `${formatCurrency(sub.limit_per_year, currency)}/year`,
                        sub.limit_per_pregnancy !== undefined &&
                          `${formatCurrency(sub.limit_per_pregnancy, currency)}/pregnancy`,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      <section className="summary-section">
        <h2>Copay Schedule</h2>
        <table className="copay-table">
          <thead>
            <tr>
              <th>Benefit type</th>
              <th>Copay</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(policy.copay).map(([type, rule]) => {
              const copayRule = rule as CopayRule;
              return (
              <tr key={type}>
                <td>{formatLabel(type)}</td>
                <td>
                  {copayRule.percentage === 0
                    ? 'No copay'
                    : `${copayRule.percentage}%${
                        copayRule.max_per_visit !== undefined
                          ? ` (max ${formatCurrency(copayRule.max_per_visit, currency)}/visit)`
                          : ''
                      }`}
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </section>

      {policy.benefits.some((b) => b.waiting_period_days) && (
        <section className="summary-section summary-section--warning">
          <h2>Waiting Periods</h2>
          <ul className="warning-list">
            {policy.benefits
              .filter((b) => b.waiting_period_days && b.waiting_period_days > 0)
              .map((benefit) => (
                <li key={benefit.type}>
                  <strong>{formatLabel(benefit.type)}:</strong> {benefit.waiting_period_days}{' '}
                  days before benefits become payable
                </li>
              ))}
          </ul>
        </section>
      )}

      <section className="summary-section summary-section--alert">
        <h2>Exclusions</h2>
        <p className="summary-section__intro">
          The following are not covered under this policy. Please review carefully before seeking
          treatment.
        </p>
        <ul className="exclusion-list">
          {policy.exclusions.map((exclusion) => (
            <li key={exclusion}>{exclusion}</li>
          ))}
        </ul>
      </section>

      <section className="summary-section">
        <h2>Network Information</h2>
        <dl className="summary-grid">
          <div>
            <dt>Network type</dt>
            <dd>{formatLabel(policy.network.type)}</dd>
          </div>
          <div>
            <dt>Hospitals in network</dt>
            <dd>{policy.network.hospital_count.toLocaleString()}</dd>
          </div>
          <div className="summary-grid__full">
            <dt>Coverage countries</dt>
            <dd>{policy.network.countries.join(', ')}</dd>
          </div>
        </dl>
      </section>

      <footer className="policy-summary__footer">
        <p>
          This summary is for reference only. The official policy contract prevails in case of any
          discrepancy.
        </p>
        <p>Generated by Papaya Insurance Policy Summary Tool</p>
      </footer>
    </article>
  );
}
