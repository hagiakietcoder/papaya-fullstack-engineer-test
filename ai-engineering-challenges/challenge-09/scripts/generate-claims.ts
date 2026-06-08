import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(__dirname, '../public/data/claims.csv');

const MEMBER_NAMES = [
  'Somchai Prasert', 'Naree Prasert', 'Pimchanok Prasert', 'Thanawat Prasert',
  'Nguyen Van Minh', 'Tran Thi Lan', 'Le Hoang Nam', 'Pham Thu Huong',
  'Chan Wai Ming', 'Wong Mei Ling', 'Lee Ka Fai', 'Cheung Siu Yan',
  'Apinya Somboon', 'Kiet Nguyen', 'Hana Wong', 'Arthit Pong',
  'Linh Tran', 'Marcus Lee', 'Dao Siri', 'Yuki Tanaka',
];

const ICD10 = [
  'J06.9', 'J20.9', 'I10', 'E11.9', 'M54.5', 'K21.9', 'J45.909', 'N39.0',
  'K02.9', 'O80', 'J18.9', 'R51.9', 'E78.5', 'F41.1', 'H66.90', 'K35.80',
  'S93.401A', 'Z00.00', 'K08.89', 'O26.9',
];

const ICD10_BY_TYPE: Record<string, string[]> = {
  OUTPATIENT: ['J06.9', 'J20.9', 'I10', 'E11.9', 'M54.5', 'K21.9', 'R51.9', 'E78.5', 'F41.1', 'H66.90', 'Z00.00'],
  INPATIENT: ['J18.9', 'K35.80', 'I10', 'E11.9', 'M54.5'],
  DENTAL: ['K02.9', 'K08.89'],
  MATERNITY: ['O80', 'O26.9'],
};

const ASSESSORS = ['Siriporn Wattana', 'Anan Chaiyaporn', 'Malee Srisuk', 'David Chen', 'Priya Nair'];
const INSURERS = ['Papaya Health', 'AsiaCare Insurance', 'Pacific Shield'];
const COUNTRIES = ['Thailand', 'Vietnam', 'Hong Kong'] as const;

const CLAIM_TYPE_WEIGHTS: Array<{ type: string; weight: number }> = [
  { type: 'OUTPATIENT', weight: 0.58 },
  { type: 'INPATIENT', weight: 0.14 },
  { type: 'DENTAL', weight: 0.16 },
  { type: 'MATERNITY', weight: 0.12 },
];

const STATUS_WEIGHTS: Array<{ status: string; weight: number }> = [
  { status: 'APPROVED', weight: 0.64 },
  { status: 'REJECTED', weight: 0.15 },
  { status: 'PENDING', weight: 0.11 },
  { status: 'IN_REVIEW', weight: 0.10 },
];

let seed = 42;
function random(): number {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}

function pickWeighted<T extends { weight: number }>(items: T[]): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let roll = random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(random() * arr.length)];
}

function skewedAmount(claimType: string): number {
  const roll = random();
  if (claimType === 'INPATIENT' && roll > 0.7) {
    return Math.round(80000 + random() * 1920000);
  }
  if (claimType === 'MATERNITY' && roll > 0.5) {
    return Math.round(15000 + random() * 85000);
  }
  if (roll < 0.6) {
    return Math.round(500 + random() * 4500);
  }
  if (roll < 0.9) {
    return Math.round(5000 + random() * 45000);
  }
  return Math.round(50000 + random() * 450000);
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function csvEscape(value: string | number | null): string {
  if (value === null) return '';
  const text = String(value);
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

const ROW_COUNT = 5000;
const rows: string[] = [
  'claim_id,policy_id,member_name,claim_type,diagnosis_icd10,submitted_amount,approved_amount,status,submitted_date,processed_date,assessor,insurer,country',
];

for (let i = 1; i <= ROW_COUNT; i++) {
  const claimType = pickWeighted(CLAIM_TYPE_WEIGHTS).type;
  const status = pickWeighted(STATUS_WEIGHTS).status;
  const diagnosisPool = ICD10_BY_TYPE[claimType] ?? ICD10;
  const diagnosis = pick(diagnosisPool);

  const month = Math.floor(random() * 12);
  const day = 1 + Math.floor(random() * 28);
  const submittedDate = new Date(2024, month, day);

  let processedDate: string | null = null;
  let processingDays = 0;

  if (status !== 'PENDING') {
    const fastRoll = random();
    if (fastRoll < 0.65) {
      processingDays = 1 + Math.floor(random() * 10);
    } else if (fastRoll < 0.9) {
      processingDays = 11 + Math.floor(random() * 10);
    } else {
      processingDays = 21 + Math.floor(random() * 10);
    }
    processedDate = formatDate(addDays(submittedDate, processingDays));
  }

  const submittedAmount = skewedAmount(claimType);
  let approvedAmount = 0;

  if (status === 'APPROVED') {
    const ratio = 0.72 + random() * 0.28;
    approvedAmount = Math.round(submittedAmount * ratio);
  } else if (status === 'IN_REVIEW') {
    approvedAmount = Math.round(submittedAmount * (0.5 + random() * 0.4));
  }

  const row = [
    `CLM-${String(i).padStart(5, '0')}`,
    `POL-${String(10000 + Math.floor(random() * 90000)).padStart(5, '0')}`,
    pick(MEMBER_NAMES),
    claimType,
    diagnosis,
    submittedAmount,
    approvedAmount,
    status,
    formatDate(submittedDate),
    processedDate,
    pick(ASSESSORS),
    pick(INSURERS),
    pick([...COUNTRIES]),
  ].map(csvEscape).join(',');

  rows.push(row);
}

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, rows.join('\n'), 'utf-8');
console.log(`Generated ${ROW_COUNT} claims -> ${OUTPUT}`);
