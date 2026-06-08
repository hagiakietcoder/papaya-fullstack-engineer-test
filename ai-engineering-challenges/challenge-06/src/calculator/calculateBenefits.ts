import type {
  CalculationOutput,
  CalculatorPolicy,
  Decision,
  Expense,
  ExpenseResult,
} from '../types/index.js';
import {
  applyPerEventCap,
  createPolicyState,
  daysBetween,
  findSubBenefit,
  getCopayKey,
  getRemainingSubBenefitYearLimit,
  getRemainingVisits,
  getVisitLimit,
  snapshotBalances,
  type PolicyState,
} from './policyState.js';

function formatAmount(amount: number, currency: string): string {
  return `${amount.toLocaleString('en-US')} ${currency}`;
}

function buildDeniedResult(
  expense: Expense,
  state: PolicyState,
  reason: string,
  remainingVisitLimit?: number,
  remainingSubBenefitLimit?: number,
): ExpenseResult {
  const benefitState = state.benefits.get(expense.benefit_type);

  return {
    expense_id: expense.expense_id,
    submitted_amount: expense.amount,
    covered_amount: 0,
    copay_amount: 0,
    deductible_amount: 0,
    member_pays: expense.amount,
    decision: 'DENIED',
    reason,
    remaining_annual_limit: benefitState?.remainingAnnual ?? 0,
    remaining_visit_limit: remainingVisitLimit,
    remaining_sub_benefit_limit: remainingSubBenefitLimit,
  };
}

function checkExclusion(policy: CalculatorPolicy, expense: Expense): string | null {
  for (const exclusion of policy.exclusions) {
    const field = exclusion.match_field ?? 'diagnosis';
    const value = field === 'diagnosis' ? expense.diagnosis : expense.sub_benefit;

    if (value.toLowerCase().includes(exclusion.match.toLowerCase())) {
      return exclusion.reason;
    }
  }

  return null;
}

function determineDecision(
  submitted: number,
  covered: number,
  deductibleApplied: number,
  copayAmount: number,
  hadLimitReduction: boolean,
): Decision {
  if (covered === 0) {
    return deductibleApplied > 0 || copayAmount > 0 ? 'PARTIALLY_COVERED' : 'DENIED';
  }

  if (covered === submitted && !hadLimitReduction && deductibleApplied === 0 && copayAmount === 0) {
    return 'COVERED';
  }

  return 'PARTIALLY_COVERED';
}

function processExpense(state: PolicyState, expense: Expense): ExpenseResult {
  const { policy } = state;
  const benefitState = state.benefits.get(expense.benefit_type);

  if (!benefitState) {
    return buildDeniedResult(
      expense,
      state,
      `Benefit type ${expense.benefit_type} is not covered under this policy.`,
    );
  }

  const subBenefit = findSubBenefit(benefitState.benefit, expense.sub_benefit);
  if (!subBenefit) {
    return buildDeniedResult(
      expense,
      state,
      `Sub-benefit "${expense.sub_benefit}" is not defined under ${expense.benefit_type}.`,
    );
  }

  const exclusionReason = checkExclusion(policy, expense);
  if (exclusionReason) {
    return buildDeniedResult(expense, state, exclusionReason);
  }

  const waitingDays = benefitState.benefit.waiting_period_days ?? 0;
  if (waitingDays > 0) {
    const elapsed = daysBetween(policy.effective_date, expense.date);
    if (elapsed < waitingDays) {
      return buildDeniedResult(
        expense,
        state,
        `Waiting period not satisfied. ${waitingDays} days required; only ${elapsed} days elapsed since policy effective date.`,
      );
    }
  }

  const remainingVisits = getRemainingVisits(benefitState, subBenefit);
  if (remainingVisits !== undefined && remainingVisits <= 0) {
    return buildDeniedResult(
      expense,
      state,
      `Annual visit limit exhausted for ${subBenefit.name}.`,
      0,
    );
  }

  const remainingSubYear = getRemainingSubBenefitYearLimit(benefitState, subBenefit);
  if (remainingSubYear !== undefined && remainingSubYear <= 0) {
    return buildDeniedResult(
      expense,
      state,
      `Annual sub-benefit limit exhausted for ${subBenefit.name}.`,
      remainingVisits,
      0,
    );
  }

  if (benefitState.remainingAnnual <= 0) {
    return buildDeniedResult(
      expense,
      state,
      `Annual benefit limit exhausted for ${expense.benefit_type}.`,
      remainingVisits,
      remainingSubYear,
    );
  }

  let eligible = applyPerEventCap(expense.amount, subBenefit);
  const perVisitCapped = eligible < expense.amount;

  const subYearAtStart = remainingSubYear;
  if (remainingSubYear !== undefined) {
    eligible = Math.min(eligible, remainingSubYear);
  }

  const subBenefitConsumption = eligible;

  let deductibleApplied = 0;
  if (policy.deductible.applies_to.includes(expense.benefit_type) && state.remainingDeductible > 0) {
    deductibleApplied = Math.min(eligible, state.remainingDeductible);
    eligible -= deductibleApplied;
    state.remainingDeductible -= deductibleApplied;
  }

  const copayRule = policy.copay[getCopayKey(expense.benefit_type)];
  let copayAmount = 0;

  if (copayRule && eligible > 0) {
    copayAmount = Math.round((eligible * copayRule.percentage) / 100);
    if (copayRule.max_per_visit !== undefined) {
      copayAmount = Math.min(copayAmount, copayRule.max_per_visit);
    }
  }

  let insurerPortion = Math.max(eligible - copayAmount, 0);
  const beforeAnnualCap = insurerPortion;
  insurerPortion = Math.min(insurerPortion, benefitState.remainingAnnual);

  if (benefitState.remainingLifetime !== undefined) {
    insurerPortion = Math.min(insurerPortion, benefitState.remainingLifetime);
  }

  const annualLimitReduced = insurerPortion < beforeAnnualCap;
  const coveredAmount = insurerPortion;
  const memberPays = expense.amount - coveredAmount;

  benefitState.remainingAnnual -= coveredAmount;
  if (benefitState.remainingLifetime !== undefined) {
    benefitState.remainingLifetime -= coveredAmount;
  }

  if (subBenefit.limit_per_year !== undefined && subBenefitConsumption > 0) {
    benefitState.subBenefitYearUsed[subBenefit.name] =
      (benefitState.subBenefitYearUsed[subBenefit.name] ?? 0) + subBenefitConsumption;
  }

  const hadLimitReduction =
    perVisitCapped ||
    annualLimitReduced ||
    (subYearAtStart !== undefined && subBenefitConsumption < expense.amount);

  const decision = determineDecision(
    expense.amount,
    coveredAmount,
    deductibleApplied,
    copayAmount,
    hadLimitReduction,
  );

  if (getVisitLimit(subBenefit) !== undefined && decision !== 'DENIED') {
    benefitState.visitsUsed[subBenefit.name] =
      (benefitState.visitsUsed[subBenefit.name] ?? 0) + 1;
  }

  const reasonParts: string[] = [];

  if (decision === 'DENIED') {
    if (deductibleApplied > 0 && eligible === 0) {
      reasonParts.push(
        `Full amount applied to annual deductible (${formatAmount(deductibleApplied, policy.currency)}).`,
      );
    } else {
      reasonParts.push('No payable amount after policy rules were applied.');
    }
  } else {
    if (perVisitCapped) {
      reasonParts.push(`Capped to per-visit limit of ${formatAmount(subBenefit.limit_per_visit!, policy.currency)}.`);
    }

    if (deductibleApplied > 0) {
      reasonParts.push(`Deductible applied: ${formatAmount(deductibleApplied, policy.currency)}.`);
    }

    if (copayAmount > 0) {
      reasonParts.push(
        `${copayRule?.percentage ?? 0}% copay applied (${formatAmount(copayAmount, policy.currency)}).`,
      );
    }

    if (annualLimitReduced) {
      reasonParts.push('Reduced due to remaining annual benefit limit.');
    }

    if (remainingSubYear !== undefined && coveredAmount < expense.amount - memberPays + coveredAmount) {
      // sub limit messaging handled via partial
    }

    reasonParts.push(
      `Covered: ${formatAmount(coveredAmount, policy.currency)}. Member pays: ${formatAmount(memberPays, policy.currency)}.`,
    );
  }

  return {
    expense_id: expense.expense_id,
    submitted_amount: expense.amount,
    covered_amount: coveredAmount,
    copay_amount: copayAmount,
    deductible_amount: deductibleApplied,
    member_pays: memberPays,
    decision,
    reason: reasonParts.join(' '),
    remaining_annual_limit: benefitState.remainingAnnual,
    remaining_visit_limit: getRemainingVisits(benefitState, subBenefit),
    remaining_sub_benefit_limit: getRemainingSubBenefitYearLimit(benefitState, subBenefit),
  };
}

export function calculateBenefits(
  policy: CalculatorPolicy,
  expenses: Expense[],
): CalculationOutput {
  const state = createPolicyState(policy);
  const sorted = [...expenses].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const results = sorted.map((expense) => processExpense(state, expense));

  const summary = {
    policy_number: policy.policy_number,
    currency: policy.currency,
    total_submitted: results.reduce((sum, item) => sum + item.submitted_amount, 0),
    total_covered: results.reduce((sum, item) => sum + item.covered_amount, 0),
    total_member_pays: results.reduce((sum, item) => sum + item.member_pays, 0),
    remaining_balances: snapshotBalances(state),
  };

  return { results, summary };
}
