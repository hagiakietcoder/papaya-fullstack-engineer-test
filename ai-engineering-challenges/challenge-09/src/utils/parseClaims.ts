import type { Claim, ClaimStatus, ClaimType, Country } from '../types/claim';

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

export function parseClaimsCsv(csvText: string): Claim[] {
  const lines = csvText.trim().split(/\r?\n/);
  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const record = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));

    return {
      claim_id: record.claim_id,
      policy_id: record.policy_id,
      member_name: record.member_name,
      claim_type: record.claim_type as ClaimType,
      diagnosis_icd10: record.diagnosis_icd10,
      submitted_amount: Number(record.submitted_amount),
      approved_amount: Number(record.approved_amount),
      status: record.status as ClaimStatus,
      submitted_date: record.submitted_date,
      processed_date: record.processed_date || null,
      assessor: record.assessor,
      insurer: record.insurer,
      country: record.country as Country,
    };
  });
}
