import { PLANS } from '../data/plans';
import { COMPARISON_ROWS } from '../utils/comparison';
import { getRecommendedPlanName } from '../utils/valueScore';
import { ComparisonTable } from './ComparisonTable';
import './PlanComparison.css';

export function PlanComparison() {
  const recommendedPlanName = getRecommendedPlanName(PLANS);

  return (
    <div className="plan-comparison">
      <header className="plan-comparison__hero">
        <p className="plan-comparison__eyebrow">Papaya Insurtech</p>
        <h1>Compare Health Insurance Plans</h1>
        <p className="plan-comparison__subtitle">
          Review coverage limits, benefits, and pricing side by side to choose the plan that
          fits your needs.
        </p>
      </header>

      <ComparisonTable
        plans={PLANS}
        rows={COMPARISON_ROWS}
        recommendedPlanName={recommendedPlanName}
      />

      <footer className="plan-comparison__footer">
        <p>
          <strong>Recommended plan:</strong> {recommendedPlanName} — selected by value-for-money
          score (coverage efficiency adjusted for affordability, benefits, copay, and waiting
          period).
        </p>
        <p className="plan-comparison__note">
          Unlimited benefits are marked as &ldquo;Unlimited&rdquo;. Rows highlight the best value
          in each category.
        </p>
      </footer>
    </div>
  );
}
