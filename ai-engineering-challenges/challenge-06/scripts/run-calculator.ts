import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { calculateBenefits } from '../src/calculator/calculateBenefits.js';
import expenses from '../src/data/expenses.json' with { type: 'json' };
import policy from '../src/data/policy.json' with { type: 'json' };
import type { Expense } from '../src/types/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, '../output/calculation-results.json');

const output = calculateBenefits(policy, expenses as Expense[]);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

console.log(`Processed ${output.results.length} expenses`);
console.log(`Total covered: ${output.summary.total_covered.toLocaleString()} ${output.summary.currency}`);
console.log(`Results written to ${outputPath}`);

for (const result of output.results) {
  console.log(
    `${result.expense_id} | ${result.decision} | covered=${result.covered_amount} | ${result.reason}`,
  );
}
