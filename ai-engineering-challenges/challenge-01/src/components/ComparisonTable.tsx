import type { ComparisonRow, Plan } from '../types/plan';
import { getBestPlanNames, isPlanIncluded } from '../utils/comparison';
import './ComparisonTable.css';

interface ComparisonTableProps {
  plans: Plan[];
  rows: ComparisonRow[];
  recommendedPlanName: string;
}

function InclusionIcon({ included }: { included: boolean }) {
  if (included) {
    return (
      <span className="inclusion inclusion--yes" aria-label="Included">
        ✓
      </span>
    );
  }

  return (
    <span className="inclusion inclusion--no" aria-label="Not included">
      ✕
    </span>
  );
}

export function ComparisonTable({ plans, rows, recommendedPlanName }: ComparisonTableProps) {
  return (
    <>
      <div className="comparison-table-wrapper" role="region" aria-label="Plan comparison table">
        <table className="comparison-table">
          <thead>
            <tr>
              <th scope="col" className="comparison-table__feature-col">
                Coverage Details
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.name}
                  scope="col"
                  className={`comparison-table__plan-col comparison-table__plan-col--${plan.name.toLowerCase()}${
                    plan.name === recommendedPlanName ? ' comparison-table__plan-col--recommended' : ''
                  }`}
                >
                  <div className="plan-header">
                    <span className="plan-header__name">{plan.name}</span>
                    {plan.name === recommendedPlanName && (
                      <span className="badge badge--recommended">Recommended</span>
                    )}
                    <span className="plan-header__price">${plan.monthly_premium}/mo</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const bestPlans = getBestPlanNames(row, plans);

              return (
                <tr key={row.id}>
                  <th scope="row" className="comparison-table__feature-label">
                    {row.label}
                  </th>
                  {plans.map((plan) => {
                    const included = isPlanIncluded(row, plan);
                    const isBest = bestPlans.includes(plan.name);

                    return (
                      <td
                        key={`${row.id}-${plan.name}`}
                        className={`comparison-table__cell${
                          isBest ? ' comparison-table__cell--best' : ''
                        }${!included ? ' comparison-table__cell--excluded' : ''}`}
                      >
                        <div className="cell-content">
                          {row.isIncluded && <InclusionIcon included={included} />}
                          <span>{row.format(plan)}</span>
                          {isBest && included && (
                            <span className="best-tag" aria-label="Best value in this row">
                              Best
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="comparison-cards" aria-label="Plan comparison cards">
        {plans.map((plan) => (
          <article
            key={plan.name}
            className={`comparison-card comparison-card--${plan.name.toLowerCase()}${
              plan.name === recommendedPlanName ? ' comparison-card--recommended' : ''
            }`}
          >
            <header className="comparison-card__header">
              <div>
                <h2>{plan.name}</h2>
                {plan.name === recommendedPlanName && (
                  <span className="badge badge--recommended">Recommended</span>
                )}
              </div>
              <p className="comparison-card__price">${plan.monthly_premium}/month</p>
            </header>

            <ul className="comparison-card__highlights">
              {plan.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>

            <dl className="comparison-card__details">
              {rows.map((row) => {
                const included = isPlanIncluded(row, plan);
                const isBest = getBestPlanNames(row, plans).includes(plan.name);

                return (
                  <div
                    key={row.id}
                    className={`comparison-card__row${isBest ? ' comparison-card__row--best' : ''}`}
                  >
                    <dt>{row.label}</dt>
                    <dd>
                      <span className="comparison-card__value">
                        {row.isIncluded && <InclusionIcon included={included} />}
                        {row.format(plan)}
                      </span>
                      {isBest && included && <span className="best-tag">Best</span>}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </article>
        ))}
      </div>
    </>
  );
}
