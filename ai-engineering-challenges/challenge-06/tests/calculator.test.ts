import { describe, expect, it } from 'vitest';
import { calculateBenefits } from '../src/calculator/calculateBenefits.js';
import expenses from '../src/data/expenses.json' with { type: 'json' };
import policy from '../src/data/policy.json' with { type: 'json' };
import type { CalculatorPolicy, Expense } from '../src/types/index.js';

const basePolicy = policy as CalculatorPolicy;
const allExpenses = expenses as Expense[];

function singleExpense(expense: Expense) {
  return calculateBenefits(basePolicy, [expense]).results[0];
}

describe('calculateBenefits', () => {
  it('processes all 20 expenses chronologically', () => {
    const output = calculateBenefits(basePolicy, allExpenses);
    expect(output.results).toHaveLength(20);
    expect(output.results[0].expense_id).toBe('EXP-001');
    expect(output.results[1].expense_id).toBe('EXP-002');
  });

  it('applies outpatient deductible before coverage begins', () => {
    const result = singleExpense(allExpenses[0]);
    expect(result.deductible_amount).toBe(2500);
    expect(result.covered_amount).toBe(0);
    expect(result.decision).toBe('PARTIALLY_COVERED');
    expect(result.reason).toContain('Deductible');
  });

  it('applies outpatient copay after deductible is met', () => {
    const output = calculateBenefits(basePolicy, [allExpenses[0], allExpenses[2]]);
    const second = output.results.find((item) => item.expense_id === 'EXP-003')!;
    expect(second.copay_amount).toBeGreaterThan(0);
    expect(second.covered_amount).toBeGreaterThan(0);
    expect(second.decision).toMatch(/COVERED/);
  });

  it('caps doctor visit to per-visit sub-limit', () => {
    const result = singleExpense(allExpenses[3]);
    expect(result.submitted_amount).toBe(3200);
    expect(result.covered_amount).toBeLessThanOrEqual(3000);
    expect(result.reason).toContain('per-visit');
  });

  it('denies dental claim during waiting period', () => {
    const result = singleExpense(allExpenses[1]);
    expect(result.decision).toBe('DENIED');
    expect(result.covered_amount).toBe(0);
    expect(result.reason).toContain('Waiting period');
  });

  it('denies excluded cosmetic diagnosis', () => {
    const result = singleExpense(allExpenses[4]);
    expect(result.decision).toBe('DENIED');
    expect(result.reason).toContain('Cosmetic');
  });

  it('denies maternity claim before waiting period ends', () => {
    const result = singleExpense(allExpenses[11]);
    expect(result.decision).toBe('DENIED');
    expect(result.reason).toContain('Waiting period');
  });

  it('consumes shared annual limits across multiple inpatient claims', () => {
    const inpatientExpenses = allExpenses.filter((item) => item.benefit_type === 'INPATIENT');
    const output = calculateBenefits(basePolicy, inpatientExpenses);
    const totalCovered = output.results.reduce((sum, item) => sum + item.covered_amount, 0);
    expect(totalCovered).toBeLessThanOrEqual(500000);
    expect(output.summary.remaining_balances.find((b) => b.benefit_type === 'INPATIENT')?.remaining_annual_limit).toBeGreaterThanOrEqual(0);
  });

  it('reduces diagnostic tests to remaining annual sub-benefit limit', () => {
    const output = calculateBenefits(basePolicy, [allExpenses[7]]);
    const result = output.results[0];
    expect(result.submitted_amount).toBe(22000);
    expect(result.covered_amount).toBeLessThan(22000);
    expect(result.remaining_sub_benefit_limit).toBe(0);
  });

  it('denies outpatient doctor visit when visit count is exhausted', () => {
    const output = calculateBenefits(basePolicy, allExpenses);
    const visitDenied = output.results.find((item) => item.expense_id === 'EXP-019');
    expect(visitDenied?.decision).toBe('DENIED');
    expect(visitDenied?.reason).toContain('visit limit exhausted');
  });

  it('provides summary balances after processing all expenses', () => {
    const output = calculateBenefits(basePolicy, allExpenses);
    expect(output.summary.total_submitted).toBeGreaterThan(0);
    expect(output.summary.total_covered).toBeGreaterThan(0);
    expect(output.summary.remaining_balances.length).toBe(basePolicy.benefits.length);
  });

  it('denies claim when annual benefit limit is already exhausted', () => {
    const nearExhaustionPolicy: CalculatorPolicy = {
      ...basePolicy,
      benefits: basePolicy.benefits.map((benefit) =>
        benefit.type === 'OUTPATIENT'
          ? { ...benefit, annual_limit: 1000 }
          : benefit,
      ),
      deductible: { annual: 0, applies_to: [] },
    };

    const output = calculateBenefits(nearExhaustionPolicy, [
      allExpenses[0],
      allExpenses[2],
      allExpenses[3],
    ]);

    expect(output.results.some((item) => item.reason.includes('Annual benefit limit exhausted'))).toBe(true);
  });

  it('covers inpatient claim with zero copay in full when within limits', () => {
    const result = singleExpense({
      expense_id: 'TEST-INP',
      date: '2024-05-15',
      benefit_type: 'INPATIENT',
      sub_benefit: 'Ambulance',
      amount: 3000,
      diagnosis: 'Emergency',
      provider: 'Test Hospital',
    });

    expect(result.copay_amount).toBe(0);
    expect(result.covered_amount).toBe(3000);
    expect(result.decision).toBe('COVERED');
  });
});
